import type { SourceAdapter } from "./types.ts";
export const tiktokSignals: SourceAdapter = {
  id: "tiktok", label: "TikTok / Instagram", mode: "MANUAL", dimension: "global", reliability: "MARKET",
  howTo: "Nombre de vues du hashtag modèle (ex. #gel1130) à deux dates. Signal « velocity » : 50 = stable, +1 pt par % de croissance mensuelle (plafond 100). Indiquer l'URL et la date.",
  why: "Research API réservée aux chercheurs agréés ; pas d'extraction de l'application.",
};
