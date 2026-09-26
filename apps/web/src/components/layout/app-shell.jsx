"use client";

import { usePathname } from "next/navigation";
import { CartProvider } from "@/components/providers/cart-provider";
import { CurrencyProvider } from "@/components/providers/currency-provider";
import { WishlistProvider } from "@/components/providers/wishlist-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PromotionPopup } from "@/components/layout/promotion-popup";
import styles from "./site-header.module.css";

export function AppShell({ children }) {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
    return <main className={styles.loginMain}>{children}</main>;
  }

  if (pathname === "/checkout") {
    return (
      <CurrencyProvider>
        <CartProvider>
          <main className={styles.content}>{children}</main>
        </CartProvider>
      </CurrencyProvider>
    );
  }

  return (
    <CurrencyProvider>
      <CartProvider>
        <WishlistProvider>
          <div
            className={styles.announcement}
            aria-label="Store announcements"
            id="top"
          >
            Same Day Shipping Before 3PM – Free Shipping on Orders Over $50 to
            Beirut
          </div>
          <SiteHeader />
          <PromotionPopup />
          <main className={styles.content}>{children}</main>
          <SiteFooter />
        </WishlistProvider>
      </CartProvider>
    </CurrencyProvider>
  );
}
