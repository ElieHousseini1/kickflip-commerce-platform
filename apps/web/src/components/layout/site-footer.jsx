"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useCurrency } from "@/components/providers/currency-provider";
import { Dropdown } from "@/components/ui/dropdown";
import { BrandLogo } from "@/components/ui/brand-logo";
import shared from "@/styles/shared.module.css";
import styles from "./site-footer.module.css";

const shopLinks = [
  { href: "/products", label: "Shop the drop" },
  { href: "/wishlist", label: "Your stash" },
  { href: "/cart", label: "Your bag" },
];

const currencyOptions = [
  { value: "LBP", label: "ل.ل — Lebanese Lira" },
  { value: "USD", label: "$ — United States Dollars" },
  { value: "EUR", label: "€ — Euros" },
];

export function SiteFooter() {
  const [subscribed, setSubscribed] = useState(false);
  const { currency, setCurrency } = useCurrency();

  return (
    <footer className={styles.footer}>
      <div className={`${shared.container} ${styles.footerInner}`}>
        <div className={styles.footerTop}>
          <div className={styles.callout}>
            <span className={shared.eyebrow}>Newsletter</span>
            <h2>Fresh drops. No spam.</h2>
            {subscribed ? (
              <p className={styles.newsletterSuccess} role="status">
                You’re on the list. See you in the streets.
              </p>
            ) : (
              <form
                className={styles.newsletterForm}
                onSubmit={(event) => {
                  event.preventDefault();
                  setSubscribed(true);
                }}
              >
                <label htmlFor="newsletter-email">Email address</label>
                <div>
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                  <button type="submit" aria-label="Subscribe to newsletter">
                    Join <ArrowRight size={17} />
                  </button>
                </div>
              </form>
            )}
          </div>

          <nav className={styles.linkGroup} aria-label="Footer shop links">
            <span className={styles.groupLabel}>Shop</span>
            {shopLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.linkGroup}>
            <span className={styles.groupLabel}>Find us</span>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Beirut%2C%20Lebanon"
              target="_blank"
              rel="noreferrer"
            >
              Beirut, Lebanon
            </a>
            <p>Open daily / 10—8</p>
            <a href="tel:+96171441351" aria-label="Call +961 71 441 351">
              +961 71 441 351
            </a>
            <a href="mailto:elie.housseini@gmail.com">
              elie.housseini@gmail.com
            </a>
          </div>

          <div className={styles.socialBlock}>
            <span className={styles.wheel} aria-hidden="true">
              <i />
            </span>
            <a href="#top" className={styles.backToTop}>
              Back to top <span>↑</span>
            </a>
            <a
              href="https://www.instagram.com/eliehousseini/"
              target="_blank"
              rel="noreferrer"
              aria-label="Kickflip Supply on Instagram"
              className={styles.instagram}
            >
              <span aria-hidden="true">@</span> Instagram
            </a>
            <div className={styles.footerCurrency}>
              <span>Currency</span>
              <Dropdown
                value={currency}
                options={currencyOptions}
                onChange={setCurrency}
                ariaLabel="Display currency"
              />
            </div>
          </div>
        </div>

        <BrandLogo
          className={styles.wordmark}
          ariaLabel="Kickflip Supply products"
        />

        <div className={styles.footerBottom}>
          <p>
            Copyright © {new Date().getFullYear()} Kickflip Supply Co. All
            rights reserved.
          </p>
          <p>Built for good lines &amp; bad ideas.</p>
          <p>Independent skate goods.</p>
        </div>
      </div>
    </footer>
  );
}
