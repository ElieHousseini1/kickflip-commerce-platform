import { requestJson } from "@/services/api-client";

export async function searchProducts({ query, category, sort, signal } = {}) {
  const params = new URLSearchParams();
  if (query?.trim()) params.set("q", query.trim());
  if (category && category !== "all") params.set("category", category);
  if (sort && sort !== "featured") params.set("sort", sort);

  const suffix = params.size ? `?${params.toString()}` : "";
  return requestJson(`/products${suffix}`, { signal });
}
