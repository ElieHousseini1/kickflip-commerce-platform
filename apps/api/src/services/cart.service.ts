import { sequelize } from "../config/database.js";
import type {
  AddCartItemInput,
  RemoveCartItemInput,
  UpdateCartItemInput,
} from "../contracts/cart.contract.js";
import { AppError } from "../errors/app-error.js";
import { cartRepository } from "../repositories/cart.repository.js";
import { productRepository } from "../repositories/product.repository.js";
import { serializeCartLine } from "../serializers/cart.serializer.js";

function stockError(name: string, stockQuantity: number): AppError {
  const noun = stockQuantity === 1 ? "item is" : "items are";
  return new AppError(`Only ${stockQuantity} ${noun} remaining for ${name}.`, {
    status: 409,
    code: "INSUFFICIENT_STOCK",
  });
}

async function linesForUser(userId: string) {
  return (await cartRepository.findForUser(userId)).map(serializeCartLine);
}

export const cartService = {
  list: linesForUser,

  async add(userId: string, input: AddCartItemInput) {
    const product = await productRepository.findById(input.productId);
    const variantId = input.variantId ?? product?.variants?.[0]?.id;
    if (
      !product ||
      !variantId ||
      !product.variants?.some(({ id }) => id === variantId)
    ) {
      throw new AppError("Invalid product or variant.", {
        code: "INVALID_PRODUCT",
      });
    }

    await sequelize.transaction(async (transaction) => {
      const cart = await cartRepository.findForUser(userId, transaction);
      const quantityInCart = cart
        .filter(({ productId }) => productId === product.id)
        .reduce((total, line) => total + line.quantity, 0);
      if (quantityInCart + input.quantity > product.stockQuantity) {
        throw stockError(product.name, product.stockQuantity);
      }
      await cartRepository.addQuantity(
        userId,
        product.id,
        variantId,
        input.quantity,
        transaction,
      );
    });
    return linesForUser(userId);
  },

  async update(userId: string, input: UpdateCartItemInput) {
    const product = await productRepository.findById(input.productId);
    if (!product?.variants?.some(({ id }) => id === input.variantId)) {
      throw new AppError("Invalid product or variant.", {
        code: "INVALID_PRODUCT",
      });
    }

    await sequelize.transaction(async (transaction) => {
      const source = await cartRepository.findLine(
        userId,
        input.productId,
        input.variantId,
        transaction,
      );
      if (!source) {
        throw new AppError("Cart item not found.", {
          status: 404,
          code: "CART_ITEM_NOT_FOUND",
        });
      }

      if (input.nextVariantId) {
        if (input.nextVariantId === input.variantId) return;
        if (!product.variants?.some(({ id }) => id === input.nextVariantId)) {
          throw new AppError("Invalid replacement variant.", {
            code: "INVALID_VARIANT",
          });
        }
        await cartRepository.addQuantity(
          userId,
          input.productId,
          input.nextVariantId,
          source.quantity,
          transaction,
        );
        await cartRepository.remove(
          userId,
          input.productId,
          input.variantId,
          transaction,
        );
        return;
      }

      const cart = await cartRepository.findForUser(userId, transaction);
      const otherQuantity = cart
        .filter(
          ({ productId, variantId }) =>
            productId === input.productId && variantId !== input.variantId,
        )
        .reduce((total, line) => total + line.quantity, 0);
      const quantity = input.quantity ?? source.quantity;
      if (quantity > 0 && otherQuantity + quantity > product.stockQuantity) {
        throw stockError(product.name, product.stockQuantity);
      }
      await cartRepository.setQuantity(
        userId,
        input.productId,
        input.variantId,
        quantity,
        transaction,
      );
    });
    return linesForUser(userId);
  },

  async remove(userId: string, input: RemoveCartItemInput) {
    await cartRepository.remove(userId, input.productId, input.variantId);
    return linesForUser(userId);
  },
};
