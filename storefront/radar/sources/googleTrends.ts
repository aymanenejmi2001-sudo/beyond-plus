import type { SourceAdapter } from "./types.ts";
export const googleTrends: SourceAdapter = {
  id: "google-trends", label: "Google Trends", mode: "MANUAL", dimension: "global", reliability: "MARKET",
  howTo: "trends.google.com → terme « <marque> <modèle> », 12 derniers mois. Monde → signal « global », indice 0–100 tel quel. Pays = Maroc → signal « morocco ». Relever chaque semaine : la vélocité se calcule seule à partir de deux relevés espacés d'au moins 7 jours.",
  why: "Pas d'API officielle publique ; les bibliothèques non officielles contournent les limites de débit.",
};
