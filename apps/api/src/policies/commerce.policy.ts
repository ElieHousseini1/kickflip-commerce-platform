export const FREE_DELIVERY_THRESHOLD_CENTS = 5_000;
export const STANDARD_DELIVERY_CENTS = 600;

export interface OrderTotals {
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}

export function calculateOrderTotals(
  lineTotalsCents: number[],
  deliveryMethod: "ship" | "pickup" = "ship",
): OrderTotals {
  const subtotalCents = lineTotalsCents.reduce(
    (sum, lineTotal) => sum + lineTotal,
    0,
  );
  const shippingCents =
    deliveryMethod === "ship" &&
    subtotalCents > 0 &&
    subtotalCents <= FREE_DELIVERY_THRESHOLD_CENTS
      ? STANDARD_DELIVERY_CENTS
      : 0;

  return {
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
  };
}

export function centsToDollars(cents: number): number {
  return cents / 100;
}
