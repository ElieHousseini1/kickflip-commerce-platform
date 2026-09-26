import { describe, expect, it } from "vitest";
import { calculateOrderTotals } from "./commerce.policy.js";

describe("calculateOrderTotals", () => {
  it("charges delivery below the threshold", () => {
    expect(calculateOrderTotals([4_000])).toEqual({
      subtotalCents: 4_000,
      shippingCents: 600,
      totalCents: 4_600,
    });
  });

  it("charges delivery at $50", () => {
    expect(calculateOrderTotals([5_000])).toEqual({
      subtotalCents: 5_000,
      shippingCents: 600,
      totalCents: 5_600,
    });
  });

  it("charges $6 delivery for a $45 item", () => {
    expect(calculateOrderTotals([4_500])).toEqual({
      subtotalCents: 4_500,
      shippingCents: 600,
      totalCents: 5_100,
    });
  });

  it("does not charge delivery for pickup", () => {
    expect(calculateOrderTotals([4_500], "pickup")).toEqual({
      subtotalCents: 4_500,
      shippingCents: 0,
      totalCents: 4_500,
    });
  });

  it("provides complimentary delivery above $50", () => {
    expect(calculateOrderTotals([5_001])).toEqual({
      subtotalCents: 5_001,
      shippingCents: 0,
      totalCents: 5_001,
    });
  });

  it("does not charge delivery for an empty cart", () => {
    expect(calculateOrderTotals([]).totalCents).toBe(0);
  });
});
