const fallback = "/products";
const allowedPaths = /^\/(?:products(?:\/.*)?|cart|wishlist|checkout)$/;

export function getSafeReturnPath(value) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return fallback;
  }

  const pathname = value.split(/[?#]/, 1)[0];
  if (pathname.includes("\\") || /%(?:2f|5c)/i.test(pathname)) return fallback;

  try {
    const base = "https://shop.invalid";
    const url = new URL(value, base);
    if (url.origin !== base || !allowedPaths.test(url.pathname))
      return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
