"use client";

import { track } from "@/lib/commerce/track";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/shopify/types";
import { ASSETS } from "@/data/assets";
import { ProductCard } from "@/components/product/ProductCard";
import { Button, LinkButton } from "@/components/ui/Button";
import { Facets, type FacetGroup, type FacetState, type SortKey } from "./Facets";
import { PAGE_SIZE } from "@/lib/pagination";
import styles from "./ProductGrid.module.css";


const PLATE_AFTER = 12;


const GENDER: Record<string, string> = { women: "Femme", men: "Homme", unisex: "Unisexe" };
const STYLE: Record<string, string> = {
  "low-profile": "Low Profile", "retro-runner": "Retro Runner", "y2k-runner": "Y2K Runner", skate: "Skate",
  "basketball-retro": "Basketball", terrace: "Terrace", racing: "Racing", technical: "Technical", icon: "Icon",
};
const priceBand = (p: Product) => {
  const n = Number(p.priceRange.minVariantPrice.amount);
  return n < 600 ? "Moins de 600 DH" : n <= 700 ? "600 à 700 DH" : "Plus de 700 DH";
};
const PRICE_ORDER = ["Moins de 600 DH", "600 à 700 DH", "Plus de 700 DH"];

/** Facet values per product — one place, used for counting and matching. */
const FACETS: { id: string; label: string; pick: (p: Product) => string[]; order?: (a: string, b: string) => number }[] = [
  { id: "brand", label: "Marque", pick: (p) => [p.merch?.brand ?? p.vendor] },
  { id: "size", label: "Pointure", pick: (p) => p.variants.filter((v) => v.availableForSale).map((v) => v.title), order: (a, b) => Number(a) - Number(b) },
  { id: "style", label: "Style", pick: (p) => (p.merch ? [STYLE[p.merch.style] ?? p.merch.style] : []) },
  { id: "gender", label: "Genre", pick: (p) => (p.merch ? [GENDER[p.merch.gender]] : []) },
  { id: "color", label: "Couleur", pick: (p) => (p.merch ? [p.merch.color] : []) },
  { id: "price", label: "Prix", pick: (p) => [priceBand(p)], order: (a, b) => PRICE_ORDER.indexOf(a) - PRICE_ORDER.indexOf(b) },
];

function buildFacets(products: Product[]): FacetGroup[] {
  return FACETS.map((f) => {
    const map = new Map<string, number>();
    for (const p of products) for (const v of new Set(f.pick(p))) map.set(v, (map.get(v) ?? 0) + 1);
    const options = [...map.entries()].map(([value, count]) => ({ value, count }));
    options.sort(f.order ? (a, b) => f.order!(a.value, b.value) : (a, b) => b.count - a.count);
    return { id: f.id, label: f.label, options };
  }).filter((g) => g.options.length > 1);
}

function matches(product: Product, filters: FacetState): boolean {
  return FACETS.every((f) => {
    const wanted = filters[f.id] ?? [];
    return !wanted.length || f.pick(product).some((v) => wanted.includes(v));
  });
}

interface GridProps {
  products: Product[];
  /** 1-based page from ?page=N — server-rendered so every page is crawlable. */
  page?: number;
  basePath: string;
}

export function ProductGrid({ products, page = 1, basePath }: GridProps) {
  useEffect(() => { track("view_item_list", undefined, { list: basePath ?? "", count: products.length }); }, [basePath, products.length]);
  const [filters, setFilters] = useState<FacetState>({});
  const [sort, setSort] = useState<SortKey>("featured");
  const [dense, setDense] = useState(false);
  // End of the window currently shown. On ?page=N the window starts at page N.
  const [visible, setVisible] = useState(page * PAGE_SIZE);

  const facetGroups = useMemo(() => buildFacets(products), [products]);

  const filtered = useMemo(() => {
    const list = products.filter((p) => matches(p, filters));
    const price = (p: Product) => Number(p.priceRange.minVariantPrice.amount);
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => price(a) - price(b));
      case "price-desc":
        return [...list].sort((a, b) => price(b) - price(a));
      case "title":
        return [...list].sort((a, b) => a.title.localeCompare(b.title, "fr"));
      default:
        return list;
    }
  }, [products, filters, sort]);

  // Filters or a custom sort reshuffle the list: show it from the top.
  const browsing = sort === "featured" && Object.values(filters).every((v) => v.length === 0);
  const start = browsing ? (page - 1) * PAGE_SIZE : 0;
  const shown = filtered.slice(start, visible);
  const nextPage = Math.floor(visible / PAGE_SIZE) + 1;
  const pageHref = (n: number) => (n <= 1 ? basePath : `${basePath}?page=${n}`);
  const perRow = dense ? 6 : 4;

  const applyFilters = (next: FacetState) => {
    setFilters(next);
    setVisible(Math.max(PAGE_SIZE, start + PAGE_SIZE));
  };

  // ---- Auto-load: the next batch arrives before the visitor reaches the end.
  // The <a href="?page=N"> stays for crawlers and as a fallback.
  const sentinel = useRef<HTMLDivElement>(null);
  const hasMore = visible < filtered.length;
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore) return;
    const io = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setVisible((v) => v + PAGE_SIZE); },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, visible]);

  // ---- Back from a product: same filters, same number of pairs, same place.
  const storeKey = `grid:${basePath}:${page}`;
  const restoreY = useRef<number | null>(null);
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storeKey) ?? "null");
      if (!saved) return;
      sessionStorage.removeItem(storeKey);
      setFilters(saved.filters ?? {});
      setSort(saved.sort ?? "featured");
      setVisible(saved.visible ?? page * PAGE_SIZE);
      restoreY.current = saved.y ?? null;
    } catch { /* storage unavailable: start from the top */ }
  }, [storeKey, page]);
  useEffect(() => {
    if (restoreY.current === null) return;
    const y = restoreY.current;
    restoreY.current = null;
    requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, y)));
  }, [visible]);
  const rememberPosition = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('a[href^="/products/"]')) return;
    try { sessionStorage.setItem(storeKey, JSON.stringify({ visible, filters, sort, y: window.scrollY })); } catch { /* ignore */ }
  };

  return (
    <div className={styles.page}>
      <Facets
        groups={facetGroups}
        value={filters}
        onChange={applyFilters}
        sort={sort}
        onSortChange={setSort}
        dense={dense}
        onDensityChange={setDense}
        resultCount={filtered.length}
      />

      <div className={styles.wrapper}>
        {browsing && page > 1 && (
          <div className={styles.more} style={{ paddingTop: 0, paddingBottom: "2.4rem" }}>
            <LinkButton href={pageHref(page - 1)} variant="text">
              ← Page précédente
            </LinkButton>
          </div>
        )}
        {shown.length === 0 ? (
          <div className={styles.empty}>
            <p className="prose muted">Aucune pièce ne correspond à cette sélection.</p>
            <Button variant="text" onClick={() => applyFilters({})}>
              Réinitialiser
            </Button>
          </div>
        ) : (
          <ul className={styles.grid} data-dense={dense} onClickCapture={rememberPosition}>
            {shown.map((product, i) => [
              <li
                key={product.id}
                className={styles.item}
                data-reveal
                style={{ ["--reveal-delay" as string]: `${(i % perRow) * 55}ms` }}
              >
                <ProductCard
                  product={product}
                  layout="editorial"
                  priority={i < perRow}
                  sizes={
                    dense
                      ? "(min-width: 1600px) 14vw, (min-width: 990px) 17vw, (min-width: 750px) 25vw, 50vw"
                      : "(min-width: 1600px) 20vw, (min-width: 990px) 25vw, (min-width: 750px) 33vw, 50vw"
                  }
                />
              </li>,
              i === PLATE_AFTER - 1 && shown.length > PLATE_AFTER && (
              <li className={styles.plate} key="plate">
                <Image
                  src={ASSETS.collectionBanner.src}
                  alt=""
                  width={ASSETS.collectionBanner.width}
                  height={ASSETS.collectionBanner.height}
                  sizes="100vw"
                  quality={76}
                />
                <div className={styles.plateBody}>
                  <p className="display-3">{basePath.endsWith("trending-now") ? "Toute la sélection" : "Trending Now"}</p>
                  <LinkButton href={basePath.endsWith("trending-now") ? "/collections/nouveautes" : "/collections/trending-now"} variant="invert">
                    Voir la sélection
                  </LinkButton>
                </div>
              </li>
              ),
            ])}
          </ul>
        )}

        {hasMore && (
          <div className={styles.more} ref={sentinel}>
            {/* Crawlers follow ?page=N; people rarely see it: the batch loads as they approach. */}
            <LinkButton
              href={pageHref(nextPage)}
              variant="outline"
              onClick={(e) => { e.preventDefault(); setVisible((v) => v + PAGE_SIZE); }}
            >
              Voir plus
            </LinkButton>
          </div>
        )}
      </div>
    </div>
  );
}
