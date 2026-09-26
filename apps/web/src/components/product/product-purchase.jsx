"use client";

import { useState } from "react";
import { AddToCart } from "@/components/product/add-to-cart";
import { WishlistButton } from "@/components/product/wishlist-button";
import styles from "./product-detail.module.css";

export function ProductPurchase({ product }) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0].id,
  );

  return (
    <>
      <div className={styles.colorPicker}>
        <span>{product.variantName}</span>
        <div>
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              className={
                variant.id === selectedVariantId ? styles.isSelected : ""
              }
              aria-label={variant.name}
              aria-pressed={variant.id === selectedVariantId}
              onClick={() => setSelectedVariantId(variant.id)}
            >
              {variant.name}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.detailActions}>
        <AddToCart
          productId={product.id}
          variantId={selectedVariantId}
          stockQuantity={product.stockQuantity}
        />
        <WishlistButton productId={product.id} />
      </div>
    </>
  );
}
