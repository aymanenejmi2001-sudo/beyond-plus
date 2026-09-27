import { toCard } from "@/lib/shopify";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Hero } from "@/components/home/Hero";
import { SpotlightCards } from "@/components/home/SpotlightCards";
import { ImageWithText } from "@/components/home/ImageWithText";
import { TextBanner } from "@/components/home/TextBanner";
import { Ticker } from "@/components/home/Ticker";
import { DropFeature } from "@/components/drops/DropFeature";
import { HOME_MERCHANDISING } from "@/data/merchandising";
import { dropDate, dropHeroImage, getDrop } from "@/data/drops";
import { homeRails } from "@/data/home-rails";
import type { Product } from "@/lib/shopify/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Sneakers Maroc : adidas, Nike, ASICS, New Balance | Beyond Plus" },
  description: "Sneakers et baskets au Maroc, femme et homme : Samba, Kayano 14, 9060, Dunk. Livraison gratuite en 12 à 48 h, confirmation par téléphone.",
  alternates: { canonical: "/" },
};
// The featured drop switches to "live" client-side; the page itself refreshes every 5 min.
export const revalidate = 300;

function Rail({ title, link, products }: { title: string; link?: { href: string; label: string }; products: Product[] }) {
  if (!products.length) return null;
  return (
    <section>
      <SectionHeader title={title} link={link} />
      <div className="beyond-product-selection">
        {products.map((p) => <ProductCard key={p.id} product={toCard(p)} layout="editorial" sizes="(min-width: 750px) 25vw, 50vw" />)}
      </div>
    </section>
  );
}

export default function HomePage() {
  const drop = HOME_MERCHANDISING.featuredDrop ? getDrop(HOME_MERCHANDISING.featuredDrop) : null;
  const { trending, newIn, picks } = homeRails();
  return (
    <>
      <Hero />
      {drop && (
        <DropFeature
          slug={drop.slug}
          eyebrow={drop.eyebrow}
          title={drop.title}
          subtitle={drop.subtitle}
          launchAt={drop.launchAt}
          dateLabel={dropDate(drop)}
          fixedStatus={drop.status === "auto" ? null : drop.status}
          image={dropHeroImage(drop)}
          serverNow={Date.now()}
        />
      )}
      <Rail title="Trending Now" link={{ href: "/collections/trending-now", label: "Tout voir" }} products={trending} />
      <Rail title="New In" link={{ href: "/collections/nouveautes", label: "Tout voir" }} products={newIn} />
      <Rail title="Beyond Pick" products={picks} />
      <SpotlightCards />
      <ImageWithText />
      <TextBanner />
      <Ticker />
    </>
  );
}
