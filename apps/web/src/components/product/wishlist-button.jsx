"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { useWishlist } from "@/components/providers/wishlist-provider";
import { getErrorMessage } from "@/lib/error-message";
import shared from "@/styles/shared.module.css";
import styles from "./product-detail.module.css";

export function WishlistButton({ productId }) {
  const { hasItem, toggleItem } = useWishlist();
  const active = hasItem(productId);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleToggle = async () => {
    setPending(true);
    setError("");
    try {
      await toggleItem(productId);
    } catch (requestError) {
      setError(
        getErrorMessage(requestError, "Unable to update your wishlist."),
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div className={styles.wishlistControl}>
      <button
        className={`${shared.button} ${styles.wishlistButton} ${active ? styles.isActive : ""}`}
        type="button"
        onClick={handleToggle}
        disabled={pending}
        aria-pressed={active}
      >
        <Heart size={18} fill={active ? "currentColor" : "none"} />
        {pending
          ? "Updating…"
          : active
            ? "Saved to wishlist"
            : "Add to wishlist"}
      </button>
      {error && (
        <p className={styles.actionError} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
