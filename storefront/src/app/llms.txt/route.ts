// /llms.txt — plain-text map of the site for AI assistants (llmstxt.org).
// Built from the live catalogue, so it never goes stale.
import { BRANDS, MODELS } from "@/data/brands";
import { CATALOG } from "@/data/catalog";
import { CURATED } from "@/data/collections";
import { GUIDES } from "@/data/guides";

export const dynamic = "force-static";

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://beyondplusmaroc.com";

export function GET() {
  const prices = CATALOG.map((p) => Number(p.priceRange.minVariantPrice.amount));
  const lines = [
    "# BEYOND PLUS",
    "",
    `> Concept store de sneakers (espadrilles) au Maroc. ${CATALOG.length} paires femme et homme, de ${Math.min(...prices)} à ${Math.max(...prices)} DH : low profile, retro runners, basket, tech runners. Répliques qualité Master Copy Premium 1:1, annoncées comme telles, sans affiliation avec les marques citées. Commande en ligne confirmée par téléphone, livraison partout au Maroc, pas de paiement en ligne.`,
    "",
    "Informations clés :",
    "- Pays : Maroc (Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir et autres villes)",
    "- Monnaie : dirham marocain (DH / MAD)",
    "- Pointures : du 35 au 47 selon les modèles",
    "- Commande : directement sur le site, puis appel de confirmation avant l’envoi. Questions : WhatsApp +212 669 866 831",
    "- Nature des produits : répliques, jamais présentées comme authentiques",
    "",
    "## Catalogue",
    `- [Toutes les sneakers](${site}/collections/nouveautes)`,
    `- [Sneakers femme](${site}/collections/femme): pointures 35 à 40`,
    `- [Sneakers homme](${site}/collections/homme): pointures 40 à 47`,
    ...CURATED.map((c) => `- [${c.title}](${site}/collections/${c.handle})`),
    "",
    "## Marques",
    ...BRANDS.map((b) => `- [${b.name}](${site}/collections/${b.handle}): ${b.products.length} paires`),
    "",
    "## Modèles",
    ...MODELS.map((m) => {
      const brand = BRANDS.find((b) => b.match === m.brand)!;
      const name = m.name.toLowerCase().includes(brand.name.toLowerCase()) ? m.name : `${brand.name} ${m.name}`;
      return `- [${name}](${site}/collections/${m.handle}): ${m.products.length} coloris`;
    }),
    "",
    "## Guides",
    ...GUIDES.map((g) => `- [${g.title}](${site}/guides/${g.slug}): ${g.description}`),
    "",
    "## À propos",
    `- [Qualité et transparence](${site}/qualite-transparence): ce que vend BEYOND PLUS, sans détour`,
    `- [Contact](${site}/contact)`,
    `- [Toutes les marques](${site}/marques)`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
