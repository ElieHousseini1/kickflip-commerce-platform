"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { BrandLogo } from "@/components/ui/brand-logo";
import styles from "./promotion-popup.module.css";

const promotionKey = "kickflip-promotion-seen";

export function PromotionPopup() {
  const [open, setOpen] = useState(false);

  const dismiss = useCallback(() => {
    window.sessionStorage.setItem(promotionKey, "true");
    setOpen(false);
  }, []);

  useEffect(() => {
    const showPopup = window.setTimeout(() => {
      if (window.sessionStorage.getItem(promotionKey) !== "true") setOpen(true);
    }, 0);

    return () => window.clearTimeout(showPopup);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [dismiss, open]);

  if (!open) return null;

  return (
    <div className={styles.shell} role="presentation">
      <button
        type="button"
        className={styles.backdrop}
        onClick={dismiss}
        aria-label="Close promotion"
      />
      <section
        className={styles.popup}
        role="dialog"
        aria-modal="true"
        aria-labelledby="promotion-title"
      >
        <button
          type="button"
          className={styles.close}
          onClick={dismiss}
          aria-label="Close promotion"
        >
          <X size={22} />
        </button>
        <BrandLogo className={styles.logo} ariaLabel="Kickflip Supply" />
        <p className={styles.eyebrow}>Limited-time promotion</p>
        <h2 id="promotion-title">Save 20% on selected gear.</h2>
        <p className={styles.copy}>
          Fresh decks, completes, and everyday skate essentials are marked down
          while stock lasts.
        </p>
        <Link href="/products" className={styles.action} onClick={dismiss}>
          Shop the promotion <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}
