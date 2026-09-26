const FREE_DELIVERY_THRESHOLD_CENTS = 5_000;
const STANDARD_DELIVERY_CENTS = 600;

export function calculateCartTotals(lines, deliveryMethod = "ship") {
  const subtotalCents = lines.reduce(
    (total, line) =>
      total + Math.round(line.product.price * 100) * line.quantity,
    0,
  );
  const shippingCents =
    deliveryMethod === "ship" &&
    subtotalCents > 0 &&
    subtotalCents <= FREE_DELIVERY_THRESHOLD_CENTS
      ? STANDARD_DELIVERY_CENTS
      : 0;

  return {
    subtotal: subtotalCents / 100,
    shipping: shippingCents / 100,
    total: (subtotalCents + shippingCents) / 100,
  };
}
