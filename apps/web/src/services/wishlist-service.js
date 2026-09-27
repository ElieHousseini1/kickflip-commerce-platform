import { requestJson } from "@/services/api-client";

async function requestWishlist(method = "GET", productId) {
  const result = await requestJson("/wishlist", {
    method,
    body: productId ? JSON.stringify({ productId }) : undefined,
  });
  return result.products;
}

export function getWishlist() {
  return requestWishlist();
}

export function addWishlistItem(productId) {
  return requestWishlist("POST", productId);
}

export function removeWishlistItem(productId) {
  return requestWishlist("DELETE", productId);
}
