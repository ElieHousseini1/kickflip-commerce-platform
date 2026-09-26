import { Product, ProductVariant } from "../database/models/index.js";

const variantsInclude = {
  model: ProductVariant,
  as: "variants",
  required: true,
} as const;

export const productRepository = {
  findAll(): Promise<Product[]> {
    return Product.findAll({
      include: [variantsInclude],
      order: [
        ["createdAt", "ASC"],
        [{ model: ProductVariant, as: "variants" }, "sortOrder", "ASC"],
      ],
    });
  },

  findById(id: string): Promise<Product | null> {
    return Product.findByPk(id, { include: [variantsInclude] });
  },

  findBySlug(slug: string): Promise<Product | null> {
    return Product.findOne({
      where: { slug },
      include: [variantsInclude],
      order: [[{ model: ProductVariant, as: "variants" }, "sortOrder", "ASC"]],
    });
  },
};
