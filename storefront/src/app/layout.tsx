import type { Metadata, Viewport } from "next";
import { archivo, syne } from "./fonts";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RevealRoot } from "@/components/ui/RevealRoot";
import { STORE } from "@/data/store";
import "./globals.css";

/**
 * Deployments stay out of search engines until the domain and prices are final. Set NEXT_PUBLIC_SITE_STATUS=live (an env var
 * in the hosting dashboard) on the day the real site goes up.
 */
const isLive = process.env.NEXT_PUBLIC_SITE_STATUS === "live";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://beyondplusmaroc.com"),
  robots: isLive
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  title: {
    default: "BEYOND PLUS",
    template: "%s | Beyond Plus",
  },
  description:
    "BEYOND PLUS, concept store sneakers au Maroc : low profile, retro runners, skate et icônes. Sélection courte, commande en ligne confirmée par téléphone, livraison gratuite partout au Maroc.",
  openGraph: {
    type: "website",
    siteName: "BEYOND PLUS",
    locale: "fr_MA",
    images: [{ url: "/images/beyond/editorial-1.jpg", width: 1080, height: 1350, alt: "BEYOND PLUS, sneakers au Maroc" }],
  },
  twitter: { card: "summary_large_image" },
};

// Brand entity for search engines — only facts we can stand behind.
const ORG_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "#org",
      name: "BEYOND PLUS",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://beyondplusmaroc.com",
      logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://beyondplusmaroc.com"}/images/beyond/symbol.png`,
      slogan: "Go Beyond.",
      sameAs: [STORE.instagram],
      areaServed: { "@type": "Country", name: "Maroc" },
      contactPoint: { "@type": "ContactPoint", telephone: "+212669866831", contactType: "customer service", availableLanguage: ["French", "Arabic"] },
    },
    {
      "@type": "WebSite",
      name: "BEYOND PLUS",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://beyondplusmaroc.com",
      inLanguage: "fr-MA",
      publisher: { "@id": "#org" },
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-MA" data-scheme="light" className={`${syne.variable} ${archivo.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_LD) }}
        />
          <CartProvider>
            <RevealRoot />
            <a href="#main" className="visually-hidden">
              Aller au contenu
            </a>
            <AnnouncementBar />
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
      </body>
    </html>
  );
}
