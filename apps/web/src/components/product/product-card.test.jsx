import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProductCard } from "@/components/product/product-card";
import { useCart } from "@/components/providers/cart-provider";
import { useWishlist } from "@/components/providers/wishlist-provider";

vi.mock("@/components/providers/cart-provider", () => ({
  useCart: vi.fn(),
}));

vi.mock("@/components/providers/wishlist-provider", () => ({
  useWishlist: vi.fn(),
}));

vi.mock("@/components/ui/resilient-image", () => ({
  ResilientImage: ({ alt }) => <span role="img" aria-label={alt} />,
}));

const product = {
  id: "deck-1",
  slug: "pool-deck",
  name: "Pool Deck",
  category: "Boards",
  image: "/pool-deck.jpg",
  price: 85,
  stockQuantity: 4,
  variantName: "Size",
  variantOptions: ['8.5"'],
  variants: [{ id: "deck-1-size-1", name: '8.5"' }],
};

describe("ProductCard quick cart control", () => {
  afterEach(cleanup);

  beforeEach(() => {
    useWishlist.mockReturnValue({
      hasItem: () => false,
      toggleItem: vi.fn(),
    });
  });

  it("adds the first available variant from the catalog", async () => {
    const addItem = vi.fn().mockResolvedValue(undefined);
    useCart.mockReturnValue({ addItem, removeItem: vi.fn(), lines: [] });

    render(<ProductCard product={product} />);
    fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));

    await waitFor(() =>
      expect(addItem).toHaveBeenCalledWith("deck-1", "deck-1-size-1"),
    );
  });

  it("removes an added product instead of locking the button", async () => {
    const removeItem = vi.fn().mockResolvedValue(undefined);
    useCart.mockReturnValue({
      addItem: vi.fn(),
      removeItem,
      lines: [
        {
          product: { id: "deck-1" },
          variantId: "deck-1-size-1",
          quantity: 1,
        },
      ],
    });

    render(<ProductCard product={product} />);

    const toggle = screen.getByRole("button", { name: "Remove from bag" });
    expect(toggle).toBeEnabled();
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(toggle);

    await waitFor(() =>
      expect(removeItem).toHaveBeenCalledWith("deck-1", "deck-1-size-1"),
    );
  });

  it("locks page scrolling while quick view is open", () => {
    useCart.mockReturnValue({
      addItem: vi.fn(),
      removeItem: vi.fn(),
      lines: [],
    });

    render(<ProductCard product={product} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Quick view Pool Deck" }),
    );
    expect(document.documentElement.style.overflow).toBe("hidden");
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.position).toBe("fixed");

    fireEvent.click(
      screen.getAllByRole("button", { name: "Close quick view" })[1],
    );
    expect(document.documentElement.style.overflow).toBe("");
    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.position).toBe("");
  });
});
