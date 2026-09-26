"use client";

import Link from "next/link";
import { CircleAlert, RotateCcw } from "lucide-react";
import shared from "@/styles/shared.module.css";
import styles from "./error-view.module.css";

export function ErrorView({
  eyebrow = "Something went wrong",
  title = "We couldn’t complete that request.",
  description = "Please try again. If the problem continues, return to the product collection.",
  onRetry,
}) {
  return (
    <main className={`${styles.page} ${shared.container}`}>
      <CircleAlert size={38} strokeWidth={1.3} aria-hidden="true" />
      <span className={shared.eyebrow}>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
      <div className={styles.actions}>
        {onRetry && (
          <button
            type="button"
            className={`${shared.button} ${shared.buttonBlue}`}
            onClick={onRetry}
          >
            Try again <RotateCcw size={16} />
          </button>
        )}
        <Link
          href="/products"
          className={`${shared.button} ${shared.buttonDark}`}
        >
          View products
        </Link>
      </div>
    </main>
  );
}
