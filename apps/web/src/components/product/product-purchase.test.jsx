import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AddToCart } from "@/components/product/add-to-cart";
import { ProductPurchase } from "@/components/product/product-purchase";
import { useCart } from "@/components/providers/cart-provider";
import { useWishlist } from "@/components/providers/wishlist-provider";

vi.mock("@/components/providers/cart-provider", () => ({
  useCart: vi.fn(),
}));

vi.mock("@/components/providers/wishlist-provider", () => ({
  useWishlist: vi.fn(),
}));

describe("product purchase controls", () => {
  beforeEach(() => {
    useCart.mockReturnValue({
      addItem: vi.fn(),
      removeItem: vi.fn(),
      lines: [],
    });
    useWishlist.mockReturnValue({ hasItem: () => false, toggleItem: vi.fn() });
  });

  it("shows readable variant values instead of color-only swatches", () => {
    render(
      <ProductPurchase
        product={{
          id: "board-1",
          variantName: "Size",
          stockQuantity: 10,
          variants: [
            { id: "size-8", name: '8.0"' },
            { id: "size-825", name: '8.25"' },
          ],
        }}
      />,
    );

    expect(screen.getByRole("button", { name: '8.0"' })).toBeVisible();
    expect(screen.getByRole("button", { name: '8.25"' })).toBeVisible();
  });

  it("removes the selected item when it is already in the bag", async () => {
    const removeItem = vi.fn().mockResolvedValue(undefined);
    useCart.mockReturnValue({
      addItem: vi.fn(),
      removeItem,
      lines: [
        {
          product: { id: "board-1" },
          variantId: "size-8",
          quantity: 1,
        },
      ],
    });

    render(
      <AddToCart productId="board-1" variantId="size-8" stockQuantity={10} />,
    );

    const toggle = screen.getByRole("button", { name: "Remove from cart" });
    expect(toggle).toBeEnabled();
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(toggle);

    await waitFor(() =>
      expect(removeItem).toHaveBeenCalledWith("board-1", "size-8"),
    );
  });
});
