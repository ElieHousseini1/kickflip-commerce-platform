"use client";

import { Heart } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { useWishlist } from "@/components/providers/wishlist-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorView } from "@/components/ui/error-view";
import { PageLoader } from "@/components/ui/page-loader";
import shared from "@/styles/shared.module.css";
import productStyles from "@/components/product/product-catalog.module.css";

export default function WishlistPage() {
  const { items: savedProducts, isLoading, loadError } = useWishlist();
  if (isLoading) return <PageLoader label="Loading wishlist" />;
  if (loadError) {
    return (
      <ErrorView
        title="We couldn’t load your wishlist."
        description={loadError}
        onRetry={() => window.location.reload()}
      />
    );
  }
  if (savedProducts.length === 0)
    return (
      <EmptyState
        icon={<Heart size={36} strokeWidth={1.3} />}
        eyebrow="Your wishlist"
        title="Your stash is empty."
        description="Tap the heart on anything you want to keep close."
        actionHref="/products"
        actionLabel="Shop the drop"
      />
    );
  return (
    <main className={`${shared.commercePage} ${shared.container}`}>
      <header className={shared.commerceHeading}>
        <span className={shared.eyebrow}>Your private stash</span>
        <h1>
          Wishlist <sup>{savedProducts.length}</sup>
        </h1>
        <p>The good stuff you called dibs on.</p>
      </header>
      <div
        className={`${productStyles.catalogGrid} ${productStyles.wishlistGrid}`}
      >
        {savedProducts.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </main>
  );
}
