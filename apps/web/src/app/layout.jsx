import { Archivo_Black, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { AppShell } from "@/components/layout/app-shell";
import { getSession } from "@/services/server-api";
import { getSiteUrl } from "@/lib/site-url";
import { getAssetUrl } from "@/lib/assets";

const sans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const display = Archivo_Black({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Kickflip Supply — Built for the streets",
    template: "%s — Kickflip Supply",
  },
  description:
    "Independent goods, everyday gear, and good energy for life on and off the board.",
  applicationName: "Kickflip Supply",
  keywords: [
    "skateboard shop",
    "skateboarding gear",
    "skateboard decks",
    "skate hardware",
    "Beirut skate shop",
  ],
  authors: [{ name: "Kickflip Supply" }],
  creator: "Kickflip Supply",
  alternates: { canonical: "/products" },
  openGraph: {
    type: "website",
    siteName: "Kickflip Supply",
    title: "Kickflip Supply — Built for the streets",
    description:
      "Independent skate goods, complete boards, hardware, ramps, and gear for life on and off the board.",
    url: "/products",
    images: [
      {
        url: getAssetUrl("images/skate-hero.jpg"),
        width: 1024,
        height: 1536,
        alt: "A skateboarder landing a kickflip",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kickflip Supply — Built for the streets",
    description: "Independent skate goods for good lines and bad ideas.",
    images: [getAssetUrl("images/skate-hero.jpg")],
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }) {
  const user = await getSession();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${display.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportingGoodsStore",
              name: "Kickflip Supply",
              url: getSiteUrl(),
              email: "elie.housseini@gmail.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Beirut",
                addressCountry: "LB",
              },
              sameAs: ["https://www.instagram.com/eliehousseini/"],
            }).replace(/</g, "\\u003c"),
          }}
        />
        <AuthProvider initialUser={user}>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
