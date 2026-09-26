import styles from "./page-loader.module.css";

export function PageLoader({ label = "Loading" }) {
  return (
    <main
      className={styles.page}
      aria-busy="true"
      aria-label={label}
      aria-live="polite"
    >
      <span className={styles.spinner} aria-hidden="true" />
    </main>
  );
}
