import type { Product, ProductVariant } from "../database/models/index.js";
import type { ProductDto, ProductVariantDto } from "../types/domain.js";
import { centsToDollars } from "../policies/commerce.policy.js";

export function serializeVariant(variant: ProductVariant): ProductVariantDto {
  return { id: variant.id, name: variant.name, color: variant.color };
}

export function serializeProduct(product: Product): ProductDto {
  const variants = [...(product.variants ?? [])].sort(
    (first, second) => first.sortOrder - second.sortOrder,
  );
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: centsToDollars(product.priceCents),
    ...(product.compareAtPriceCents !== null
      ? { compareAtPrice: centsToDollars(product.compareAtPriceCents) }
      : {}),
    stockQuantity: product.stockQuantity,
    description: product.description,
    image: `/assets/${product.image.replace(/^\//, "")}`,
    variantName: product.variantName,
    variantOptions: variants.map(({ name }) => name),
    colors: variants.map(({ color }) => color),
    variants: variants.map(serializeVariant),
    ...(product.badge ? { badge: product.badge } : {}),
  };
}
