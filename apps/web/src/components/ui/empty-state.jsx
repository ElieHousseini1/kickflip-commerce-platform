import Link from "next/link";
import { ArrowRight } from "lucide-react";
import shared from "@/styles/shared.module.css";
import styles from "./empty-state.module.css";

export function EmptyState({
  icon,
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
}) {
  return (
    <main className={`${styles.page} ${shared.container}`}>
      {icon}
      <span className={shared.eyebrow}>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link
        href={actionHref}
        className={`${shared.button} ${shared.buttonDark}`}
      >
        {actionLabel} <ArrowRight size={17} />
      </Link>
    </main>
  );
}
