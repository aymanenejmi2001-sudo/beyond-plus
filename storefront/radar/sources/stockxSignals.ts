import type { SourceAdapter } from "./types.ts";
export const stockxSignals: SourceAdapter = {
  id: "stockx", label: "StockX / revente", mode: "MANUAL", dimension: "global", reliability: "MARKET",
  howTo: "Relever la prime de revente (prix moyen / prix officiel). Normaliser : ≤ 0,8 → 20 · 1,0 → 50 · ≥ 1,5 → 90 (interpoler). Coller l'URL de la fiche.",
  why: "API réservée aux partenaires ; les conditions d'utilisation interdisent l'extraction automatisée et le site est protégé par un anti-bot.",
};
