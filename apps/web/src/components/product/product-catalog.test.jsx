import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProductCatalog } from "@/components/product/product-catalog";
import { searchProducts } from "@/services/product-service";

vi.mock("@/components/product/product-card", () => ({
  ProductCard: ({ product }) => <article>{product.name}</article>,
}));

vi.mock("@/services/product-service", () => ({
  searchProducts: vi.fn(),
}));

const products = [
  {
    id: "deck-1",
    name: "Pool Shaped Deck",
    category: "Boards",
    description: "A wide pool deck.",
    image: "/images/pool-deck.jpg",
    price: 85,
  },
  {
    id: "wheel-1",
    name: "Formula Wheels 54mm",
    category: "Hardware",
    description: "Fast street wheels.",
    image: "/images/formula-wheels.jpg",
    price: 95,
  },
];

describe("ProductCatalog filters", () => {
  afterEach(cleanup);

  beforeEach(() => {
    window.history.replaceState(null, "", "/products");
    searchProducts.mockReset();
    searchProducts.mockResolvedValue({ products: [], total: 0 });
  });

  it("applies a search received from the header", async () => {
    render(<ProductCatalog products={products} initialQuery="pool" />);

    await waitFor(() =>
      expect(searchProducts).toHaveBeenCalledWith(
        expect.objectContaining({ query: "pool" }),
      ),
    );
    expect(screen.getByText(/Search:/)).toBeVisible();
  });

  it("stores categories in the URL and preserves the current search", async () => {
    render(<ProductCatalog products={products} initialQuery="pool" />);

    fireEvent.click(screen.getAllByRole("button", { name: "Boards" })[0]);

    await waitFor(() =>
      expect(searchProducts).toHaveBeenCalledWith(
        expect.objectContaining({ category: "boards", query: "pool" }),
      ),
    );
    expect(window.location.search).toBe("?category=boards&q=pool");
    expect(
      screen.getAllByRole("button", { name: "Boards" })[0],
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("stores non-default sorting in the URL", async () => {
    render(<ProductCatalog products={products} />);

    fireEvent.click(screen.getByRole("combobox", { name: "Sort products" }));
    fireEvent.click(screen.getByRole("option", { name: "Price: low to high" }));

    await waitFor(() =>
      expect(searchProducts).toHaveBeenCalledWith(
        expect.objectContaining({ sort: "price-low" }),
      ),
    );
    expect(window.location.search).toBe("?sort=price-low");
  });

  it("paginates the filtered catalog and updates the URL", () => {
    const manyProducts = Array.from({ length: 15 }, (_, index) => ({
      ...products[0],
      id: `deck-${index}`,
      name: `Deck ${index + 1}`,
    }));
    render(<ProductCatalog products={manyProducts} />);

    expect(screen.getAllByRole("article")).toHaveLength(12);
    fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(window.location.search).toBe("?page=2");
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
    expect(screen.getAllByRole("article")).toHaveLength(12);
    expect(window.location.search).toBe("");
  });

  it("opens a valid page number from the URL", () => {
    const manyProducts = Array.from({ length: 15 }, (_, index) => ({
      ...products[0],
      id: `deck-${index}`,
      name: `Deck ${index + 1}`,
    }));
    render(<ProductCatalog products={manyProducts} initialPage={2} />);

    expect(screen.getAllByRole("article")).toHaveLength(3);
  });
});
