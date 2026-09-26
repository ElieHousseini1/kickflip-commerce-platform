"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, PackageCheck, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { useCart } from "@/components/providers/cart-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorView } from "@/components/ui/error-view";
import { PageLoader } from "@/components/ui/page-loader";
import { calculateCartTotals } from "@/lib/cart-totals";
import { prepareCheckoutDelivery } from "@/lib/checkout-input";
import { getErrorMessage } from "@/lib/error-message";
import { useCurrency } from "@/components/providers/currency-provider";
import { BrandLogo } from "@/components/ui/brand-logo";
import { placeOrder } from "@/services/order-service";
import { searchProducts } from "@/services/product-service";
import shared from "@/styles/shared.module.css";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
  const { lines: items, isLoading, loadError, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const [confirmation, setConfirmation] = useState(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("ship");
  const [recommendations, setRecommendations] = useState([]);
  const { subtotal, shipping, total } = calculateCartTotals(
    items,
    deliveryMethod,
  );

  useEffect(() => {
    const controller = new AbortController();
    searchProducts({ signal: controller.signal })
      .then(({ products }) => setRecommendations(products))
      .catch((requestError) => {
        if (requestError.name !== "AbortError") setRecommendations([]);
      });
    return () => controller.abort();
  }, []);

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    try {
      const delivery = prepareCheckoutDelivery(form.entries());
      setPending(true);
      const order = await placeOrder(delivery);
      setConfirmation({
        orderNumber: order.orderNumber,
        name: order.customerName,
        email: order.email,
        total: order.total,
      });
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (orderError) {
      setError(getErrorMessage(orderError, "Unable to place order."));
      setPending(false);
    }
  };

  if (confirmation)
    return (
      <main className={`${styles.confirmation} ${shared.container}`}>
        <span className={styles.confirmationIcon}>
          <PackageCheck size={34} />
        </span>
        <span className={shared.eyebrow}>Order confirmed</span>
        <h1>Thank you, {String(confirmation.name).split(" ")[0]}.</h1>
        <p>
          Your order <strong>{confirmation.orderNumber}</strong> has been
          placed. A confirmation will be sent to{" "}
          <strong>{confirmation.email}</strong>.
        </p>
        <div className={styles.confirmationTotal}>
          <span>Order total</span>
          <strong>{formatPrice(confirmation.total)}</strong>
        </div>
        <Link
          href="/products"
          className={`${shared.button} ${shared.buttonBlue}`}
        >
          Return to products <ArrowRight size={17} />
        </Link>
      </main>
    );

  if (isLoading) return <PageLoader label="Loading checkout" />;
  if (loadError) {
    return (
      <ErrorView
        title="We couldn’t load checkout."
        description={loadError}
        onRetry={() => window.location.reload()}
      />
    );
  }
  if (items.length === 0)
    return (
      <EmptyState
        icon={<PackageCheck size={36} strokeWidth={1.3} />}
        eyebrow="Checkout"
        title="Your cart is empty."
        description="Add products before starting checkout."
        actionHref="/products"
        actionLabel="Browse products"
      />
    );

  return (
    <main className={styles.page}>
      <header className={styles.checkoutHeader}>
        <div className={styles.headerInner}>
          <BrandLogo className={styles.headerLogo} />
          <Link
            href="/cart"
            className={styles.cartLink}
            aria-label="Back to cart"
          >
            <ShoppingBag size={21} />
          </Link>
        </div>
      </header>
      <div className={styles.layout}>
        <section className={styles.formPane} aria-label="Checkout details">
          <div className={styles.formInner}>
            <Link href="/cart" className={styles.backLink}>
              <ArrowLeft size={16} /> Back to cart
            </Link>
            <CheckoutForm
              onSubmit={handlePlaceOrder}
              pending={pending}
              error={error}
              total={total}
              deliveryMethod={deliveryMethod}
              onDeliveryMethodChange={setDeliveryMethod}
            />
          </div>
        </section>
        <CheckoutSummary
          items={items}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          deliveryMethod={deliveryMethod}
          recommendations={recommendations
            .filter(
              (product) =>
                product.stockQuantity > 0 &&
                !items.some((line) => line.product.id === product.id),
            )
            .slice(0, 6)}
        />
      </div>
    </main>
  );
}
