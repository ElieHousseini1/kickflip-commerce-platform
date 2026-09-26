import Link from "next/link";
import styles from "./brand-logo.module.css";

export function BrandLogo({
  href = "/products",
  className = "",
  ariaLabel = "Kickflip Supply",
}) {
  return (
    <Link
      href={href}
      className={`${styles.logo} ${className}`}
      aria-label={ariaLabel}
    >
      KICK<span>/</span>FLIP
    </Link>
  );
}
