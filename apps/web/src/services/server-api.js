import "server-only";

import { cookies } from "next/headers";
import {
  toSkateProduct,
  toSkateProducts,
  toSourceProductSlug,
} from "@/lib/skate-catalog";

const API_URL = (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:4000/api"
).replace(/\/$/, "");

export class ServerApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ServerApiError";
    this.status = status;
  }
}

async function fetchApi(path, { authenticated = false, ...options } = {}) {
  const headers = new Headers(options.headers);

  if (authenticated) {
    const cookieHeader = (await cookies()).toString();
    if (cookieHeader) headers.set("cookie", cookieHeader);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: options.cache || "no-store",
  });
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ServerApiError(
      body?.error?.message || body?.message || "The API request failed.",
      response.status,
    );
  }

  return body;
}

export async function getSession() {
  try {
    return (await fetchApi("/auth/session", { authenticated: true })).user;
  } catch (error) {
    if (error instanceof ServerApiError && error.status === 401) return null;
    throw error;
  }
}

export async function listProducts() {
  return toSkateProducts((await fetchApi("/products")).products);
}

export async function findProductBySlug(slug) {
  try {
    const sourceSlug = toSourceProductSlug(slug);
    return toSkateProduct(
      (await fetchApi(`/products/${encodeURIComponent(sourceSlug)}`)).product,
    );
  } catch (error) {
    if (error instanceof ServerApiError && error.status === 404) return null;
    throw error;
  }
}
