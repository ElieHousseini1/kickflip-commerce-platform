import type { Transaction } from "sequelize";
import { CartItem, Product, ProductVariant } from "../database/models/index.js";

const cartIncludes = [
  {
    model: Product,
    as: "product",
    required: true,
    include: [{ model: ProductVariant, as: "variants", required: true }],
  },
  { model: ProductVariant, as: "selectedVariant", required: true },
];

export const cartRepository = {
  findForUser(userId: string, transaction?: Transaction): Promise<CartItem[]> {
    return CartItem.findAll({
      where: { userId },
      include: cartIncludes,
      order: [["updatedAt", "DESC"]],
      ...(transaction ? { transaction } : {}),
    });
  },

  findLine(
    userId: string,
    productId: string,
    variantId: string,
    transaction?: Transaction,
  ): Promise<CartItem | null> {
    return CartItem.findOne({
      where: { userId, productId, variantId },
      ...(transaction ? { transaction } : {}),
    });
  },

  async addQuantity(
    userId: string,
    productId: string,
    variantId: string,
    quantity: number,
    transaction: Transaction,
  ): Promise<void> {
    const existing = await this.findLine(
      userId,
      productId,
      variantId,
      transaction,
    );
    if (existing) {
      await existing.increment("quantity", { by: quantity, transaction });
      return;
    }
    await CartItem.create(
      { userId, productId, variantId, quantity },
      { transaction },
    );
  },

  async setQuantity(
    userId: string,
    productId: string,
    variantId: string,
    quantity: number,
    transaction: Transaction,
  ): Promise<void> {
    if (quantity === 0) {
      await this.remove(userId, productId, variantId, transaction);
      return;
    }
    await CartItem.update(
      { quantity },
      { where: { userId, productId, variantId }, transaction },
    );
  },

  async remove(
    userId: string,
    productId: string,
    variantId: string,
    transaction?: Transaction,
  ): Promise<void> {
    await CartItem.destroy({
      where: { userId, productId, variantId },
      ...(transaction ? { transaction } : {}),
    });
  },

  async clear(userId: string, transaction: Transaction): Promise<void> {
    await CartItem.destroy({ where: { userId }, transaction });
  },
};
