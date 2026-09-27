import Link from "next/link";
import type { Metadata } from "next";
import { BRANDS, MODELS } from "@/data/brands";

export const metadata: Metadata = {
  title: "Marques de sneakers au Maroc",
  description: "Toutes les marques de la sélection BEYOND PLUS : adidas, Nike, New Balance, ASICS, Jordan et plus, avec leurs modèles. Livraison partout au Maroc.",
  alternates: { canonical: "/marques" },
};

export default function Marques() {
  return (
    <section className="beyond-page">
      <p className="eyebrow">Sneakers</p>
      <h1>Marques</h1>
      <ul className="beyond-guides">
        {BRANDS.map((b) => (
          <li key={b.handle}>
            <Link href={`/collections/${b.handle}`}>
              <h2>{b.name} <small style={{ fontSize: "1.2rem", letterSpacing: ".1em", color: "rgb(var(--c-fg-2))" }}>{b.products.length} paires</small></h2>
            </Link>
            <p className="beyond-collection-seo-links" style={{ padding: "0 0 2.4rem" }}>
              {MODELS.filter((m) => m.brand === b.match).map((m) => (
                <Link key={m.handle} href={`/collections/${m.handle}`}>{m.name}</Link>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
