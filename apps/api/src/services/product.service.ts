import { AppError } from "../errors/app-error.js";
import type { ProductListQuery } from "../contracts/product.contract.js";
import { productRepository } from "../repositories/product.repository.js";
import { serializeProduct } from "../serializers/product.serializer.js";

const presentation = {
  "chair-001": { name: "DIY Quarter Pipe", category: "ramps" },
  "lamp-001": { name: "Street Complete", category: "boards" },
  "speaker-001": { name: "Hollow Trucks Set", category: "hardware" },
  "vase-001": { name: "Formula Wheels 54mm", category: "hardware" },
  "table-001": { name: "Curb Crusher Complete", category: "boards" },
  "headphones-001": { name: "Impact Skate Helmet", category: "wearables" },
  "lamp-002": { name: "Flat Bar Grind Rail", category: "ramps" },
  "clock-001": { name: "Ceramic Speed Bearings", category: "hardware" },
  "sofa-001": { name: "Backyard Mini Ramp", category: "ramps" },
  "chair-002": { name: "Pool Shaped Deck", category: "boards" },
  "lamp-003": { name: "Session Skate Backpack", category: "accessories" },
  "keyboard-001": { name: "Pro Knee Pad Set", category: "wearables" },
  "camera-001": { name: "Break-In Hi-Tops", category: "wearables" },
  "vase-002": { name: "Pocket Skate Tool", category: "accessories" },
  "tray-001": { name: "After-School Logo Tee", category: "wearables" },
} as const;

const getPresentation = (id: string) =>
  presentation[id as keyof typeof presentation];

export const productService = {
  async list(
    query: ProductListQuery = { q: "", category: "all", sort: "featured" },
  ) {
    const allProducts = (await productRepository.findAll()).map(
      serializeProduct,
    );
    const normalizedQuery = query.q.toLowerCase();
    const products = allProducts
      .filter((product) => {
        const display = getPresentation(product.id);
        const matchesCategory =
          query.category === "all" || display.category === query.category;
        const searchText = [
          display.name,
          display.category,
          product.description,
          ...product.variantOptions,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return (
          matchesCategory &&
          (!normalizedQuery || searchText.includes(normalizedQuery))
        );
      })
      .sort((first, second) => {
        if (query.sort === "price-low") return first.price - second.price;
        if (query.sort === "price-high") return second.price - first.price;
        if (query.sort === "name") {
          const firstName = getPresentation(first.id).name;
          const secondName = getPresentation(second.id).name;
          return firstName.localeCompare(secondName);
        }
        return 0;
      });

    return { products, total: allProducts.length };
  },

  async findBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw new AppError("Product not found.", {
        status: 404,
        code: "PRODUCT_NOT_FOUND",
      });
    }
    return serializeProduct(product);
  },
};
