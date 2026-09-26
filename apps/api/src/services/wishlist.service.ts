import type { WishlistItemInput } from "../contracts/wishlist.contract.js";
import { AppError } from "../errors/app-error.js";
import { productRepository } from "../repositories/product.repository.js";
import { wishlistRepository } from "../repositories/wishlist.repository.js";
import { serializeProduct } from "../serializers/product.serializer.js";

async function productsForUser(userId: string) {
  const items = await wishlistRepository.findForUser(userId);
  return items.map((item) => {
    if (!item.product) throw new Error("Wishlist product was not loaded.");
    return serializeProduct(item.product);
  });
}

export const wishlistService = {
  list: productsForUser,

  async add(userId: string, input: WishlistItemInput) {
    if (!(await productRepository.findById(input.productId))) {
      throw new AppError("Product not found.", {
        status: 404,
        code: "PRODUCT_NOT_FOUND",
      });
    }
    await wishlistRepository.add(userId, input.productId);
    return productsForUser(userId);
  },

  async remove(userId: string, input: WishlistItemInput) {
    await wishlistRepository.remove(userId, input.productId);
    return productsForUser(userId);
  },
};
