import type { SourceAdapter } from "./types.ts";
export const moroccoMarket: SourceAdapter = {
  id: "morocco-market", label: "Marché marocain (revendeurs)", mode: "MANUAL", dimension: "morocco", reliability: "MARKET",
  howTo: "Formulaire « Signal Maroc » : revendeurs visibles, coloris visibles, prix min / moyen / max, part en promotion, disponibilité, pointures visibles, URL source. Ce sont des signaux de marché, pas des ventes. Ne copier ni textes ni images des concurrents.",
  why: "V1 manuelle. Les boutiques marocaines sous Shopify exposent un /products.json public : une collecte polie (robots.txt, 1 req/s, cache) est possible plus tard — voir docs/beyond-radar-next.md.",
};
