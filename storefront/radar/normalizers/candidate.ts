// Identity normalization — one dedupe key per brand + model + colorway (or SKU).

const BRAND_ALIASES: Record<string, string> = {
  asics: "ASICS", adidas: "adidas", "new balance": "New Balance", nb: "New Balance", puma: "PUMA", nike: "Nike",
  saucony: "Saucony", salomon: "Salomon", vans: "Vans", jordan: "Jordan", "air jordan": "Jordan", mizuno: "Mizuno",
  converse: "Converse", on: "On", hoka: "Hoka",
};

export function normalizeBrand(raw: string): string {
  const k = raw.trim().toLowerCase();
  return BRAND_ALIASES[k] ?? raw.trim();
}

const squash = (s: string) =>
  s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export function normalizeSku(sku: string | null | undefined): string | null {
  const s = (sku ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  return s || null;
}

/** SKU wins when known; otherwise brand|model|colorway. Model-level candidates use colorway "*". */
export function dedupeKey(input: { brand: string; model: string; colorway?: string | null; sku?: string | null }): string {
  const sku = normalizeSku(input.sku);
  if (sku) return `sku:${sku}`;
  return `bmc:${squash(normalizeBrand(input.brand))}|${squash(input.model)}|${input.colorway ? squash(input.colorway) : "*"}`;
}

export function slugify(s: string): string {
  return squash(s).replace(/\s+/g, "-").slice(0, 80);
}

export const numOrNull = (v: FormDataEntryValue | string | number | null | undefined): number | null => {
  if (v == null || v === "") return null;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
};
export const strOrNull = (v: FormDataEntryValue | string | null | undefined): string | null => {
  const s = v == null ? "" : String(v).trim();
  return s || null;
};
