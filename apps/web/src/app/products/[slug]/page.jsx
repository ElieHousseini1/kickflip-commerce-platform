import Link from "next/link";
import { ArrowLeft, Check, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { findProductBySlug } from "@/services/server-api";
import { CurrencyPrice } from "@/components/ui/currency-price";
import { ResilientImage } from "@/components/ui/resilient-image";
import { ProductPurchase } from "@/components/product/product-purchase";
import { getSiteUrl } from "@/lib/site-url";
import { getAssetUrl } from "@/lib/assets";
import shared from "@/styles/shared.module.css";
import styles from "@/components/product/product-detail.module.css";

export async function generateMetadata({ params }) {
  const product = await findProductBySlug((await params).slug);
  return product
    ? {
        title: product.name,
        description: product.description,
        alternates: { canonical: `/products/${product.slug}` },
        openGraph: {
          type: "website",
          title: product.name,
          description: product.description,
          url: `/products/${product.slug}`,
          images: [{ url: getAssetUrl(product.image), alt: product.name }],
        },
        twitter: {
          card: "summary_large_image",
          title: product.name,
          description: product.description,
          images: [getAssetUrl(product.image)],
        },
      }
    : { title: "Product not found", robots: { index: false } };
}
export default async function ProductPage({ params }) {
  const product = await findProductBySlug((await params).slug);
  if (!product) notFound();
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: getAssetUrl(product.image),
    sku: product.id,
    brand: { "@type": "Brand", name: "Kickflip Supply" },
    offers: {
      "@type": "Offer",
      url: `${getSiteUrl()}/products/${product.slug}`,
      priceCurrency: "USD",
      price: product.price,
      availability:
        product.stockQuantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };
  return (
    <main className={`${styles.productPage} ${shared.container}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Link href="/products" className={shared.backLink}>
        <ArrowLeft size={16} /> Back to products
      </Link>
      <div className={styles.detail}>
        <div className={styles.detailImage}>
          <ResilientImage
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 800px) 100vw, 60vw"
          />
        </div>
        <div className={styles.detailContent}>
          <p className={shared.eyebrow}>{product.category}</p>
          <h1>{product.name}</h1>
          <p className={styles.detailPrice}>
            <CurrencyPrice price={product.price} />
          </p>
          <p className={styles.detailDescription}>
            {product.description} Made for daily use, hard sessions, and the
            stories that come with every scuff.
          </p>
          <ProductPurchase product={product} />
          <div className={styles.detailBenefits}>
            <p>
              <Truck size={18} /> Free delivery on orders over $50
            </p>
            <p>
              <Check size={18} />
              {product.stockQuantity > 0
                ? `${product.stockQuantity} ${product.stockQuantity === 1 ? "item" : "items"} remaining in stock`
                : "Out of stock"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
