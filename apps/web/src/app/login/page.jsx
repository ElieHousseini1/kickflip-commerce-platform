import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";
import { BrandLogo } from "@/components/ui/brand-logo";
import { getAssetUrl } from "@/lib/assets";
import shared from "@/styles/shared.module.css";
import styles from "@/components/auth/login.module.css";

export const metadata = {
  title: "Sign in",
  description: "Sign in to Kickflip Supply.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }) {
  const requestedPath = (await searchParams)?.next;
  const nextPath =
    typeof requestedPath === "string" ? requestedPath : "/products";
  return (
    <section className={styles.page}>
      <div className={styles.visual}>
        <Image
          src={getAssetUrl("images/skate-hero.jpg")}
          alt=""
          fill
          priority
          sizes="(max-width: 800px) 100vw, 55vw"
        />
        <div className={styles.visualOverlay} />
        <BrandLogo href="/login" className={styles.wordmark} />
        <div className={styles.quote}>
          <span className={shared.eyebrow}>Independent since forever</span>
          <blockquote>No rules. Just good lines.</blockquote>
          <cite>Kickflip Supply Co. / Beirut</cite>
        </div>
      </div>
      <div className={styles.panel}>
        <LoginForm mode="login" nextPath={nextPath} />
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Kickflip Supply
        </p>
      </div>
    </section>
  );
}
