import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCurrency } from "@/components/providers/currency-provider";
import shared from "@/styles/shared.module.css";
import styles from "./order-summary.module.css";

export function OrderSummary({ subtotal, shipping, total }) {
  const { formatPrice } = useCurrency();
  return (
    <aside className={styles.summary} aria-label="Order summary">
      <span className={shared.eyebrow}>Order summary</span>
      <div>
        <span>Subtotal</span>
        <strong>{formatPrice(subtotal)}</strong>
      </div>
      <div>
        <span>Delivery</span>
        <strong>
          {shipping === 0 ? "Complimentary" : formatPrice(shipping)}
        </strong>
      </div>
      <div className={styles.total}>
        <span>Total</span>
        <strong>{formatPrice(total)}</strong>
      </div>
      <p>Taxes are included. Delivery is complimentary on orders over $50.</p>
      <Link
        href="/checkout"
        className={`${shared.button} ${shared.buttonBlue} ${styles.summaryButton}`}
      >
        Proceed to checkout <ArrowRight size={17} />
      </Link>
      <Link href="/products" className={styles.continueLink}>
        Continue shopping
      </Link>
    </aside>
  );
}
