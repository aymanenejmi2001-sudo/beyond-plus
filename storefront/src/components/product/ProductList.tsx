"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/shopify/types";
import { ProductCard } from "./ProductCard";
import { useStoredList } from "@/lib/hooks/useStoredList";
import styles from "./RelatedProducts.module.css";

// Client list of product cards from handles kept in the browser
// (recently viewed, wishlist). Same cards and grid as "Vous aimerez aussi".
export function StoredProducts({ storageKey, max, title, exclude, empty }: { storageKey: string; max: number; title: string; exclude?: string; empty?: React.ReactNode }) {
  const { items } = useStoredList(storageKey, 60);
  const handles = items.filter((h) => h !== exclude).slice(0, max);
  const key = handles.join(",");
  const [products, setProducts] = useState<Product[] | null>(null);
  useEffect(() => {
    if (!key) { setProducts([]); return; }
    let live = true;
    fetch(`/api/cards?handles=${encodeURIComponent(key)}`).then((r) => r.json()).then((p) => { if (live) setProducts(p); }).catch(() => undefined);
    return () => { live = false; };
  }, [key]);
  if (!products) return null;
  if (!products.length) return empty ? <>{empty}</> : null;
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}><h2 className={styles.title}>{title}</h2></div>
        <div className={styles.grid}>
          {products.map((p) => <ProductCard key={p.id} product={p} layout="editorial" sizes="(min-width: 750px) 25vw, 50vw" />)}
        </div>
      </div>
    </section>
  );
}
