import { HOME_PRODUCTS } from "@/data/collections";
import { toCard } from "@/lib/shopify";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Hero } from "@/components/home/Hero";
import { SpotlightCards } from "@/components/home/SpotlightCards";
import { ImageWithText } from "@/components/home/ImageWithText";
import { TextBanner } from "@/components/home/TextBanner";
import { Ticker } from "@/components/home/Ticker";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Sneakers Maroc : adidas, Nike, ASICS, New Balance | Beyond Plus" },
  description: "Sneakers et baskets au Maroc, femme et homme : Samba, Kayano 14, 9060, Dunk. Livraison gratuite en 12 à 48 h, confirmation par téléphone.",
  alternates: { canonical: "/" },
};
export default function HomePage(){return <><Hero/><SpotlightCards/><section><SectionHeader title="La sélection" link={{href:"/collections/trending-now",label:"Trending Now"}}/><div className="beyond-product-selection">{HOME_PRODUCTS.slice(0,8).map((p)=><ProductCard key={p.id} product={toCard(p)} layout="editorial" sizes="(min-width: 750px) 25vw, 50vw"/>)}</div></section><ImageWithText/><TextBanner/><Ticker/></>}
