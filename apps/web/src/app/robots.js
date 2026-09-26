import { getSiteUrl } from "@/lib/site-url";

export default function robots() {
  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/products", "/products/"],
      disallow: ["/login", "/signup", "/cart", "/wishlist", "/checkout"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
