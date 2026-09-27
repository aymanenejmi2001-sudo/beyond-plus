// Signals → the five 0–100 components. Each returns its value (or null when
// there is no data) plus plain-language lines explaining exactly how.

import { SCORING } from "../config/scoring.ts";
import type { Candidate, MarketSignal, MoroccoSignal, SupplierOffer } from "../lib/types.ts";

export interface Part { value: number | null; lines: string[] }

const clamp = (n: number) => Math.max(0, Math.min(100, n));
export const round1 = (n: number) => Math.round(n * 10) / 10;
const ageDays = (iso: string, now: number) => (now - Date.parse(iso)) / 864e5;
const rel = (r: string) => SCORING.reliability[r] ?? 0.35;
const fresh = <T extends { observed_at: string }>(rows: T[], now: number) => rows.filter((r) => ageDays(r.observed_at, now) <= SCORING.signalMaxAgeDays);

/** Latest observation per source+metric, then reliability-weighted mean. */
function weightedLatest(signals: MarketSignal[], now: number): Part {
  const latest = new Map<string, MarketSignal>();
  for (const s of fresh(signals, now)) {
    const k = `${s.source}|${s.metric}`;
    const cur = latest.get(k);
    if (!cur || s.observed_at > cur.observed_at) latest.set(k, s);
  }
  const rows = [...latest.values()];
  if (!rows.length) return { value: null, lines: ["Aucun signal exploitable (< " + SCORING.signalMaxAgeDays + " j)."] };
  const wsum = rows.reduce((n, s) => n + rel(s.reliability), 0);
  const value = rows.reduce((n, s) => n + s.value * rel(s.reliability), 0) / wsum;
  return {
    value: round1(value),
    lines: [
      ...rows.map((s) => `${s.source} · ${s.metric} = ${s.value}/100 (${s.reliability}, poids ${rel(s.reliability)}, ${s.observed_at.slice(0, 10)})`),
      `Moyenne pondérée par fiabilité = ${round1(value)}`,
    ],
  };
}

export function globalDemand(signals: MarketSignal[], now: number): Part {
  return weightedLatest(signals.filter((s) => s.dimension === "global"), now);
}

/** Structured Moroccan observation → 0–100, with the parts that are known only. */
export function moroccoObservationValue(m: MoroccoSignal): Part {
  const c = SCORING.morocco;
  const parts: [string, number, number | null][] = [
    ["revendeurs", c.parts.retailers, m.retailers_count == null ? null : Math.min(m.retailers_count / c.retailersForFull, 1)],
    ["coloris visibles", c.parts.colorways, m.colorways_count == null ? null : Math.min(m.colorways_count / c.colorwaysForFull, 1)],
    ["disponibilité", c.parts.availability, m.availability === "UNKNOWN" ? null : c.availability[m.availability] ?? null],
    ["promotions (moins = mieux)", c.parts.promotions, m.promotion_frequency == null ? null : 1 - Math.min(Math.max(m.promotion_frequency, 0), 1)],
  ];
  const known = parts.filter((p) => p[2] != null);
  if (!known.length) return { value: null, lines: [`${m.source_name} : aucune donnée chiffrée.`] };
  const max = known.reduce((n, p) => n + p[1], 0);
  const got = known.reduce((n, p) => n + p[1] * (p[2] as number), 0);
  const value = round1((got / max) * 100);
  return {
    value,
    lines: [`${m.source_name} (${m.observed_at.slice(0, 10)}) : ` + known.map((p) => `${p[0]} ${round1(p[1] * (p[2] as number))}/${p[1]}`).join(", ") + ` → ${value}/100` + (known.length < parts.length ? " (parties inconnues exclues)" : "")],
  };
}

export function moroccoDemand(market: MarketSignal[], morocco: MoroccoSignal[], now: number): Part {
  // Structured observations become virtual signals so both kinds share one average.
  const virtual: MarketSignal[] = [];
  const lines: string[] = [];
  const latest = new Map<string, MoroccoSignal>();
  for (const m of fresh(morocco, now)) {
    const cur = latest.get(m.source_name);
    if (!cur || m.observed_at > cur.observed_at) latest.set(m.source_name, m);
  }
  for (const m of latest.values()) {
    const p = moroccoObservationValue(m);
    lines.push(...p.lines);
    if (p.value != null) virtual.push({ ...(m as unknown as MarketSignal), dimension: "morocco", source: m.source_name, metric: "morocco_market_observation", value: p.value });
  }
  const res = weightedLatest([...market.filter((s) => s.dimension === "morocco"), ...virtual], now);
  return { value: res.value, lines: res.value == null ? ["Aucun signal marocain exploitable."] : [...lines, ...res.lines] };
}

/** Explicit velocity signals win; else the slope of repeated global/morocco observations. */
export function trendVelocity(market: MarketSignal[], now: number): Part {
  const explicit = market.filter((s) => s.dimension === "velocity");
  if (fresh(explicit, now).length) return weightedLatest(explicit, now);
  const series = new Map<string, MarketSignal[]>();
  for (const s of fresh(market, now)) {
    if (s.dimension === "velocity" || s.reliability === "EDITORIAL") continue; // editorial ratings are not time series
    const k = `${s.dimension}|${s.source}|${s.metric}`;
    series.set(k, [...(series.get(k) ?? []), s]);
  }
  const slopes: { k: string; v: number; w: number; line: string }[] = [];
  for (const [k, rows] of series) {
    rows.sort((a, b) => a.observed_at.localeCompare(b.observed_at));
    const first = rows[0], last = rows[rows.length - 1];
    const span = (Date.parse(last.observed_at) - Date.parse(first.observed_at)) / 864e5;
    if (rows.length < 2 || span < SCORING.velocity.minSpanDays) continue;
    const per30 = ((last.value - first.value) / span) * 30;
    const v = clamp(50 + per30 * SCORING.velocity.pointsPer30dChange);
    slopes.push({ k, v, w: rel(last.reliability), line: `${k.replace(/\|/g, " · ")} : ${first.value} → ${last.value} en ${Math.round(span)} j (${round1(per30)} pts/30 j) → ${round1(v)}` });
  }
  if (!slopes.length) return { value: null, lines: ["Pas assez d'historique (2 relevés espacés d'au moins " + SCORING.velocity.minSpanDays + " j)."] };
  const value = round1(slopes.reduce((n, s) => n + s.v * s.w, 0) / slopes.reduce((n, s) => n + s.w, 0));
  return { value, lines: [...slopes.map((s) => s.line), `50 = stable. Moyenne pondérée = ${value}`] };
}

export function bestOffer(offers: SupplierOffer[]): SupplierOffer | null {
  const rank = { AVAILABLE: 0, LIMITED: 1, UNKNOWN: 2, OUT_OF_STOCK: 3 } as const;
  const latest = new Map<string, SupplierOffer>();
  for (const o of offers) {
    const k = `${o.supplier_name}|${o.supplier_product_reference ?? o.supplier_url ?? ""}`;
    const cur = latest.get(k);
    if (!cur || o.observed_at > cur.observed_at) latest.set(k, o);
  }
  return [...latest.values()].sort((a, b) =>
    rank[a.supplier_status] - rank[b.supplier_status] || (a.estimated_landed_cost_mad ?? a.supplier_cost_mad ?? 1e9) - (b.estimated_landed_cost_mad ?? b.supplier_cost_mad ?? 1e9),
  )[0] ?? null;
}

export interface MarginCalc { sellingPriceMAD: number | null; landedCostMAD: number | null; costOnlyMAD: number | null; grossMarginMAD: number | null; grossMarginPct: number | null; lines: string[] }

export function margin(c: Candidate, offer: SupplierOffer | null): MarginCalc {
  const sell = c.selling_price_mad;
  const landed = offer?.estimated_landed_cost_mad ?? null;
  const costOnly = offer?.supplier_cost_mad ?? null;
  const lines: string[] = [];
  lines.push(sell == null ? "Prix de vente BEYOND : non fixé." : `Prix de vente BEYOND : ${sell} MAD.`);
  if (!offer) lines.push("Aucune offre fournisseur.");
  else {
    lines.push(`Coût fournisseur : ${costOnly ?? "inconnu"}${costOnly != null ? " MAD" : ""}${offer.cost_basis === "SUPPLIER_LISTED_PRICE" ? " (prix affiché fournisseur — à confirmer)" : ""}.`);
    lines.push(`Transport : ${offer.shipping_cost_mad ?? "inconnu"}${offer.shipping_cost_mad != null ? " MAD" : ""}. Coût rendu : ${landed ?? "inconnu"}${landed != null ? " MAD" : ""}.`);
  }
  if (sell == null || landed == null) {
    if (sell != null && costOnly != null) lines.push(`Indication hors transport : ${sell - costOnly} MAD (${round1(((sell - costOnly) / sell) * 100)} %) — non utilisée dans le score.`);
    return { sellingPriceMAD: sell, landedCostMAD: landed, costOnlyMAD: costOnly, grossMarginMAD: null, grossMarginPct: null, lines };
  }
  const gm = sell - landed, pct = round1((gm / sell) * 100);
  lines.push(`Marge brute estimée = ${sell} − ${landed} = ${gm} MAD (${pct} %).`);
  return { sellingPriceMAD: sell, landedCostMAD: landed, costOnlyMAD: costOnly, grossMarginMAD: gm, grossMarginPct: pct, lines };
}

export function marginScore(m: MarginCalc): Part {
  if (m.grossMarginPct == null) return { value: null, lines: [...m.lines, "Marge inconnue → composante exclue."] };
  const v = round1(clamp((m.grossMarginPct / SCORING.margin.targetGrossMarginPct) * 100));
  return { value: v, lines: [...m.lines, `${m.grossMarginPct} % ÷ cible ${SCORING.margin.targetGrossMarginPct} % → ${v}/100`] };
}

export function supplierScore(offer: SupplierOffer | null): Part {
  if (!offer) return { value: null, lines: ["Aucune offre fournisseur."] };
  const base = SCORING.supplier.status[offer.supplier_status];
  if (base == null) return { value: null, lines: [`${offer.supplier_name} : statut inconnu.`] };
  const lines = [`${offer.supplier_name} : ${offer.supplier_status} → ${base}`];
  let v = base;
  if (offer.available_sizes?.length) {
    const core = SCORING.supplier.coreSizes;
    const cov = core.filter((s) => offer.available_sizes!.includes(s)).length / core.length;
    const pts = round1(cov * SCORING.supplier.sizeCoveragePoints);
    v += pts;
    lines.push(`Pointures ${core[0]}–${core[core.length - 1]} couvertes : ${Math.round(cov * 100)} % → +${pts}`);
  } else lines.push("Pointures disponibles : inconnues → +0");
  if (offer.lead_time_days != null) {
    const step = SCORING.supplier.leadTime.find((s) => offer.lead_time_days! <= s.maxDays);
    v += step?.points ?? 0;
    lines.push(`Délai ${offer.lead_time_days} j → +${step?.points ?? 0}`);
  } else lines.push("Délai : inconnu → +0");
  lines.push(`Relevé du ${offer.observed_at.slice(0, 10)}.`);
  return { value: round1(clamp(v)), lines };
}
