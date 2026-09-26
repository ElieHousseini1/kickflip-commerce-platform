"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/providers/cart-provider";
import { useCurrency } from "@/components/providers/currency-provider";
import { ResilientImage } from "@/components/ui/resilient-image";
import { getErrorMessage } from "@/lib/error-message";
import styles from "./checkout-summary.module.css";

export function CheckoutSummary({
  items,
  subtotal,
  shipping,
  total,
  deliveryMethod,
  recommendations = [],
}) {
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const [addingId, setAddingId] = useState(null);
  const [addError, setAddError] = useState("");

  const handleQuickAdd = async (product) => {
    const variantId = product.variants?.[0]?.id;
    if (!variantId) return;
    setAddingId(product.id);
    setAddError("");
    try {
      await addItem(product.id, variantId);
    } catch (error) {
      setAddError(getErrorMessage(error, "Unable to add this item."));
    } finally {
      setAddingId(null);
    }
  };
  return (
    <aside className={styles.summary} aria-label="Checkout summary">
      <div className={styles.summaryInner}>
        <h2>Order summary</h2>
        <div className={styles.items}>
          {items.map(({ product, selectedVariant, variantId, quantity }) => (
            <div className={styles.item} key={`${product.id}-${variantId}`}>
              <div className={styles.image}>
                <ResilientImage
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="72px"
                />
                <span className={styles.quantity}>{quantity}</span>
              </div>
              <div className={styles.itemInfo}>
                <strong>{product.name}</strong>
                <small>{selectedVariant.name}</small>
              </div>
              <strong className={styles.itemPrice}>
                {formatPrice(product.price * quantity)}
              </strong>
            </div>
          ))}
        </div>
        <div className={styles.totals}>
          <div>
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div>
            <span>{deliveryMethod === "pickup" ? "Pickup" : "Delivery"}</span>
            <strong>{shipping ? formatPrice(shipping) : "Free"}</strong>
          </div>
          <div className={styles.total}>
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>
        </div>
        {recommendations.length > 0 && (
          <section
            className={styles.recommendations}
            aria-labelledby="recommendations-title"
          >
            <h3 id="recommendations-title">You might also like</h3>
            {addError && (
              <p className={styles.addError} role="alert">
                {addError}
              </p>
            )}
            <div className={styles.recommendationGrid}>
              {recommendations.map((product) => (
                <article className={styles.recommendation} key={product.id}>
                  <Link
                    href={`/products/${product.slug}`}
                    className={styles.recommendationImage}
                    aria-label={`View ${product.name}`}
                  >
                    <ResilientImage
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 620px) 30vw, 150px"
                    />
                  </Link>
                  <Link
                    href={`/products/${product.slug}`}
                    className={styles.recommendationName}
                  >
                    {product.name}
                  </Link>
                  <span className={styles.recommendationPrice}>
                    {formatPrice(product.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(product)}
                    disabled={addingId === product.id || !product.variants?.[0]}
                  >
                    {addingId === product.id ? "Adding…" : "Add"}
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </aside>
  );
}
