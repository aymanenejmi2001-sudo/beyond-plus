// The existing merchandising manifest (catalog/manifest.ts) holds hand-set
// 0–5 ratings. Radar imports them as EDITORIAL signals — the lowest
// reliability — so they can start a ranking but keep confidence LOW until
// measured signals arrive.

import type { SourceAdapter } from "./types.ts";
export const editorialManifest: SourceAdapter = {
  id: "editorial-manifest", label: "Manifeste éditorial BEYOND", mode: "AUTOMATED", dimension: "global", reliability: "EDITORIAL",
  howTo: "Modifier catalog/manifest.ts puis `npm run radar:seed`. Note 0–5 × 20 = 0–100.",
  why: "Jugement éditorial, pas une mesure.",
};
