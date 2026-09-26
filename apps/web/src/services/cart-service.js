import { requestJson } from "@/services/api-client";
import { toSkateCartLines } from "@/lib/skate-catalog";

async function requestCart(method = "GET", body) {
  const result = await requestJson("/cart", {
    method,
    body: body ? JSON.stringify(body) : undefined,
  });
  return toSkateCartLines(result.lines);
}

export function getCart() {
  return requestCart();
}

export function addCartItem(productId, variantId) {
  return requestCart("POST", { productId, variantId, quantity: 1 });
}

export function updateCartItem(productId, variantId, changes) {
  return requestCart("PATCH", { productId, variantId, ...changes });
}

export function removeCartItem(productId, variantId) {
  return requestCart("DELETE", { productId, variantId });
}
