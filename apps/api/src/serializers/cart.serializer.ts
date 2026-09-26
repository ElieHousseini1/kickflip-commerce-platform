import type { CartItem } from "../database/models/index.js";
import type { CartLineDto } from "../types/domain.js";
import { serializeProduct, serializeVariant } from "./product.serializer.js";

export function serializeCartLine(line: CartItem): CartLineDto {
  if (!line.product || !line.selectedVariant) {
    throw new Error("Cart line associations were not loaded.");
  }
  return {
    productId: line.productId,
    variantId: line.variantId,
    quantity: line.quantity,
    selectedVariant: serializeVariant(line.selectedVariant),
    product: serializeProduct(line.product),
  };
}
