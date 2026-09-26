import { literal, Op, type Transaction } from "sequelize";
import { Order, OrderItem, Product } from "../database/models/index.js";

export interface OrderRecordInput {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  email: string;
  phone: string | null;
  address: string;
  apartment: string | null;
  city: string;
  postalCode: string;
  country: string;
  deliveryMethod: "ship" | "pickup";
  paymentMethod: string;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}

export interface OrderItemRecordInput {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  variantName: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
}

export const orderRepository = {
  create(values: OrderRecordInput, transaction: Transaction): Promise<Order> {
    return Order.create({ ...values, status: "confirmed" }, { transaction });
  },

  async createItems(
    values: OrderItemRecordInput[],
    transaction: Transaction,
  ): Promise<void> {
    await OrderItem.bulkCreate(values, { transaction });
  },

  async reserveStock(
    productId: string,
    quantity: number,
    transaction: Transaction,
  ): Promise<boolean> {
    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new TypeError("Stock quantity must be an integer from 1 to 99.");
    }
    const [affected] = await Product.update(
      { stockQuantity: literal(`stock_quantity - ${quantity}`) },
      {
        where: {
          id: productId,
          stockQuantity: { [Op.gte]: quantity },
        },
        transaction,
      },
    );
    return affected === 1;
  },
};
