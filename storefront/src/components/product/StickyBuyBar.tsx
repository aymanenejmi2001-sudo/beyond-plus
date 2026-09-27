"use client";

import { useEffect, useState, type RefObject } from "react";
import type { Product, ProductVariant } from "@/lib/shopify/types";
import { formatMoney } from "@/lib/shopify/money";
import styles from "./StickyBuyBar.module.css";

// Mobile only: appears once the main CTA has scrolled above the screen.
export function StickyBuyBar({ product, variant, target, onAdd, onChooseSize }: {
  product: Product; variant: ProductVariant | undefined; target: RefObject<HTMLElement | null>; onAdd(): void; onChooseSize(): void;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [target]);
  if (product.previewOnly) return null;
  const available = variant?.availableForSale ?? false;
  const price = variant?.price ?? product.priceRange.minVariantPrice;
  return (
    <div className={styles.bar} data-show={show || undefined} aria-hidden={!show} inert={!show}>
      <div className={styles.text}>
        <span className={styles.name}>{product.title}</span>
        <span className={styles.size}>{variant ? `Pointure ${variant.title}` : "Pointure à choisir"}</span>
      </div>
      <button type="button" className={styles.cta} disabled={!!variant && !available} onClick={() => (variant ? onAdd() : onChooseSize())}>
        {!variant ? "Choisir" : available ? `Ajouter · ${formatMoney(price)}` : "Indisponible"}
      </button>
    </div>
  );
}
