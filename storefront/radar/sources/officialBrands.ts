import type { SourceAdapter } from "./types.ts";
export const officialBrands: SourceAdapter = {
  id: "official-brands", label: "Sites officiels des marques", mode: "MANUAL", dimension: "identity", reliability: "VERIFIED",
  howTo: "Renseigner sur la fiche candidat : SKU, coloris officiel, prix officiel + devise, URL produit officielle, genre, catégorie.",
  why: "Les sites Nike / adidas / ASICS… sont protégés (anti-bot) et n'offrent pas d'API publique produit. catalog/sources/official.ts ne sert qu'aux métadonnées ponctuelles.",
};
