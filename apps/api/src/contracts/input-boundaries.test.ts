import { describe, expect, it } from "vitest";
import { registerSchema } from "./auth.contract.js";
import { addCartItemSchema } from "./cart.contract.js";
import { checkoutSchema } from "./checkout.contract.js";
import { productListQuerySchema } from "./product.contract.js";

describe("public input boundaries", () => {
  it("rejects whitespace-only and oversized account names", () => {
    const registration = {
      name: "Valid Name",
      email: "valid@example.com",
      password: "correct-horse-battery-staple",
    };
    expect(
      registerSchema.safeParse({ ...registration, name: "   " }).success,
    ).toBe(false);
    expect(
      registerSchema.safeParse({ ...registration, name: "a".repeat(101) })
        .success,
    ).toBe(false);
    expect(
      registerSchema.safeParse({ ...registration, email: "a".repeat(255) })
        .success,
    ).toBe(false);
    expect(
      registerSchema.safeParse({ ...registration, password: "a".repeat(201) })
        .success,
    ).toBe(false);
  });

  it("rejects invalid checkout field types and lengths", () => {
    const checkout = {
      name: "Valid Customer",
      email: "customer@example.com",
      deliveryMethod: "ship",
      address: "1 Main Street",
      city: "Beirut",
      country: "Lebanon",
    };
    expect(checkoutSchema.safeParse({ ...checkout, name: "  " }).success).toBe(
      false,
    );
    expect(
      checkoutSchema.safeParse({ ...checkout, address: "x".repeat(201) })
        .success,
    ).toBe(false);
    expect(
      checkoutSchema.safeParse({ ...checkout, city: ["Beirut"] }).success,
    ).toBe(false);
    expect(
      checkoutSchema.safeParse({ ...checkout, country: "Other" }).success,
    ).toBe(false);
    expect(
      checkoutSchema.safeParse({ ...checkout, phone: "+961abc" }).success,
    ).toBe(false);
    expect(
      checkoutSchema.safeParse({ ...checkout, isAdmin: true }).success,
    ).toBe(false);
  });

  it("rejects query and quantity injection before database operations", () => {
    expect(
      addCartItemSchema.safeParse({
        productId: "product",
        quantity: "1; DROP TABLE orders",
      }).success,
    ).toBe(false);
    expect(
      addCartItemSchema.safeParse({ productId: "product", quantity: 100 })
        .success,
    ).toBe(false);
    expect(
      productListQuerySchema.safeParse({ q: "x".repeat(101) }).success,
    ).toBe(false);
  });
});
