import type { Metadata } from "next";
import { StoredProducts } from "@/components/product/ProductList";
import { WISHLIST_KEY } from "@/lib/storage-keys";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false, follow: true } };

export default function WishlistPage() {
  return (
    <div style={{ paddingBlock: "4rem 6rem" }}>
      <StoredProducts
        storageKey={WISHLIST_KEY}
        max={48}
        title="Votre wishlist"
        empty={
          <div style={{ textAlign: "center", padding: "6rem 1.6rem", display: "grid", gap: "2rem", justifyItems: "center" }}>
            <h1 style={{ fontSize: "1.3rem", letterSpacing: "var(--tracking-eyebrow)", textTransform: "uppercase" }}>Votre wishlist</h1>
            <p>Touchez le cœur d’une paire pour la retrouver ici. Elle reste sur cet appareil, sans compte.</p>
            <LinkButton href="/collections/nouveautes" variant="primary">Voir la sélection</LinkButton>
          </div>
        }
      />
    </div>
  );
}
