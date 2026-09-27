// Internal merchandising score, 0–100. Never displayed. Edit the weights here.
import type { Family } from "./manifest.ts";
import type { Signal } from "./types.ts";

export const WEIGHTS = {
  globalDemand: 0.22,       // EDITORIAL_JUDGMENT (no measured data)
  moroccanMarket: 0.18,     // EDITORIAL_JUDGMENT
  supplierBestSeller: 0.15, // VERIFIED_DATA — in the supplier's best-seller collection on capture day
  freshness: 0.12,          // VERIFIED_DATA — supplier publication date (not the model's release date)
  versatility: 0.11,
  socialPotential: 0.11,
  marginPotential: 0.11,
};

export function score(signals: Family["signals"], bestSeller: boolean, publishedAt: string | null, now = Date.now()) {
  const days = publishedAt ? (now - Date.parse(publishedAt)) / 864e5 : Infinity;
  const ed = (value: number, note: string): Signal => ({ value, source: "EDITORIAL_JUDGMENT", note });
  const breakdown: Record<string, Signal> = {
    globalDemand: ed(signals.globalDemand, "Lecture éditoriale de la demande 2025–26, non mesurée."),
    moroccanMarket: ed(signals.moroccanMarket, "Estimation éditoriale — aucune donnée de vente BEYOND PLUS."),
    supplierBestSeller: { value: bestSeller ? 5 : 0, source: "VERIFIED_DATA", note: "Présent dans la collection best-sellers du fournisseur au relevé." },
    freshness: { value: days <= 60 ? 5 : days <= 180 ? 3 : days <= 365 ? 2 : 1, source: "VERIFIED_DATA", note: `Mise en ligne fournisseur : ${publishedAt?.slice(0, 10) ?? "inconnue"}.` },
    versatility: ed(signals.versatility, "Facilité à porter."),
    socialPotential: ed(signals.socialPotential, "Potentiel visuel / réseaux."),
    marginPotential: ed(signals.marginPotential, "Estimation — prix de revente non fixés."),
  };
  const total = Object.entries(WEIGHTS).reduce((n, [k, w]) => n + (breakdown[k].value / 5) * w, 0);
  return { trendScore: Math.round(total * 100), breakdown };
}
