import { AppError } from "../errors/app-error.js";
import type { ProductListQuery } from "../contracts/product.contract.js";
import { productRepository } from "../repositories/product.repository.js";
import { serializeProduct } from "../serializers/product.serializer.js";

const categoryGroups: Record<string, ProductListQuery["category"]> = {
  completes: "boards",
  decks: "boards",
  hardware: "hardware",
  ramps: "ramps",
  protection: "wearables",
  footwear: "wearables",
  apparel: "wearables",
  accessories: "accessories",
};

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
        const category = categoryGroups[product.category.toLowerCase()];
        const matchesCategory =
          query.category === "all" || category === query.category;
        const searchText = [
          product.name,
          product.category,
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
          return first.name.localeCompare(second.name);
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
