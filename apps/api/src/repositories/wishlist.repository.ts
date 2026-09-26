import type { Transaction } from "sequelize";
import {
  Product,
  ProductVariant,
  WishlistItem,
} from "../database/models/index.js";

const productInclude = {
  model: Product,
  as: "product",
  required: true,
  include: [{ model: ProductVariant, as: "variants", required: true }],
};

export const wishlistRepository = {
  findForUser(userId: string): Promise<WishlistItem[]> {
    return WishlistItem.findAll({
      where: { userId },
      include: [productInclude],
      order: [["createdAt", "DESC"]],
    });
  },

  find(userId: string, productId: string): Promise<WishlistItem | null> {
    return WishlistItem.findOne({ where: { userId, productId } });
  },

  async add(
    userId: string,
    productId: string,
    transaction?: Transaction,
  ): Promise<void> {
    await WishlistItem.findOrCreate({
      where: { userId, productId },
      defaults: { userId, productId },
      ...(transaction ? { transaction } : {}),
    });
  },

  async remove(userId: string, productId: string): Promise<void> {
    await WishlistItem.destroy({ where: { userId, productId } });
  },
};
