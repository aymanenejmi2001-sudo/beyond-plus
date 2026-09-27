// Homepage merchandising: change what the homepage features here, not in the
// components. Handles must exist in the catalogue; unknown ones are skipped.
// Today only heroSlides is rendered; trending / newIn / beyondPick feed
// data/home-rails.ts, kept for future discreet selections.
export const HOME_MERCHANDISING = {
  /** Hero slider, in order. The first slide carries the page H1 (SEO): keep its text. */
  heroSlides: [
    { photo: "womenHero", focus: "68% 40%", bg: "linear-gradient(180deg, rgb(198 227 235), rgb(141 164 167))", tone: "light", eyebrow: "Sneakers au Maroc.", title: ["Go", "beyond."], text: "Des sneakers high copy pour composer vos looks et respecter votre budget.", href: "/collections/femme", cta: "Voir Femme" },
    { photo: "menChrome", focus: "50% 70%", bg: "rgb(22 30 30)", tone: "dark", eyebrow: "Beyond Men", title: ["Hors des", "lignes."], text: "Chrome, nuit, béton.", href: "/collections/homme", cta: "Voir Homme" },
    { photo: "womenAir", focus: "40% 60%", bg: "rgb(13 13 13)", tone: "dark", eyebrow: "Nouveautés", title: ["La", "sélection."], text: "De la Samba à la Kayano 14, découvrez notre sélection.", href: "/collections/nouveautes", cta: "Tout voir" },
  ] as const,
  /** Drop or edit to promote (slug from data/drops-config.ts). Not rendered on the
   *  homepage for now: the Phase 1 structure is kept. */
  featuredDrop: null as string | null,
  /** Editorial selection (not best-sellers): 2026 directions, existing pairs only. */
  trending: [
    "asics-gel-nyc-cream-oyster-grey",
    "nike-p-6000-white-silver",
    "adidas-samba-cow-print",
    "new-balance-mr530sg-white-blue",
    "asics-gel-kayano-14-arctic-sky-pure-silver",
    "adidas-gazelle-indoor-bold-cream-collegiate-green",
    "nike-vomero-5-photon-dust-pink-foam",
    "adidas-gazelle-indoor-grey-three-cloud-white-gold-metallic",
  ],
  /** Rails driven by the catalogue's own merch.label. */
  newIn: { label: "NEW IN", max: 8 },
  beyondPick: { label: "BEYOND PICK", max: 4 },
};
