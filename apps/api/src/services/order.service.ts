import { randomUUID } from "node:crypto";
import { sequelize } from "../config/database.js";
import type { CheckoutInput } from "../contracts/checkout.contract.js";
import { AppError } from "../errors/app-error.js";
import {
  calculateOrderTotals,
  centsToDollars,
} from "../policies/commerce.policy.js";
import { cartRepository } from "../repositories/cart.repository.js";
import { orderRepository } from "../repositories/order.repository.js";

export const orderService = {
  async create(userId: string, delivery: CheckoutInput) {
    return sequelize.transaction(async (transaction) => {
      const cart = await cartRepository.findForUser(userId, transaction);
      if (cart.length === 0) {
        throw new AppError("Your cart is empty.", {
          status: 409,
          code: "EMPTY_CART",
        });
      }

      const orderLines = cart.map((line) => {
        if (!line.product || !line.selectedVariant) {
          throw new Error("Order associations were not loaded.");
        }
        return {
          line,
          product: line.product,
          selectedVariant: line.selectedVariant,
        };
      });

      const totals = calculateOrderTotals(
        orderLines.map(
          ({ line, product }) => product.priceCents * line.quantity,
        ),
        delivery.deliveryMethod ?? "ship",
      );
      const orderId = randomUUID();
      const orderNumber = `FRM-${Date.now().toString(36).toUpperCase()}-${randomUUID()
        .slice(0, 4)
        .toUpperCase()}`;

      for (const { line, product } of orderLines) {
        const reserved = await orderRepository.reserveStock(
          line.productId,
          line.quantity,
          transaction,
        );
        if (!reserved) {
          throw new AppError(
            `${product.name} no longer has enough stock for this order.`,
            { status: 409, code: "INSUFFICIENT_STOCK" },
          );
        }
      }

      const order = await orderRepository.create(
        {
          id: orderId,
          orderNumber,
          userId,
          customerName: delivery.name,
          email: delivery.email,
          phone: delivery.phone ?? null,
          address: delivery.deliveryMethod === "pickup" ? "" : delivery.address,
          apartment:
            delivery.deliveryMethod === "pickup"
              ? null
              : (delivery.apartment ?? null),
          city: delivery.deliveryMethod === "pickup" ? "" : delivery.city,
          postalCode:
            delivery.deliveryMethod === "pickup"
              ? ""
              : (delivery.postalCode ?? ""),
          country: delivery.deliveryMethod === "pickup" ? "" : delivery.country,
          deliveryMethod: delivery.deliveryMethod ?? "ship",
          paymentMethod: "pay_on_delivery",
          ...totals,
        },
        transaction,
      );
      await orderRepository.createItems(
        orderLines.map(({ line, product, selectedVariant }) => ({
          id: randomUUID(),
          orderId,
          productId: line.productId,
          productName: product.name,
          variantName: selectedVariant.name,
          unitPriceCents: product.priceCents,
          quantity: line.quantity,
          lineTotalCents: product.priceCents * line.quantity,
        })),
        transaction,
      );
      await cartRepository.clear(userId, transaction);

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        email: order.email,
        status: order.status,
        deliveryMethod: order.deliveryMethod,
        subtotal: centsToDollars(order.subtotalCents),
        shipping: centsToDollars(order.shippingCents),
        total: centsToDollars(order.totalCents),
      };
    });
  },
};
