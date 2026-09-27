/* ============================================================================
   Storefront data access layer
   ----------------------------------------------------------------------------
   Every page/component reads through these functions. Today they resolve from
   the mock catalog; at go-live each body becomes a `storefront<T>(query, vars)`
   call against the Shopify Storefront API. The signatures and return types are
   already the Storefront shapes, so nothing downstream changes.
   ========================================================================= */

import { CATALOG, PRODUCT_BY_HANDLE } from "@/data/catalog";
import { COLLECTIONS, COLLECTION_BY_HANDLE } from "@/data/collections";
import type { Collection, Product } from "./types";

export async function getProduct(handle: string): Promise<Product | null> {
  return PRODUCT_BY_HANDLE.get(handle) ?? null;
}

export async function getProducts(limit = 24): Promise<Product[]> {
  return CATALOG.slice(0, limit);
}

export async function getCollection(handle: string): Promise<Collection | null> {
  return COLLECTION_BY_HANDLE.get(handle) ?? null;
}

export async function getCollections(): Promise<Collection[]> {
  return COLLECTIONS;
}

export async function getProductsByType(type: string, limit = 12): Promise<Product[]> {
  return CATALOG.filter((p) => p.productType === type).slice(0, limit);
}

/** Same style family, then same brand, same gender, close price; varied silhouettes, in stock first. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const m = product.merch;
  const price = Number(product.priceRange.minVariantPrice.amount);
  const affinity = (p: Product) => {
    const o = p.merch;
    if (!m || !o) return 0;
    return (o.style === m.style ? 4 : 0) + (o.brand === m.brand ? 2 : 0) + (o.silhouette === m.silhouette ? -1 : 0)
      + (Math.abs(Number(p.priceRange.minVariantPrice.amount) - price) <= 80 ? 1 : 0)
      + (!m.gender || !o.gender || o.gender === m.gender || o.gender === "unisex" || m.gender === "unisex" ? 1.5 : -3)
      + (p.availableForSale ? 0 : -10) + o.rank / 100;
  };
  const perSilhouette = new Map<string, number>();
  return CATALOG.filter((p) => p.handle !== product.handle)
    .sort((a, b) => affinity(b) - affinity(a))
    .filter((p) => {                                   // variety: at most 2 of one silhouette
      const key = p.merch?.silhouette ?? p.handle;
      const n = perSilhouette.get(key) ?? 0;
      perSilhouette.set(key, n + 1);
      return key === "legacy" || n < 2;
    })
    .slice(0, limit)
    .map(toCard);
}

/** What a card needs — keeps collection pages light on mobile. */
export function toCard(p: Product): Product {
  return {
    ...p, description: "", descriptionHtml: "", metafields: {}, tags: [],
    images: p.images.slice(0, 2).map((i) => ({ ...i, altText: i === p.images[0] ? p.title : null })),
    variants: p.variants.map((v) => ({
      id: v.id, title: v.title, availableForSale: v.availableForSale, quantityAvailable: null,
      selectedOptions: v.selectedOptions, price: v.price, compareAtPrice: null, image: null, sku: null,
    })),
    merch: p.merch && { ...p.merch, colorway: "", silhouette: p.merch.silhouette },
  };
}

export function getAllProductHandles(): string[] {
  return CATALOG.map((p) => p.handle);
}

export function getAllCollectionHandles(): string[] {
  return COLLECTIONS.map((c) => c.handle);
}

export * from "./types";
export * from "./money";
