"use client";

import { useCurrency } from "@/components/providers/currency-provider";

export function CurrencyPrice({ price }) {
  const { formatPrice } = useCurrency();
  return formatPrice(price);
}
