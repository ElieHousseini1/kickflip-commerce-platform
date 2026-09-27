import { describe, expect, it } from "vitest";
import { getSafeReturnPath } from "./safe-return-path";

describe("post-authentication return paths", () => {
  it("keeps local shop destinations and their query strings", () => {
    expect(getSafeReturnPath("/products?page=2")).toBe("/products?page=2");
    expect(getSafeReturnPath("/products/deck-one#details")).toBe(
      "/products/deck-one#details",
    );
    expect(getSafeReturnPath("/cart")).toBe("/cart");
  });

  it.each([
    "//evil.example",
    "/\\evil.example",
    "/%5cevil.example",
    "/%2F%2Fevil.example",
    "https://evil.example",
    "javascript:alert(1)",
    "/admin",
    null,
  ])("rejects unsafe destination %s", (input) => {
    expect(getSafeReturnPath(input)).toBe("/products");
  });
});
