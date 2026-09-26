"use client";

import Link from "next/link";
import { Eye, Heart, Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/components/providers/cart-provider";
import { getErrorMessage } from "@/lib/error-message";
import { useCurrency } from "@/components/providers/currency-provider";
import { ResilientImage } from "@/components/ui/resilient-image";
import { useWishlist } from "@/components/providers/wishlist-provider";
import styles from "./product-card.module.css";
export function ProductCard({
  product,
  priority = false,
  mobileCompact = false,
}) {
  const [cartPending, setCartPending] = useState(false);
  const [wishlistPending, setWishlistPending] = useState(false);
  const [error, setError] = useState("");
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { addItem, lines, removeItem } = useCart();
  const { hasItem, toggleItem } = useWishlist();
  const { formatPrice } = useCurrency();
  const favorite = hasItem(product.id);
  const productLines = lines.filter((line) => line.product.id === product.id);
  const added = productLines.length > 0;

  useEffect(() => {
    if (!quickViewOpen) return undefined;

    const scrollPosition = window.scrollY;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousHtmlOverscroll =
      document.documentElement.style.overscrollBehavior;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = "100%";

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setQuickViewOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.documentElement.style.overscrollBehavior =
        previousHtmlOverscroll;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      if (scrollPosition > 0) window.scrollTo(0, scrollPosition);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [quickViewOpen]);

  const handlePointerMove = (event) => {
    if (event.pointerType !== "mouse") return;
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.style.setProperty("--tilt-x", `${y * -7}deg`);
    card.style.setProperty("--tilt-y", `${x * 7}deg`);
    card.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`);
    card.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`);
  };

  const handlePointerLeave = (event) => {
    event.currentTarget.style.removeProperty("--tilt-x");
    event.currentTarget.style.removeProperty("--tilt-y");
    event.currentTarget.style.removeProperty("--glow-x");
    event.currentTarget.style.removeProperty("--glow-y");
  };

  const handleCartToggle = async () => {
    setCartPending(true);
    setError("");
    try {
      if (added) {
        for (const line of productLines) {
          await removeItem(product.id, line.variantId);
        }
      } else {
        await addItem(product.id, product.variants[0].id);
      }
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          added
            ? "Unable to remove this product."
            : "Unable to add this product.",
        ),
      );
    } finally {
      setCartPending(false);
    }
  };

  const toggleWishlist = async () => {
    setWishlistPending(true);
    setError("");
    try {
      await toggleItem(product.id);
    } catch (requestError) {
      setError(
        getErrorMessage(requestError, "Unable to update your wishlist."),
      );
    } finally {
      setWishlistPending(false);
    }
  };
  return (
    <>
      <article
        className={`${styles.card} ${mobileCompact ? styles.compactMobile : ""}`}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className={styles.media}>
          <Link
            href={`/products/${product.slug}`}
            aria-label={`View ${product.name}`}
          >
            <ResilientImage
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 720px) 85vw, (max-width: 1100px) 45vw, 25vw"
              priority={priority}
            />
          </Link>
          {product.badge && (
            <span className={styles.badge}>{product.badge}</span>
          )}
          <button
            className={`${styles.favoriteButton} ${favorite ? styles.isActive : ""}`}
            type="button"
            onClick={toggleWishlist}
            disabled={wishlistPending}
            aria-label={favorite ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={favorite}
          >
            <Heart size={19} fill={favorite ? "currentColor" : "none"} />
          </button>
          <button
            className={styles.quickViewTrigger}
            type="button"
            onClick={() => setQuickViewOpen(true)}
            aria-label={`Quick view ${product.name}`}
          >
            <Eye size={17} /> <span>Quick view</span>
          </button>
        </div>
        <div className={styles.info}>
          <div>
            <p>{product.category}</p>
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </div>
          <span className={styles.price}>
            {product.compareAtPrice && (
              <del>{formatPrice(product.compareAtPrice)}</del>
            )}
            <strong>{formatPrice(product.price)}</strong>
          </span>
        </div>
        <div className={styles.cardActions}>
          <button
            className={`${styles.quickAdd} ${added ? styles.isAdded : ""}`}
            type="button"
            onClick={handleCartToggle}
            disabled={
              cartPending ||
              (!added &&
                (product.stockQuantity === 0 || !product.variants?.[0]))
            }
            aria-pressed={added}
            aria-label={added ? "Remove from bag" : "Add to cart"}
          >
            {added ? <Minus size={16} /> : <Plus size={16} />}
            {!added && product.stockQuantity === 0
              ? "Out of stock"
              : cartPending
                ? added
                  ? "Removing…"
                  : "Adding…"
                : added
                  ? "Remove"
                  : "Add to cart"}
          </button>
        </div>
        <div className={styles.variantSummary}>
          <div
            className={styles.optionValues}
            role="list"
            aria-label={`${product.variantName} options`}
          >
            {product.variantOptions.map((option) => (
              <span key={option} role="listitem">
                {option}
              </span>
            ))}
          </div>
        </div>
        {error && (
          <p className={styles.cardError} role="alert">
            {error}
          </p>
        )}
      </article>
      {quickViewOpen && (
        <>
          <button
            type="button"
            className={styles.quickViewBackdrop}
            onClick={() => setQuickViewOpen(false)}
            aria-label="Close quick view"
          />
          <aside
            className={styles.quickViewDrawer}
            aria-label={`Quick view ${product.name}`}
          >
            <button
              type="button"
              className={styles.drawerClose}
              onClick={() => setQuickViewOpen(false)}
              aria-label="Close quick view"
            >
              <X size={22} />
            </button>
            <div className={styles.drawerImage}>
              <ResilientImage
                src={product.image}
                alt={product.name}
                fill
                sizes="min(90vw, 460px)"
              />
            </div>
            <p>{product.category}</p>
            <h2>{product.name}</h2>
            <div className={styles.drawerPrice}>
              {product.compareAtPrice && (
                <del>{formatPrice(product.compareAtPrice)}</del>
              )}
              <strong>{formatPrice(product.price)}</strong>
            </div>
            <p className={styles.drawerDescription}>{product.description}</p>
            <button
              className={`${styles.quickAdd} ${added ? styles.isAdded : ""}`}
              type="button"
              onClick={handleCartToggle}
              disabled={
                cartPending ||
                (!added &&
                  (product.stockQuantity === 0 || !product.variants?.[0]))
              }
            >
              {added ? <Minus size={16} /> : <Plus size={16} />}
              {added ? "Remove from cart" : "Add to cart"}
            </button>
            <Link
              href={`/products/${product.slug}`}
              className={styles.fullDetailsLink}
            >
              View full product details
            </Link>
          </aside>
        </>
      )}
    </>
  );
}
