"use client";

import { Minus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/providers/cart-provider";
import { getErrorMessage } from "@/lib/error-message";
import shared from "@/styles/shared.module.css";
import styles from "./product-detail.module.css";

export function AddToCart({ productId, variantId, stockQuantity }) {
  const { addItem, lines, removeItem } = useCart();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const quantityInCart = lines.reduce(
    (total, line) =>
      (line.product?.id ?? line.productId) === productId
        ? total + line.quantity
        : total,
    0,
  );
  const matchingLines = lines.filter(
    (line) =>
      (line.product?.id ?? line.productId) === productId &&
      line.variantId === variantId,
  );
  const added = matchingLines.length > 0;
  const unavailable = stockQuantity === 0 || quantityInCart >= stockQuantity;

  const handleToggle = async () => {
    setError("");
    setPending(true);
    try {
      if (added) {
        for (const line of matchingLines) {
          await removeItem(productId, line.variantId);
        }
      } else {
        await addItem(productId, variantId);
      }
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          added
            ? "Unable to remove this item from your cart."
            : "Unable to add this item to your cart.",
        ),
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div className={styles.addControl}>
      <button
        className={`${shared.button} ${shared.buttonBlue} ${styles.addButton} ${added ? styles.isAdded : ""}`}
        type="button"
        onClick={handleToggle}
        disabled={pending || (!added && unavailable)}
        aria-pressed={added}
        aria-live="polite"
      >
        {added ? <Minus size={18} /> : <ShoppingBag size={18} />}
        {added
          ? pending
            ? "Removing…"
            : "Remove from cart"
          : stockQuantity === 0
            ? "Out of stock"
            : unavailable
              ? "Stock limit reached"
              : pending
                ? "Adding…"
                : "Add to cart"}
      </button>
      {error && (
        <p className={styles.actionError} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
