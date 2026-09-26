"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { OrderSummary } from "@/components/cart/order-summary";
import { useCart } from "@/components/providers/cart-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorView } from "@/components/ui/error-view";
import { PageLoader } from "@/components/ui/page-loader";
import { calculateCartTotals } from "@/lib/cart-totals";
import { getErrorMessage } from "@/lib/error-message";
import shared from "@/styles/shared.module.css";
import styles from "./cart.module.css";

export default function CartPage() {
  const {
    lines: items,
    isLoading,
    loadError,
    updateQuantity,
    changeVariant,
    removeItem,
  } = useCart();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const { subtotal, shipping, total } = calculateCartTotals(items);

  const handleCartAction = async (action) => {
    if (pending) return;
    setError("");
    setPending(true);
    try {
      await action();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to update your cart."));
    } finally {
      setPending(false);
    }
  };

  if (isLoading) return <PageLoader label="Loading cart" />;
  if (loadError) {
    return (
      <ErrorView
        title="We couldn’t load your cart."
        description={loadError}
        onRetry={() => window.location.reload()}
      />
    );
  }
  if (items.length === 0)
    return (
      <EmptyState
        icon={<ShoppingBag size={36} strokeWidth={1.3} />}
        eyebrow="Your cart"
        title="Nothing here yet."
        description="Pick something from the drop and come back swinging."
        actionHref="/products"
        actionLabel="Shop the drop"
      />
    );

  return (
    <main className={`${shared.commercePage} ${shared.container}`}>
      <header className={shared.commerceHeading}>
        <span className={shared.eyebrow}>Almost yours</span>
        <h1>
          Cart{" "}
          <sup>{items.reduce((total, item) => total + item.quantity, 0)}</sup>
        </h1>
      </header>
      {error && (
        <p className={`${shared.error} ${styles.error}`} role="alert">
          {error}
        </p>
      )}
      <div className={styles.layout}>
        <section className={styles.lines} aria-label="Cart items">
          {items.map((line) => (
            <CartLineItem
              key={`${line.product.id}-${line.variantId}`}
              line={line}
              disabled={pending}
              onUpdateQuantity={(quantity) =>
                handleCartAction(() =>
                  updateQuantity(line.product.id, line.variantId, quantity),
                )
              }
              onChangeVariant={(nextVariantId) =>
                handleCartAction(() =>
                  changeVariant(line.product.id, line.variantId, nextVariantId),
                )
              }
              onRemove={() =>
                handleCartAction(() =>
                  removeItem(line.product.id, line.variantId),
                )
              }
            />
          ))}
        </section>
        <OrderSummary subtotal={subtotal} shipping={shipping} total={total} />
      </div>
    </main>
  );
}
