// Beyond Score = weighted components (renormalized over the components that
// have data), blended with first-party performance as sales accumulate.
// Pure function: same inputs → same output, fully explained.

import { SCORING, recommend } from "../config/scoring.ts";
import type { Candidate, ComponentExplanation, ComponentKey, ConfidenceLevel, MarketSignal, MoroccoSignal, PerformanceEvent, ScoreExplanation, SupplierOffer } from "../lib/types.ts";
import { computeKpis } from "../performance/kpis.ts";
import { bestOffer, globalDemand, margin, marginScore, moroccoDemand, round1, supplierScore, trendVelocity, type Part } from "./components.ts";

const LABELS: Record<ComponentKey, string> = {
  globalDemand: "Demande mondiale", moroccoDemand: "Demande Maroc", trendVelocity: "Vélocité",
  marginScore: "Marge", supplierScore: "Fournisseur",
};

export interface ScoreInput {
  candidate: Candidate;
  market: MarketSignal[];
  morocco: MoroccoSignal[];
  offers: SupplierOffer[];
  events: PerformanceEvent[];
  now?: number;
}

export function firstParty(events: PerformanceEvent[], now: number) {
  const L = SCORING.learning;
  const all = computeKpis(events, null, now), last30 = computeKpis(events, 30, now);
  if (!all.UNITS_SOLD && all.views < L.minViewsForConversion) return { score: null, weight: 0, lines: ["Aucune donnée BEYOND (ventes / trafic) : score 100 % externe."] };
  const lines: string[] = [];
  const parts: number[] = [];
  const unitsPart = Math.min(last30.UNITS_SOLD / L.benchmarkUnitsPer30d, 1) * 100;
  parts.push(unitsPart);
  lines.push(`Ventes 30 j : ${last30.UNITS_SOLD} paires ÷ repère ${L.benchmarkUnitsPer30d} → ${round1(unitsPart)}/100`);
  if (all.views >= L.minViewsForConversion && all.PRODUCT_CONVERSION_RATE != null) {
    const convPart = Math.min(all.PRODUCT_CONVERSION_RATE / L.benchmarkConversionPct, 1) * 100;
    parts.push(convPart);
    lines.push(`Conversion ${all.PRODUCT_CONVERSION_RATE} % (${all.views} vues) ÷ repère ${L.benchmarkConversionPct} % → ${round1(convPart)}/100`);
  } else lines.push(`Conversion : pas assez de vues suivies (${all.views} < ${L.minViewsForConversion}) → non utilisée.`);
  const score = round1(parts.reduce((a, b) => a + b, 0) / parts.length);
  const weight = round1(Math.min(all.UNITS_SOLD / L.unitsForMaxWeight, 1) * L.maxFirstPartyWeight * 100) / 100;
  lines.push(`Poids first-party = min(${all.UNITS_SOLD} / ${L.unitsForMaxWeight}, 1) × ${L.maxFirstPartyWeight} = ${Math.round(weight * 100)} %`);
  return { score, weight, lines };
}

const DAY = 864e5;
function confidence(input: ScoreInput, weightCovered: number, now: number): { value: number; level: ConfidenceLevel; lines: string[] } {
  const C = SCORING.confidence;
  const dated = [
    ...input.market.map((s) => ({ src: s.source, at: s.observed_at, r: s.reliability })),
    ...input.morocco.map((s) => ({ src: s.source_name, at: s.observed_at, r: s.reliability })),
    ...input.offers.map((s) => ({ src: s.supplier_name, at: s.observed_at, r: s.cost_basis === "CONFIRMED_COST" ? "VERIFIED" : "MARKET" })),
  ].filter((d) => (now - Date.parse(d.at)) / DAY <= SCORING.signalMaxAgeDays);
  const sources = new Set(dated.filter((d) => d.r !== "EDITORIAL").map((d) => d.src)).size; // judgment is not a source
  const sPart = Math.min(sources / C.sourcesForFull, 1);
  const newest = new Map<string, number>();
  for (const d of dated) newest.set(d.src, Math.max(newest.get(d.src) ?? 0, Date.parse(d.at)));
  const fr = [...newest.values()].map((t) => C.freshness.find((f) => (now - t) / DAY <= f.maxDays)?.value ?? 0);
  const fPart = fr.length ? fr.reduce((a, b) => a + b, 0) / fr.length : 0;
  const rPart = dated.length ? dated.reduce((n, d) => n + (SCORING.reliability[d.r] ?? 0.35), 0) / dated.length : 0;
  let value = Math.round((sPart * C.weights.sources + fPart * C.weights.freshness + rPart * C.weights.reliability + weightCovered * C.weights.completeness) * 100);
  const measuredDemand = input.market.some((s) => s.reliability !== "EDITORIAL") || input.morocco.length > 0;
  const capped = !measuredDemand && value > C.capWhenEditorialOnly;
  if (capped) value = C.capWhenEditorialOnly;
  const level: ConfidenceLevel = value >= C.levels.high ? "HIGH" : value >= C.levels.medium ? "MEDIUM" : "LOW";
  return {
    value, level,
    lines: [
      `Sources mesurées distinctes : ${sources} / ${C.sourcesForFull} → ${Math.round(sPart * 100)} % (poids ${C.weights.sources * 100} %)`,
      `Fraîcheur moyenne : ${Math.round(fPart * 100)} % (poids ${C.weights.freshness * 100} %)`,
      `Fiabilité moyenne : ${Math.round(rPart * 100)} % (poids ${C.weights.reliability * 100} %) — éditorial ${SCORING.reliability.EDITORIAL}, marché ${SCORING.reliability.MARKET}, vérifié ${SCORING.reliability.VERIFIED}`,
      `Complétude (part du poids couverte) : ${Math.round(weightCovered * 100)} % (poids ${C.weights.completeness * 100} %)`,
      ...(capped ? [`Demande appuyée uniquement sur du jugement éditorial → plafonnée à ${C.capWhenEditorialOnly}`] : []),
      `Confiance = ${value}/100 → ${level}`,
    ],
  };
}

export function computeScore(input: ScoreInput): ScoreExplanation & { marginCalc: ReturnType<typeof margin> } {
  const now = input.now ?? Date.now();
  const offer = bestOffer(input.offers);
  const m = margin(input.candidate, offer);
  const parts: Record<ComponentKey, Part> = {
    globalDemand: globalDemand(input.market, now),
    moroccoDemand: moroccoDemand(input.market, input.morocco, now),
    trendVelocity: trendVelocity(input.market, now),
    marginScore: marginScore(m),
    supplierScore: supplierScore(offer),
  };
  const W = SCORING.weights;
  const keys = Object.keys(W) as ComponentKey[];
  const weightCovered = round1(keys.filter((k) => parts[k].value != null).reduce((n, k) => n + W[k], 0) * 100) / 100;
  const components: ComponentExplanation[] = keys.map((k) => ({
    key: k, label: LABELS[k], value: parts[k].value, weight: W[k],
    contribution: parts[k].value == null ? null : round1((parts[k].value! * W[k]) / (weightCovered || 1)),
    lines: parts[k].lines,
  }));
  const external = weightCovered >= SCORING.minWeightCovered
    ? round1(components.reduce((n, c) => n + (c.contribution ?? 0), 0))
    : null;
  const fp = input.candidate.catalogue_handle ? firstParty(input.events, now) : { score: null, weight: 0, lines: ["Pas encore en ligne : aucune donnée BEYOND."] };
  let final: number | null = external;
  if (external != null && fp.score != null && fp.weight > 0) final = round1((1 - fp.weight) * external + fp.weight * fp.score);
  if (final != null) {
    fp.lines.push(fp.score != null && fp.weight > 0
      ? `Final = ${Math.round((1 - fp.weight) * 100)} % × externe ${external} + ${Math.round(fp.weight * 100)} % × BEYOND ${fp.score} = ${final}`
      : `Final = externe ${external}`);
  }
  const conf = confidence(input, weightCovered, now);
  const finalRounded = final == null ? null : Math.round(final);
  return {
    components, weightCovered, external, firstParty: fp, final: finalRounded, confidence: conf,
    recommendation: recommend(finalRounded), computedAt: new Date(now).toISOString(), marginCalc: m,
  };
}
