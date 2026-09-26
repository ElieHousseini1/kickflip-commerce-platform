import { ProductCatalog } from "@/components/product/product-catalog";
import { listProducts } from "@/services/server-api";
import shared from "@/styles/shared.module.css";
import styles from "@/components/product/product-catalog.module.css";

export const metadata = {
  title: "Shop the drop",
  description:
    "Explore the latest Kickflip Supply drop — goods for life on and off the board.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Shop skateboards and skate gear",
    description:
      "Shop complete skateboards, decks, hardware, ramps, protection, and accessories from Kickflip Supply.",
    url: "/products",
    images: ["/images/products/street-complete.jpg"],
  },
};

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const initialCategory =
    typeof params?.category === "string" ? params.category : "all";
  const initialQuery = typeof params?.q === "string" ? params.q : "";
  const initialSort =
    typeof params?.sort === "string" ? params.sort : "featured";
  const initialPage =
    typeof params?.page === "string" ? Number(params.page) : 1;
  const products = await listProducts();
  return (
    <main className={styles.catalogPage}>
      <section className={`${shared.container} ${styles.catalogContent}`}>
        <ProductCatalog
          key={`${initialCategory}:${initialQuery}:${initialSort}:${initialPage}`}
          products={products}
          initialCategory={initialCategory}
          initialQuery={initialQuery}
          initialSort={initialSort}
          initialPage={initialPage}
        />
      </section>
    </main>
  );
}
