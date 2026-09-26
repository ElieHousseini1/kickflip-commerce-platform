import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { ResilientImage } from "@/components/ui/resilient-image";
import { useCurrency } from "@/components/providers/currency-provider";
import shared from "@/styles/shared.module.css";
import styles from "./cart-line-item.module.css";

export function CartLineItem({
  line,
  disabled = false,
  onUpdateQuantity,
  onChangeVariant,
  onRemove,
}) {
  const { formatPrice } = useCurrency();
  const { product, selectedVariant, variantId, quantity } = line;

  return (
    <article className={styles.line}>
      <Link href={`/products/${product.slug}`} className={styles.image}>
        <ResilientImage
          src={product.image}
          alt={product.name}
          fill
          sizes="160px"
        />
      </Link>
      <div className={styles.info}>
        <p className={shared.eyebrow}>{product.category}</p>
        <Link href={`/products/${product.slug}`}>{product.name}</Link>
        <label className={styles.variantControl}>
          <span>{product.variantName}</span>
          <select
            value={selectedVariant.id}
            disabled={disabled}
            onChange={(event) => onChangeVariant(event.target.value)}
            aria-label={`Change ${product.name} ${product.variantName.toLowerCase()}`}
          >
            {product.variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.name}
              </option>
            ))}
          </select>
        </label>
        <span>{formatPrice(product.price)} each</span>
        <p className={styles.lineSubtotal}>
          <span>Item subtotal</span>
          <strong>{formatPrice(product.price * quantity)}</strong>
        </p>
      </div>
      <div className={styles.actions}>
        <div className={styles.quantityControl}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onUpdateQuantity(quantity - 1)}
            aria-label={`Decrease ${product.name} quantity`}
          >
            <Minus size={14} />
          </button>
          <span>{quantity}</span>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onUpdateQuantity(quantity + 1)}
            aria-label={`Increase ${product.name} quantity`}
          >
            <Plus size={14} />
          </button>
        </div>
        <button
          type="button"
          className={styles.remove}
          onClick={onRemove}
          disabled={disabled}
        >
          <Trash2 size={15} /> Remove
        </button>
      </div>
    </article>
  );
}
