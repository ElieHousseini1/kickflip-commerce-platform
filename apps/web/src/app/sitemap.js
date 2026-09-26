import { listProducts } from "@/services/server-api";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap() {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();
  // Keep metadata generation deployable even when the API is started later in
  // the release process. Product URLs appear on the next metadata request.
  const products = await listProducts().catch(() => []);

  return [
    {
      url: `${siteUrl}/products`,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    ...products.map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
