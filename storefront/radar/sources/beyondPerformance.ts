import type { SourceAdapter } from "./types.ts";
export const beyondPerformance: SourceAdapter = {
  id: "beyond-performance", label: "Données BEYOND PLUS", mode: "PARTIAL", dimension: "first-party", reliability: "VERIFIED",
  howTo: "Chaque commande confirmée sur WhatsApp : « Enregistrer une commande » (fiche candidat) — produit, pointure, quantité, prix. Les vues / paniers arriveront avec un suivi d'événements (non installé).",
  why: "Aucune analytics ni paiement en ligne sur le site : les commandes passent par WhatsApp.",
};
