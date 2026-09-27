"use client";

import type { Product, ProductVariant } from "@/lib/shopify/types";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import styles from "./AddToCart.module.css";

interface Props {
  product: Product;
  variant: ProductVariant | undefined;
  /** Called when the shopper taps the CTA before picking a size. */
  onChooseSize?(): void;
}

export function AddToCart({ product, variant, onChooseSize }: Props) {
  const { addLine } = useCart();

  const available = !product.previewOnly && (variant?.availableForSale ?? false);
  const qty = variant?.quantityAvailable ?? null;
  const low = available && qty !== null && qty > 0 && qty <= 3;
  const state = !available ? "out" : low ? "low" : "in";
  // No size yet: the button stays live and leads to the size row instead of
  // sitting greyed out over it.
  const needsSize = !product.previewOnly && !variant && !!onChooseSize;

  return (
    <div className={styles.wrapper}>
      <p className={styles.stock} data-state={state}>
        <span className={styles.pip} data-state={state} aria-hidden="true" />
        {product.previewOnly ? "Disponibilité BEYOND PLUS à confirmer" : !available
          ? (variant ? "Indisponible sur commande" : "Choisissez votre pointure")
          : low
            ? `Plus que ${qty} pièce${qty! > 1 ? "s" : ""} en stock`
            : "Disponible sur commande"}
      </p>

      <div className={styles.row}>
        <Button
          variant="editorial"
          block
          disabled={!available && !needsSize}
          onClick={() => (variant ? addLine(product, variant) : onChooseSize?.())}
        >
          {product.previewOnly ? "Bientôt disponible" : available ? "Ajouter au panier" : variant ? "Indisponible" : "Choisir une pointure"}
        </Button>
      </div>
    </div>
  );
}
