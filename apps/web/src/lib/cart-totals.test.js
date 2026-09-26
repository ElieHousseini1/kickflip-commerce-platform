import { describe, expect, it } from "vitest";
import { calculateCartTotals } from "@/lib/cart-totals";

describe("calculateCartTotals", () => {
  it("calculates line quantities and free delivery above $50", () => {
    const lines = [
      { product: { price: 40 }, quantity: 2 },
      { product: { price: 25 }, quantity: 1 },
    ];

    expect(calculateCartTotals(lines)).toEqual({
      subtotal: 105,
      shipping: 0,
      total: 105,
    });
  });

  it("charges delivery at $50", () => {
    expect(
      calculateCartTotals([{ product: { price: 50 }, quantity: 1 }]),
    ).toEqual({ subtotal: 50, shipping: 6, total: 56 });
  });

  it("charges $6 delivery for a $45 item", () => {
    expect(
      calculateCartTotals([{ product: { price: 45 }, quantity: 1 }]),
    ).toEqual({ subtotal: 45, shipping: 6, total: 51 });
  });

  it("does not charge delivery for pickup", () => {
    expect(
      calculateCartTotals([{ product: { price: 45 }, quantity: 1 }], "pickup"),
    ).toEqual({ subtotal: 45, shipping: 0, total: 45 });
  });

  it("provides complimentary delivery above $50", () => {
    expect(
      calculateCartTotals([{ product: { price: 50.01 }, quantity: 1 }]),
    ).toEqual({ subtotal: 50.01, shipping: 0, total: 50.01 });
  });

  it("does not charge delivery for an empty cart", () => {
    expect(calculateCartTotals([])).toEqual({
      subtotal: 0,
      shipping: 0,
      total: 0,
    });
  });

  it("rounds each unit price to integer cents", () => {
    expect(
      calculateCartTotals([{ product: { price: 19.99 }, quantity: 2 }]),
    ).toEqual({ subtotal: 39.98, shipping: 6, total: 45.98 });
  });
});
