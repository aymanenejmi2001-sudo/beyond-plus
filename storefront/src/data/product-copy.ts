// Per-product copy, assembled from facts about that exact pair (colorway,
// available sizes, price) plus the model's fit advice and colour-specific
// styling. No materials or technologies are claimed: these are replicas.

import type { Product } from "@/lib/shopify/types";
import { brandPage, modelPageFor } from "./brands";
import { COMMERCE } from "./commerce";
import { MODEL_CONTENT } from "./model-content";

const STYLE_LINE: Record<string, string> = {
  "low-profile": "Une silhouette basse et fine, au ras du sol.",
  terrace: "L’esprit terrace : profil bas, semelle en gomme, ligne simple.",
  "retro-runner": "Une runner d’archive, remise au goût du jour pour la ville.",
  "y2k-runner": "Une runner à l’esprit années 2000 : volumes, superpositions, reflets.",
  "basketball-retro": "Une silhouette héritée du basket, devenue classique de la rue.",
  skate: "Une base skate, simple et solide.",
  technical: "Une silhouette technique, pensée pour être portée en ville.",
  racing: "Une ligne racing, fine et allongée.",
  icon: "Un classique qu’on ne présente plus.",
};

const COLOR_OUTFIT: Record<string, string> = {
  "Argent / Blanc": "Le blanc et l’argent éclairent une tenue sombre : jean brut, pantalon noir, ou total look gris.",
  "Noir / Argent": "Le noir et l’argent se portent en total look sombre, ou pour durcir une tenue claire.",
  "Noir / Blanc": "Le contraste noir et blanc va avec tout, du jean clair au pantalon de costume.",
  "Crème / Beige": "Les tons crème adoucissent une tenue : denim clair, lin, maille beige ou blanc cassé.",
  Gris: "Le gris se glisse partout : avec du denim, du noir ou des tons pastel.",
  "Marron / Terre": "Les tons terre vont avec le kaki, le crème, le denim brut et le cuir.",
  Bordeaux: "Le bordeaux donne la touche de couleur à une tenue grise, noire ou crème.",
  "Rouge / Blanc": "Rouge et blanc : une paire sportive, à laisser respirer avec une tenue simple.",
  "Rose / Argent": "Le rose et l’argent apportent de la lumière, avec du denim, du gris ou du blanc.",
  Statement: "Un coloris affirmé : gardez le reste de la tenue neutre pour le laisser parler.",
};

export const STYLE_COLLECTION: Record<string, { label: string; href: string }> = {
  "low-profile": { label: "Low Profile", href: "/collections/low-profile" },
  terrace: { label: "Low Profile", href: "/collections/low-profile" },
  "retro-runner": { label: "Retro Runners", href: "/collections/retro-runners" },
  "y2k-runner": { label: "Retro Runners", href: "/collections/retro-runners" },
  "basketball-retro": { label: "Basketball", href: "/collections/basketball" },
  skate: { label: "Skate", href: "/collections/skate" },
  technical: { label: "Tech Runners", href: "/collections/tech-runners" },
  racing: { label: "Tech Runners", href: "/collections/tech-runners" },
  icon: { label: "Icons", href: "/collections/icons" },
};

const STYLE_GUIDE: Record<string, { label: string; href: string }> = {
  "low-profile": { label: "Porter les low profile", href: "/guides/sneakers-low-profile-comment-les-porter" },
  terrace: { label: "Porter les low profile", href: "/guides/sneakers-low-profile-comment-les-porter" },
  "retro-runner": { label: "Porter les retro runners", href: "/guides/retro-runners-comment-les-porter" },
  "y2k-runner": { label: "Porter les retro runners", href: "/guides/retro-runners-comment-les-porter" },
};

export function productCopy(p: Product) {
  const m = p.merch;
  const model = modelPageFor(p);
  const brand = brandPage(m?.brand ?? p.vendor);
  const content = model ? MODEL_CONTENT[model.handle] : undefined;
  const sizes = p.variants.filter((v) => v.availableForSale).map((v) => v.title);
  const price = Math.round(Number(p.priceRange.minVariantPrice.amount));
  const colorway = m?.colorway && m.colorway !== "Original" ? m.colorway : null;

  const paragraphs = [
    [
      `${p.title}${colorway ? `, coloris ${colorway}` : ""}.`,
      m ? STYLE_LINE[m.style] ?? "" : "",
      m ? COLOR_OUTFIT[m.color] ?? "" : "",
    ].filter(Boolean).join(" "),
    content ? content.wear : "",
  ].filter(Boolean);

  const fit = COMMERCE.fit;

  const links = [
    brand && { label: `Tout ${brand.name}`, href: `/collections/${brand.handle}` },
    model && { label: model.name, href: `/collections/${model.handle}` },
    m && STYLE_COLLECTION[m.style],
    (m && STYLE_GUIDE[m.style]) ?? { label: "Guide des pointures", href: "/guides/quelle-pointure-choisir-sneakers" },
  ].filter(Boolean) as { label: string; href: string }[];

  return { paragraphs, fit, sizes, price, links };
}
