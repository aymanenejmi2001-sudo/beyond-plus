// Static list of what search can suggest while typing: models, brands, selections.
import { BRANDS, MODELS } from "@/data/brands";
import { CURATED } from "@/data/collections";

export const dynamic = "force-static";

export function GET() {
  const entries = [
    ...MODELS.map((m) => {
      const brand = BRANDS.find((b) => b.match === m.brand)?.name ?? m.brand;
      const label = m.name.toLowerCase().includes(brand.toLowerCase()) ? m.name : `${brand} ${m.name}`;
      return { l: label, h: `/collections/${m.handle}`, k: "Modèle", n: m.products.length };
    }),
    ...BRANDS.map((b) => ({ l: b.name, h: `/collections/${b.handle}`, k: "Marque", n: b.products.length })),
    ...CURATED.map((c) => ({ l: c.title, h: `/collections/${c.handle}`, k: "Sélection", n: 0 })),
    { l: "Sneakers femme", h: "/collections/femme", k: "Sélection", n: 0 },
    { l: "Sneakers homme", h: "/collections/homme", k: "Sélection", n: 0 },
    { l: "Moins de 600 DH", h: "/collections/sneakers-moins-de-600-dh", k: "Budget", n: 0 },
    { l: "Moins de 700 DH", h: "/collections/sneakers-moins-de-700-dh", k: "Budget", n: 0 },
  ];
  return Response.json(entries);
}
