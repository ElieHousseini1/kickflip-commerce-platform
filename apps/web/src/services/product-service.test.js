import { beforeEach, describe, expect, it, vi } from "vitest";
import { searchProducts } from "@/services/product-service";
import { requestJson } from "@/services/api-client";

vi.mock("@/services/api-client", () => ({
  requestJson: vi.fn(),
}));

describe("searchProducts", () => {
  beforeEach(() => {
    requestJson.mockReset();
    requestJson.mockResolvedValue({ products: [], total: 0 });
  });

  it("forwards search, category, and custom sorting to the backend", async () => {
    const controller = new AbortController();

    await searchProducts({
      query: "  deck  ",
      category: "boards",
      sort: "price-low",
      signal: controller.signal,
    });

    expect(requestJson).toHaveBeenCalledWith(
      "/products?q=deck&category=boards&sort=price-low",
      { signal: controller.signal },
    );
  });

  it("requests the backend catalog for default controls", async () => {
    await searchProducts({
      query: "",
      category: "all",
      sort: "featured",
    });

    expect(requestJson).toHaveBeenCalledWith("/products", {
      signal: undefined,
    });
  });
});
