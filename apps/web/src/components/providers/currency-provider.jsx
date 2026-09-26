"use client";

import { createContext, use, useMemo, useState } from "react";

const USD_TO_LBP = 89_500;
const EUR_TO_USD = 1.1367;

const formatCurrency = (price, currency) =>
  new Intl.NumberFormat(
    currency === "LBP" ? "en-LB" : currency === "EUR" ? "en-IE" : "en-US",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    },
  ).format(
    currency === "LBP"
      ? price * USD_TO_LBP
      : currency === "EUR"
        ? price / EUR_TO_USD
        : price,
  );

const CurrencyContext = createContext({
  currency: "USD",
  setCurrency: () => {},
  formatPrice: (price) => formatCurrency(price, "USD"),
});

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState("USD");

  const value = useMemo(
    () => ({
      currency,
      setCurrency: (nextCurrency) => {
        setCurrency(nextCurrency);
      },
      formatPrice: (price) => formatCurrency(price, currency),
    }),
    [currency],
  );

  return <CurrencyContext value={value}>{children}</CurrencyContext>;
}

export function useCurrency() {
  return use(CurrencyContext);
}
