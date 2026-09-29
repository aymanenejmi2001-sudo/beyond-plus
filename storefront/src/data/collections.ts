import type { Collection, Product } from "@/lib/shopify/types";
import { CATALOG } from "./catalog";
import { BRANDS, MODELS, describeModel } from "./brands";
import { MODEL_CONTENT, fallbackContent, type ModelContent } from "./model-content";

export const STYLE_LABEL: Record<string, string> = {
  "low-profile": "Low Profile", "retro-runner": "Retro Runner", "y2k-runner": "Y2K Runner", skate: "Skate",
  "basketball-retro": "Basketball", terrace: "Terrace", racing: "Racing", technical: "Technical", icon: "Icon",
};

const byRank = (a: Product, b: Product) => (b.merch?.rank ?? 0) - (a.merch?.rank ?? 0);
const inCollection = (handle: string) => (p: Product) => p.merch?.collections.includes(handle) ?? false;

export interface CollectionSeo { title: string; description: string; heading: string; body: string[]; links: { label: string; href: string }[]; h1?: string; eyebrow?: string }

const SIZE_GUIDE = { label: "Guide des pointures", href: "/guides/quelle-pointure-choisir-sneakers" };
const CARE_GUIDE = { label: "Entretenir ses sneakers", href: "/guides/entretenir-ses-sneakers" };
const LOW_GUIDE = { label: "Porter les low profile", href: "/guides/sneakers-low-profile-comment-les-porter" };

const DEFS: { handle: string; title: string; description: string; filter: (p: Product) => boolean; curated?: boolean; seo: CollectionSeo }[] = [
  { handle: "nouveautes", title: "Sneakers", description: "Toute la sélection BEYOND PLUS.", filter: () => true, seo: {
    h1: "Sneakers et espadrilles au Maroc", eyebrow: "Sneakers",
    title: "Toutes les sneakers au Maroc : la sélection",
    description: "Sneakers et baskets au Maroc : 100 paires du 35 au 47, low profile, retro runners, basket. Livraison gratuite en 12 à 48 h, confirmation par téléphone.",
    heading: "Une sélection courte, pensée pour le Maroc",
    body: [
      "BEYOND PLUS ne vend pas toutes les sneakers : on garde les silhouettes qui comptent cette saison et deux à quatre coloris par modèle, choisis pour être portés tous les jours.",
      "Vous commandez en ligne en une minute, puis on vous appelle pour confirmer la pointure et la livraison avant l’envoi, partout au Maroc. Pas de paiement en ligne.",
    ],
    links: [SIZE_GUIDE, { label: "Trending Now", href: "/collections/trending-now" }] } },
  { handle: "femme", title: "Beyond Women", description: "Du 36 au 40. Une allure bien à soi.", filter: (p) => p.merch?.gender !== "men", seo: {
    h1: "Sneakers femme au Maroc", eyebrow: "Beyond Women",
    title: "Sneakers femme Maroc : prix dès 500 DH, livraison gratuite",
    description: "Sneakers femme au Maroc dès 500 DH : Samba, Gel-NYC, Vomero 5 en argent, crème et tons neutres, confortables au quotidien. Livraison gratuite en 12 à 48 h.",
    heading: "Des sneakers femme qui vont avec tout",
    body: [
      "Les coloris doux (crème, argent, rose poudré) et les silhouettes fines dominent la sélection femme : faciles avec un jean droit, une jupe longue ou un tailleur.",
      "Entre deux pointures ? Mesurez votre pied en centimètres (le guide des pointures explique comment en deux minutes) et envoyez la mesure sur WhatsApp : on confirme avant l’envoi.",
    ],
    links: [{ label: "Sneakers femme tendance au Maroc", href: "/guides/sneakers-femme-tendance-maroc" }, SIZE_GUIDE, LOW_GUIDE] } },
  { handle: "homme", title: "Beyond Men", description: "Du 40 au 45. Chrome, nuit, béton.", filter: (p) => p.merch?.gender !== "women", seo: {
    h1: "Sneakers homme au Maroc", eyebrow: "Beyond Men",
    title: "Sneakers homme Maroc : prix dès 400 DH, du 40 au 45",
    description: "Sneakers homme au Maroc, prix dès 400 DH, du 40 au 45 : Kayano 14, 9060, Jordan 4, Dunk Low. Livraison gratuite 12 à 48 h, confirmation par téléphone.",
    heading: "Des sneakers homme, du quotidien au statement",
    body: [
      "Noir et argent, gris, tons terre : la sélection homme mise sur des coloris qui se portent tous les jours, avec quelques paires plus affirmées pour sortir du rang.",
      "Pour la pointure, mesurez la longueur de votre pied en centimètres : on confirme toujours la pointure par téléphone avant l’envoi.",
    ],
    links: [{ label: "Sneakers homme tendance au Maroc", href: "/guides/sneakers-homme-tendance-maroc" }, SIZE_GUIDE, CARE_GUIDE] } },
  { handle: "trending-now", title: "Trending Now", description: "Les paires qui font la saison, sélectionnées par BEYOND PLUS.", filter: inCollection("trending-now"), curated: true, seo: {
    title: "Sneakers tendance du moment, Trending Now",
    description: "Les sneakers tendance du moment au Maroc : terrace, retro runners, Y2K. Sélection courte, livraison gratuite en 12 à 48 h.",
    heading: "Ce qui se porte maintenant",
    body: [
      "Trending Now réunit les modèles les plus demandés du moment chez notre fournisseur et ceux que nous voyons monter : silhouettes terrace, runners d’archive, reflets argentés.",
      "La sélection bouge régulièrement : revenez voir, ou écrivez-nous pour une paire précise.",
    ],
    links: [SIZE_GUIDE, { label: "Nous écrire", href: "/contact" }] } },
  { handle: "low-profile", title: "Low Profile", description: "Silhouettes basses et fines : Samba, Spezial, Gazelle.", filter: inCollection("low-profile"), curated: true, seo: {
    h1: "Sneakers Low Profile au Maroc", eyebrow: "Low Profile",
    title: "Sneakers low profile Maroc : Samba, Spezial, Gazelle",
    description: "Sneakers low profile au Maroc : Samba, Handball Spezial, Gazelle, silhouettes basses et fines. Livraison gratuite en 12 à 48 h.",
    heading: "Au ras du sol",
    body: [
      "Semelle fine, ligne allongée, peu de volume : la low profile est la silhouette de la saison. Elle vient des terrains en salle et des tribunes, et se porte aujourd’hui avec un pantalon large ou une jupe longue.",
      "Elles chaussent près du pied : envoyez-nous la longueur de votre pied en centimètres, on confirme la pointure avant l’envoi.",
    ],
    links: [LOW_GUIDE, SIZE_GUIDE] } },
  { handle: "retro-runners", title: "Retro Runners", description: "L’archive running remise en ville : Kayano, Gel-NYC, 9060, Vomero.", filter: inCollection("retro-runners"), curated: true, seo: {
    h1: "Retro runners au Maroc", eyebrow: "Retro Runners",
    title: "Retro runners Maroc : Kayano 14, Gel-NYC, 9060, Vomero 5",
    description: "Retro runners au Maroc : Kayano 14, Gel-NYC, 9060, 530, Vomero 5, P-6000. Baskets running rétro, livraison gratuite en 12 à 48 h.",
    heading: "Le running d’archive, en ville",
    body: [
      "Mesh, overlays métallisés, semelles marquées : les runners des années 2000 sont devenues la base du vestiaire. Elles apportent du volume à une tenue simple.",
      "Le rembourrage prend de la place dans la chaussure : envoyez-nous la longueur de votre pied en centimètres, on confirme la pointure avant l’envoi.",
    ],
    links: [SIZE_GUIDE, CARE_GUIDE] } },
  { handle: "skate", title: "Skate", description: "Les bases skate, intemporelles.", filter: inCollection("skate"), curated: true, seo: {
    title: "Sneakers skate au Maroc, Old Skool, Knu Skool",
    description: "Sneakers skate au Maroc : Vans Old Skool, Knu Skool, Campus 00s, Chuck Taylor. Livraison gratuite en 12 à 48 h, confirmation par téléphone.",
    heading: "Les bases skate",
    body: ["Toile, daim, semelle gaufrée : des modèles simples, solides, qui vont avec tout, du denim brut au pantalon de costume."],
    links: [CARE_GUIDE, SIZE_GUIDE] } },
  { handle: "icons", title: "Icons", description: "Les classiques qui ont fait la culture sneaker.", filter: inCollection("icons"), curated: true, seo: {
    title: "Sneakers icônes, les classiques de la culture sneaker",
    description: "Les sneakers icônes au Maroc : Air Force 1, Superstar, Stan Smith, Jordan. Les classiques, livraison gratuite en 12 à 48 h.",
    heading: "Les classiques",
    body: ["Des silhouettes qui ont fait la culture sneaker et qu’on ne présente plus. Les valeurs sûres du placard."],
    links: [{ label: "Nike Air Force 1", href: "/collections/nike-air-force-1" }, CARE_GUIDE, SIZE_GUIDE] } },
  { handle: "basketball", title: "Basketball", description: "Dunk, Jordan 1, Jordan 4, 550 : l’héritage du parquet.", filter: inCollection("basketball"), curated: true, seo: {
    h1: "Sneakers basket au Maroc", eyebrow: "Basketball",
    title: "Sneakers basket Maroc : Dunk Low, Jordan 1, Jordan 4, 550",
    description: "Baskets basket au Maroc : Dunk Low, Air Jordan 1 et 4, New Balance 550, Forum Low. Livraison gratuite en 12 à 48 h.",
    heading: "L’héritage du parquet",
    body: [
      "Nées sur les terrains dans les années 80, les silhouettes basket sont devenues les classiques de la rue : tige en cuir, semelle plate, blocs de couleurs francs.",
      "Précisez-nous la longueur de votre pied et le type de chaussettes que vous portez : on confirme la pointure avant l’envoi.",
    ],
    links: [SIZE_GUIDE, CARE_GUIDE] } },
  { handle: "tech-runners", title: "Tech Runners", description: "Air Max Dn, Adizero, On, Gel-Quantum : la technique portée en ville.", filter: inCollection("tech-runners"), curated: true, seo: {
    h1: "Sneakers techniques au Maroc", eyebrow: "Tech Runners",
    title: "Sneakers techniques Maroc : Air Max Dn, On, Adizero",
    description: "Sneakers techniques au Maroc : Air Max Dn, On, Adizero, Gel-Quantum, Air Humara. Livraison gratuite en 12 à 48 h, confirmation par téléphone.",
    heading: "La technique, portée en ville",
    body: [
      "Semelles sculptées, mousses récentes, lignes de course : ces modèles viennent du running et du trail, et se portent aujourd’hui avec un cargo, un nylon ou un total look sombre.",
    ],
    links: [{ label: "Retro runners : comment les porter", href: "/guides/retro-runners-comment-les-porter" }, SIZE_GUIDE] } },  { handle: "sneakers-moins-de-600-dh", title: "Moins de 600 DH", description: "Les paires de la sélection à moins de 600 DH.", filter: (p) => Number(p.priceRange.minVariantPrice.amount) < 600, seo: {
    h1: "Sneakers à moins de 600 DH au Maroc", eyebrow: "Petits prix",
    title: "Sneakers pas cher Maroc : moins de 600 DH, livraison gratuite",
    description: "Sneakers à moins de 600 DH au Maroc : la sélection BEYOND PLUS aux petits prix. Livraison gratuite partout au Maroc en 12 à 48 h.",
    heading: "Petit budget, même exigence",
    body: [
      "Ces paires passent sous la barre des 600 DH sans changer de qualité : même finition High copy, même contrôle avant l’envoi que le reste de la sélection.",
      "Livraison gratuite partout au Maroc, pointure confirmée par téléphone et échange de pointure sous 3 jours.",
    ],
    links: [SIZE_GUIDE, { label: "Paires à moins de 700 DH", href: "/collections/sneakers-moins-de-700-dh" }] } },
  { handle: "sneakers-moins-de-700-dh", title: "Moins de 700 DH", description: "Les paires de la sélection à moins de 700 DH.", filter: (p) => Number(p.priceRange.minVariantPrice.amount) < 700, seo: {
    h1: "Sneakers à moins de 700 DH au Maroc", eyebrow: "Budget",
    title: "Sneakers moins de 700 DH Maroc : Samba, Dunk, 530",
    description: "Sneakers à moins de 700 DH au Maroc : Samba, Dunk Low, New Balance 530 et plus. Livraison gratuite en 12 à 48 h, confirmation par téléphone.",
    heading: "Le bon rapport qualité prix",
    body: [
      "Toutes les paires de la sélection à moins de 700 DH, triées par popularité. Une idée cadeau simple : donnez-nous la pointure en centimètres, on confirme avant l’envoi.",
      "Livraison gratuite partout au Maroc en 12 à 48 h après confirmation, échange de pointure sous 3 jours.",
    ],
    links: [SIZE_GUIDE, { label: "Paires à moins de 600 DH", href: "/collections/sneakers-moins-de-600-dh" }] } },
];

export const COLLECTION_SEO = new Map<string, CollectionSeo>(DEFS.map((d) => [d.handle, d.seo]));

export const COLLECTIONS: Collection[] = DEFS.map((d, i) => ({
  id: `beyond-collection-${i}`, handle: d.handle, title: d.title, description: d.description, image: null,
  products: CATALOG.filter(d.filter).sort(byRank),
}));
const CURATED_ORDER = ["trending-now", "basketball", "retro-runners", "low-profile", "tech-runners", "skate", "icons"];
export const CURATED = DEFS.filter((d) => d.curated)
  .sort((a, b) => CURATED_ORDER.indexOf(a.handle) - CURATED_ORDER.indexOf(b.handle))
  .map((d) => ({ handle: d.handle, title: d.title }));
/* ---- Brand and model pages (Sneakers → Marque → Modèle) ---------------- */

type Crumb = { title: string; href: string };
/** Ancestors shown in the breadcrumb of each collection, below "Accueil". */
export const COLLECTION_TRAIL = new Map<string, Crumb[]>();
/** Model landing data: copy + the sizes actually available. */
export type Colorway = { name: string; href: string; price: number; sizes: string };
export const MODEL_LANDING = new Map<string, { name: string; content: ModelContent; sizes: number[]; count: number; colorways: Colorway[] }>();
const SNEAKERS: Crumb = { title: "Sneakers", href: "/collections/nouveautes" };
const DH = (n: number) => `${n} DH`;
/** One row of the "Coloris disponibles" table: the colourway without the model name. */
function colorway(p: Product, model: string): Colorway {
  const short = model.replace(/^(adidas|nike|asics|new balance|jordan|air jordan)\s+/i, "");
  const name = p.title.replace(/[‘’']/g, "").replace(new RegExp(`^.*?${short.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*`, "i"), "").trim() || p.title;
  const s = p.variants.filter((v) => v.availableForSale).map((v) => Number(v.title)).filter((n) => !Number.isNaN(n)).sort((a, b) => a - b);
  return { name, href: `/products/${p.handle}`, price: Math.round(Number(p.priceRange.minVariantPrice.amount)), sizes: s.length ? `${s[0]} à ${s[s.length - 1]}` : "sur demande" };
}

for (const b of BRANDS) {
  const models = MODELS.filter((m) => m.brand === b.match);
  COLLECTIONS.push({ id: `brand-${b.handle}`, handle: b.handle, title: b.name, description: b.intro, image: null, products: b.products });
  COLLECTION_TRAIL.set(b.handle, [SNEAKERS]);
  COLLECTION_SEO.set(b.handle, {
    h1: `${b.name} au Maroc`, eyebrow: b.name,
    title: `${b.name} Maroc : ${models.slice(0, 2).map((m) => m.name).join(", ") || "sneakers"}, prix dès ${Math.min(...b.products.map((p) => Number(p.priceRange.minVariantPrice.amount)))} DH`,
    description: `${b.name} au Maroc : ${b.products.length} paires${models.length ? ` dont ${models.map((m) => m.name).slice(0, 3).join(", ")}` : ""}. Livraison gratuite en 12 à 48 h, confirmation par téléphone.`,
    heading: `${b.name} chez BEYOND PLUS`,
    body: [b.intro, "Répliques qualité Master Copy Premium 1:1. Chaque commande est confirmée avec vous par téléphone : pointure, délai et livraison partout au Maroc."],
    links: models.map((m) => ({ label: m.name, href: `/collections/${m.handle}` })),
  });
}

for (const m of MODELS) {
  const brand = BRANDS.find((b) => b.match === m.brand)!;
  const d = describeModel(m);
  const sizes = d.minSize ? `du ${d.minSize} au ${d.maxSize}` : "";
  const price = d.minPrice === d.maxPrice ? DH(d.minPrice) : `de ${DH(d.minPrice)} à ${DH(d.maxPrice)}`;
  const title = m.name.toLowerCase().includes(brand.name.toLowerCase()) ? m.name : `${brand.name} ${m.name}`;
  COLLECTIONS.push({ id: `model-${m.handle}`, handle: m.handle, title, description: `${d.count} coloris · ${price}`, image: null, products: m.products });
  COLLECTION_TRAIL.set(m.handle, [SNEAKERS, { title: brand.name, href: `/collections/${brand.handle}` }]);
  const sizeSet = [...new Set(m.products.flatMap((p) => p.variants.filter((v) => v.availableForSale).map((v) => Number(v.title))))].filter((n) => !Number.isNaN(n)).sort((a, b) => a - b);
  MODEL_LANDING.set(m.handle, { name: title, content: MODEL_CONTENT[m.handle] ?? fallbackContent(title, brand.handle, brand.name), sizes: sizeSet, count: d.count, colorways: m.products.map((p) => colorway(p, title)) });
  COLLECTION_SEO.set(m.handle, {
    h1: `${title} au Maroc`, eyebrow: brand.name,
    title: `${title} Maroc : prix dès ${d.minPrice} DH, ${d.count} coloris`,
    description: `${title} au Maroc : ${d.count} coloris, ${price}${sizes ? `, ${sizes}` : ""}. Livraison gratuite en 12 à 48 h, confirmation par téléphone.`,
    heading: `${title} : ce qu’il faut savoir`,
    body: [
      `${d.count} coloris de la ${title} dans la sélection BEYOND PLUS, ${price}. Pointures disponibles ${sizes}, confirmées avec vous avant l’envoi.`,
      `Coloris : ${d.colors.join(", ").toLowerCase()}. Répliques qualité Master Copy Premium 1:1, livraison partout au Maroc.`,
    ],
    links: [{ label: `Tout ${brand.name}`, href: `/collections/${brand.handle}` }, { label: "Guide des pointures", href: "/guides/quelle-pointure-choisir-sneakers" }],
  });
}

export const COLLECTION_BY_HANDLE = new Map(COLLECTIONS.map((c) => [c.handle, c]));
export const HOME_PRODUCTS = CATALOG.filter((p) => p.merch?.homeRank != null).sort((a, b) => a.merch!.homeRank! - b.merch!.homeRank!);
