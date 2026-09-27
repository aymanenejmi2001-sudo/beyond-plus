// AUTOMATED — reads catalog/data/products.json, produced by the existing
// polite supplier pipeline (`npm run catalog`: public Shopify products.json,
// robots.txt respected, throttled, cached). No new crawling here.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { SourceAdapter } from "./types.ts";

export const supplierSignals: SourceAdapter = {
  id: "supplier", label: "Fournisseur (Plumas Kicks)", mode: "AUTOMATED", dimension: "supplier", reliability: "MARKET",
  howTo: "Automatique après `npm run catalog`. Le coût relevé est le prix affiché du fournisseur (cost_basis = SUPPLIER_LISTED_PRICE) ; transport, MOQ, délai et quantités restent inconnus tant qu'ils ne sont pas saisis.",
  why: "Seule source fournisseur structurée existante.",
};

export interface SupplierRow {
  id: string; slug: string; brand: string; model: string; colorway: string; silhouette: string; styleFamily: string; gender: "women" | "men" | "unisex";
  sourceUrl: string; sourceName: string; sourceProductCode: string | null; priceMAD: number; sizes: string[]; availableSizes: string[];
  imageRights: string; heroImage: string | null; gallery: string[]; supplierStatus: string; updatedAt: string; publishable: boolean;
}

export async function readSupplierRows(): Promise<{ rows: SupplierRow[]; observedAt: string | null }> {
  const file = join(process.cwd(), "catalog/data/products.json");
  try {
    const rows = JSON.parse(await readFile(file, "utf8")) as SupplierRow[];
    const observedAt = rows.map((r) => r.updatedAt).sort().pop() ?? null;
    return { rows, observedAt };
  } catch { return { rows: [], observedAt: null }; }
}
