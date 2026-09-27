import { COMMERCE } from "./commerce";
// Hand-written copy for model landing pages. Each entry is specific to the
// silhouette: what it is, how it fits, how to wear it. Nothing is copied from
// a source, and no technology or material of the authentic shoe is claimed —
// these are replicas. Sizing advice describes the silhouette's usual shape and
// always ends on the WhatsApp confirmation.

export interface ModelContent {
  intro: string[];
  fit: string;
  wear: string;
  related: { label: string; href: string }[];
  faq: { q: string; a: string }[];
}

const SIZE = { label: "Guide des pointures", href: "/guides/quelle-pointure-choisir-sneakers" };
const RETRO = { label: "Retro Runners", href: "/collections/retro-runners" };
const LOW = { label: "Low Profile", href: "/collections/low-profile" };
const BASKET = { label: "Basketball", href: "/collections/basketball" };

export const MODEL_CONTENT: Record<string, ModelContent> = {
  "asics-gel-kayano-14": {
    intro: [
      "La Gel-Kayano 14 est la runner d’archive qui a lancé le retour du running des années 2000 dans la rue. Une tige chargée de couches et de reflets métallisés, une semelle marquée, un profil assez bas pour une runner : elle apporte du volume à une tenue sans l’alourdir.",
      "Chez BEYOND PLUS, on garde les coloris qui se portent vraiment : l’argent et le bleu glacier, le noir total, les crèmes rehaussées de rose ou de prune. Des teintes qui vont avec un jean clair comme avec un total look sombre.",
    ],
    fit: COMMERCE.fit,
    wear: "Avec un baggy brut ou un pantalon de survêtement, c’est la version la plus naturelle. En contraste, elle tient très bien avec un tailleur trop grand ou une jupe midi : la technicité de la chaussure casse le côté habillé.",
    related: [{ label: "Tout ASICS", href: "/collections/asics" }, { label: "ASICS Gel-NYC", href: "/collections/asics-gel-nyc" }, RETRO, SIZE],
    faq: [
      { q: "La Kayano 14 taille-t-elle petit ?", a: COMMERCE.fit },
      { q: "Kayano 14 ou Gel-NYC ?", a: "La Kayano 14 est plus technique et plus chargée visuellement ; la Gel-NYC est plus douce et plus facile à porter au quotidien." },
      { q: "Livrez-vous partout au Maroc ?", a: COMMERCE.shipping },
    ],
  },
  "asics-gel-nyc": {
    intro: [
      "La Gel-NYC mélange plusieurs lignes de l’archive running ASICS dans une silhouette plus douce que la Kayano. Des superpositions nettes, des tons calmes, une semelle confortable : c’est la runner facile, celle qu’on porte tous les jours sans y penser.",
      "Notre sélection reste sur des coloris polyvalents : crème et gris huître, blanc et gris acier, noir graphite, bleu ciel. Aucun ne demande de construire la tenue autour.",
    ],
    fit: COMMERCE.fit,
    wear: "Jean droit, chino, short en été : la Gel-NYC s’adapte. Les coloris crème adoucissent une tenue sombre, le noir graphite fonctionne en total look.",
    related: [{ label: "Tout ASICS", href: "/collections/asics" }, { label: "ASICS Gel-Kayano 14", href: "/collections/asics-gel-kayano-14" }, RETRO, SIZE],
    faq: [
      { q: "La Gel-NYC est-elle confortable pour marcher toute la journée ?", a: "C’est une silhouette pensée pour le quotidien, avec une semelle épaisse et souple. Pour un usage sportif intensif, préférez une vraie chaussure de running." },
      { q: "Quelle pointure prendre ?", a: COMMERCE.fit },
      { q: "Comment commander ?", a: "Ajoutez la paire au panier, puis confirmez la commande sur le site : on vous appelle pour confirmer pointure et livraison." },
    ],
  },
  "new-balance-9060": {
    intro: [
      "La 9060 pousse l’esthétique running des années 2000 vers quelque chose de plus sculpté : une semelle volumineuse, des lignes qui ondulent, un talon affirmé. C’est la New Balance qui se voit, celle qui donne du caractère à une tenue simple.",
      "On a choisi des coloris qui gardent la silhouette lisible : blanc et taro, noir castlerock, gris, rose cristal pour une version plus douce.",
    ],
    fit: COMMERCE.fit,
    wear: "Son volume appelle un bas large : jogging, cargo, jean baggy. Avec une jupe longue ou une robe droite, le contraste fonctionne aussi très bien.",
    related: [{ label: "Tout New Balance", href: "/collections/new-balance" }, { label: "New Balance 530", href: "/collections/new-balance-530" }, RETRO, SIZE],
    faq: [
      { q: "La 9060 taille-t-elle grand ?", a: COMMERCE.fit },
      { q: "9060 ou 530 ?", a: "La 530 est plus fine et plus discrète ; la 9060 plus volumineuse et plus affirmée." },
      { q: "Combien de temps pour la livraison ?", a: COMMERCE.shipping },
    ],
  },
  "new-balance-530": {
    intro: [
      "La 530 est la runner rétro la plus simple à porter : une ligne fine, du mesh aéré, des touches argentées. Moins chargée qu’une 9060, elle se glisse dans toutes les tenues.",
      "Nos coloris restent clairs et lumineux : blanc et argent, blanc et bleu, gris acier.",
    ],
    fit: COMMERCE.fit,
    wear: "Jean clair, short, robe d’été : c’est la sneaker du quotidien, qui éclaire une tenue sans la dominer.",
    related: [{ label: "Tout New Balance", href: "/collections/new-balance" }, { label: "New Balance 9060", href: "/collections/new-balance-9060" }, RETRO, SIZE],
    faq: [
      { q: "La 530 est-elle unisexe ?", a: "Oui, et nos pointures couvrent généralement du 36 au 44 selon le coloris." },
      { q: "Quelle pointure prendre ?", a: COMMERCE.fit },
      { q: "Livrez-vous à Casablanca, Rabat, Marrakech ?", a: COMMERCE.shipping },
    ],
  },
  "new-balance-550": {
    intro: [
      "La 550 vient du basket des années 80 : tige en cuir, semelle plate, blocs de couleur nets. Une silhouette basse et propre, plus sobre qu’une Jordan, qui s’est imposée comme un classique du quotidien.",
      "Notre sélection mise sur les coloris lisibles, blanc cassé en base avec une touche de couleur.",
    ],
    fit: COMMERCE.fit,
    wear: "Jean droit, chino, pantalon de costume : la 550 apporte une touche sportive sans casser une tenue nette.",
    related: [{ label: "Tout New Balance", href: "/collections/new-balance" }, { label: "Nike Dunk Low", href: "/collections/nike-dunk-low" }, BASKET, SIZE],
    faq: [
      { q: "La 550 taille-t-elle grand ?", a: COMMERCE.fit },
      { q: "550 ou Dunk Low ?", a: "Même esprit basket rétro ; la 550 est plus sobre, la Dunk plus colorée." },
      { q: "Comment se passe l’échange si la pointure ne va pas ?", a: COMMERCE.fit },
    ],
  },
  "adidas-samba": {
    intro: [
      "La Samba est née pour le football en salle et a fini par devenir la sneaker la plus portée de ces dernières années. Profil bas, bout arrondi, trois bandes, semelle en gomme : une ligne simple qui va avec presque tout.",
      "Chez BEYOND PLUS, on garde la Samba classique en blanc et gomme ou en noir, et quelques versions plus affirmées pour ceux qui veulent sortir du rang : imprimés léopard, vache, poil.",
    ],
    fit: COMMERCE.fit,
    wear: "Pantalon large qui tombe sur la chaussure, jean droit retroussé, jupe longue : la Samba s’adapte à tout. C’est la paire la plus facile pour commencer une garde-robe sneakers.",
    related: [{ label: "Tout adidas", href: "/collections/adidas" }, { label: "adidas Handball Spezial", href: "/collections/handball-spezial" }, LOW, SIZE, { label: "Samba ou Handball Spezial ?", href: "/guides/samba-ou-handball-spezial" }],
    faq: [
      { q: "La Samba taille-t-elle petit ?", a: COMMERCE.fit },
      { q: "Samba ou Handball Spezial ?", a: "Même esprit terrace. La Samba est plus basse et plus fine ; la Spezial plus douce et plus colorée." },
      { q: "Les Samba BEYOND PLUS sont-elles authentiques ?", a: "Non : ce sont des répliques qualité Master Copy Premium 1:1, et nous l’indiquons sur chaque fiche." },
    ],
  },
  "handball-spezial": {
    intro: [
      "La Handball Spezial vient du handball en salle et partage l’esprit terrace de la Samba, avec une allure plus douce : tige en daim, semelle en gomme, coloris francs.",
      "Notre sélection va du bleu clair à l’argent violet en passant par le marron, des teintes qui donnent de la couleur à une tenue neutre.",
    ],
    fit: COMMERCE.fit,
    wear: "Jean brut, pantalon large, jupe midi : la Spezial apporte une touche de couleur sans en faire trop. Le daim demande un peu d’entretien, voyez notre guide.",
    related: [{ label: "Tout adidas", href: "/collections/adidas" }, { label: "adidas Samba", href: "/collections/adidas-samba" }, LOW, { label: "Entretenir ses sneakers", href: "/guides/entretenir-ses-sneakers" }, { label: "Samba ou Handball Spezial ?", href: "/guides/samba-ou-handball-spezial" }],
    faq: [
      { q: "Comment entretenir le daim de la Spezial ?", a: "Brosse à daim et gomme, à sec. Évitez l’eau, qui marque le daim." },
      { q: "Quelle pointure choisir ?", a: COMMERCE.fit },
      { q: "Livraison au Maroc ?", a: COMMERCE.shipping },
    ],
  },
  "nike-vomero-5": {
    intro: [
      "La Vomero 5 est la runner Y2K par excellence : du mesh, des renforts en plastique, des reflets, une semelle épaisse. Elle a quitté les pistes pour devenir l’une des sneakers les plus demandées du moment.",
      "On garde des coloris doux et lumineux : ivoire, sable, blanc et gris, rose poudré, avec une version plus vive pour ceux qui osent.",
    ],
    fit: COMMERCE.fit,
    wear: "Avec un pantalon ample ou une jupe longue, le contraste avec la chaussure technique fonctionne très bien. En été, short et chaussettes hautes.",
    related: [{ label: "Tout Nike", href: "/collections/nike" }, { label: "Nike P-6000", href: "/collections/nike-p-6000" }, RETRO, SIZE],
    faq: [
      { q: "La Vomero 5 taille-t-elle petit ?", a: COMMERCE.fit },
      { q: "Vomero 5 ou P-6000 ?", a: "La Vomero 5 est plus douce et plus volumineuse ; la P-6000 plus fine et plus métallique." },
      { q: "Comment commander ?", a: "Panier, puis commande confirmée sur le site : on vous appelle pour confirmer pointure et livraison." },
    ],
  },
  "nike-p-6000": {
    intro: [
      "La P-6000 reprend les codes du running des années 2000 : superpositions, touches argentées, profil allongé. Plus fine que la Vomero 5, elle se porte facilement au quotidien.",
      "Notre sélection reste sur l’argent et le blanc, le noir et blanc, et des tons doux comme le violet platine ou le rose délavé.",
    ],
    fit: COMMERCE.fit,
    wear: "Jean large, jogging, jupe en jean : la P-6000 apporte la touche métallique qui réveille une tenue simple.",
    related: [{ label: "Tout Nike", href: "/collections/nike" }, { label: "Nike Vomero 5", href: "/collections/nike-vomero-5" }, RETRO, SIZE],
    faq: [
      { q: "La P-6000 est-elle confortable ?", a: "C’est une silhouette pensée pour le quotidien, avec une semelle souple." },
      { q: "Quelle pointure prendre ?", a: COMMERCE.fit },
      { q: "Livraison ?", a: COMMERCE.shipping },
    ],
  },
  "nike-dunk-low": {
    intro: [
      "La Dunk Low est née sur les parquets de basket universitaires et s’est imposée dans le skate puis dans la rue. Tige en cuir, blocs de couleurs, semelle plate : une silhouette simple qui se décline à l’infini.",
      "Notre sélection mélange des coloris sobres (voile, ivoire, gris) et des versions plus graphiques (paisley, bleu royal).",
    ],
    fit: COMMERCE.fit,
    wear: "Jean droit, baggy, jogging : la Dunk va avec tout ce qui a un peu de volume. Les coloris sobres passent aussi avec un pantalon de costume.",
    related: [{ label: "Tout Nike", href: "/collections/nike" }, { label: "Air Jordan 1", href: "/collections/air-jordan-1" }, BASKET, SIZE],
    faq: [
      { q: "La Dunk Low taille-t-elle grand ?", a: COMMERCE.fit },
      { q: "Dunk Low ou Air Jordan 1 Low ?", a: "Silhouettes proches ; la Dunk est un peu plus volumineuse, la Jordan 1 plus fine." },
      { q: "Livraison au Maroc ?", a: COMMERCE.shipping },
    ],
  },
  "air-jordan-1": {
    intro: [
      "L’Air Jordan 1 est la silhouette qui a fait basculer le basket dans la culture sneaker. Tige en cuir, virgule, semelle plate : une forme reconnaissable entre toutes.",
      "Notre sélection couvre des coloris faciles (gris clair, moka) et des versions plus colorées pour affirmer une tenue.",
    ],
    fit: COMMERCE.fit,
    wear: "Jean droit ou baggy qui s’arrête sur la chaussure, cargo, short en été : la Jordan 1 est la base du vestiaire streetwear.",
    related: [{ label: "Tout Jordan", href: "/collections/jordan" }, { label: "Air Jordan 4", href: "/collections/air-jordan-4" }, BASKET, SIZE],
    faq: [
      { q: "La Jordan 1 taille-t-elle normalement ?", a: COMMERCE.fit },
      { q: "Low ou High ?", a: "La Low est plus facile à porter au quotidien ; la High plus affirmée, surtout avec un bas étroit." },
      { q: "Les paires sont-elles authentiques ?", a: "Non : répliques qualité Master Copy Premium 1:1, indiquées sur chaque fiche." },
    ],
  },
  "air-jordan-4": {
    intro: [
      "L’Air Jordan 4 est l’une des silhouettes basket les plus reconnaissables : volumes marqués, ailettes latérales, filet sur les côtés. Une paire forte, qui se remarque.",
      "On garde les coloris emblématiques : noir total, gris froid, noir et rouge, orange métallisé.",
    ],
    fit: COMMERCE.fit,
    wear: "Son volume demande un bas qui tombe sur la chaussure : baggy, cargo, jogging large.",
    related: [{ label: "Tout Jordan", href: "/collections/jordan" }, { label: "Air Jordan 1", href: "/collections/air-jordan-1" }, BASKET, SIZE],
    faq: [
      { q: "La Jordan 4 taille-t-elle petit ?", a: COMMERCE.fit },
      { q: "Quelle tenue avec des Jordan 4 ?", a: "Un bas ample qui laisse voir la chaussure : baggy, cargo, jogging." },
      { q: "Livraison ?", a: COMMERCE.shipping },
    ],
  },
  "nike-air-force-1": {
    intro: [
      "L’Air Force 1 est probablement la sneaker la plus portée au monde : une tige en cuir, une semelle épaisse et plate, une ligne qui n’a presque pas bougé depuis ses débuts.",
      "Notre sélection reste sur les versions qui se portent partout, en blanc total et en noir total notamment.",
    ],
    fit: COMMERCE.fit,
    wear: "Elle va avec absolument tout : jean, jogging, costume. Le blanc total demande un peu d’entretien pour rester net.",
    related: [{ label: "Tout Nike", href: "/collections/nike" }, { label: "Nike Dunk Low", href: "/collections/nike-dunk-low" }, { label: "Icons", href: "/collections/icons" }, { label: "Entretenir ses sneakers", href: "/guides/entretenir-ses-sneakers" }],
    faq: [
      { q: "L’Air Force 1 taille-t-elle grand ?", a: COMMERCE.fit },
      { q: "Comment garder des AF1 blanches ?", a: "Brossage régulier et semelles nettoyées au bicarbonate ; voyez notre guide d’entretien." },
      { q: "Livraison ?", a: COMMERCE.shipping },
    ],
  },
  "adidas-gazelle": {
    intro: [
      "La Gazelle Indoor est la cousine terrace de la Samba : bout arrondi, trois bandes contrastées, semelle en gomme translucide. Sa ligne est un peu plus ronde et plus rétro, ce qui lui donne une allure douce, entre sport des années 70 et tenue de tous les jours.",
      "Chez BEYOND PLUS, on garde quatre coloris : crème et vert collegiate, noir et blanc, vert franc, gris, blanc et or. Les versions Bold posent la même tige sur une semelle plus épaisse, pour gagner un peu de hauteur sans changer de style.",
    ],
    fit: COMMERCE.fit,
    wear: "Jean droit ou pantalon large qui tombe sur la chaussure, jupe midi, survêtement rétro : la Gazelle se porte comme une Samba, avec une touche de couleur en plus. Les versions Bold équilibrent bien les coupes amples et les robes longues.",
    related: [{ label: "adidas Samba", href: "/collections/adidas-samba" }, { label: "adidas Handball Spezial", href: "/collections/handball-spezial" }, LOW, SIZE],
    faq: [
      { q: "Quelle pointure choisir pour la Gazelle ?", a: COMMERCE.fit },
      { q: "Gazelle ou Samba ?", a: "Même famille terrace. À l’œil, la Gazelle est un peu plus ronde et plus colorée, avec des bandes plus contrastées ; la Samba est plus basse et plus fine." },
      { q: "Livrez-vous partout au Maroc ?", a: COMMERCE.shipping },
    ],
  },
  "adidas-campus-00s": {
    intro: [
      "La Campus 00s reprend la silhouette skate des années 2000 avec des volumes plus généreux : tige en daim épaisse, lacets larges, semelle en gomme. Une paire décontractée, entre skate et terrace.",
      "Notre sélection va du noir au gris, avec des versions plus douces en rose et vert.",
    ],
    fit: COMMERCE.fit,
    wear: "Baggy, jean large, pantalon de survêtement : la Campus s’accorde avec les coupes amples.",
    related: [{ label: "Tout adidas", href: "/collections/adidas" }, { label: "adidas Samba", href: "/collections/adidas-samba" }, { label: "Skate", href: "/collections/skate" }, SIZE],
    faq: [
      { q: "Campus 00s ou Samba ?", a: "La Campus est plus épaisse et plus décontractée ; la Samba plus fine." },
      { q: "Comment entretenir le daim ?", a: "Brosse à daim, à sec. Voyez notre guide d’entretien." },
      { q: "Livraison ?", a: COMMERCE.shipping },
    ],
  },
};

/** Generic but data-true fallback for models without hand-written copy. */
export function fallbackContent(name: string, brandHandle: string, brandName: string): ModelContent {
  return {
    intro: [`La ${name} fait partie de la sélection BEYOND PLUS : quelques coloris choisis pour être portés tous les jours, plutôt que toute la gamme.`],
    fit: COMMERCE.fit,
    wear: "Gardez le reste de la tenue simple et laissez la paire donner le ton.",
    related: [{ label: `Tout ${brandName}`, href: `/collections/${brandHandle}` }, SIZE],
    faq: [
      { q: "Quelle pointure prendre ?", a: COMMERCE.fit },
      { q: "Comment commander ?", a: "Ajoutez la paire au panier puis confirmez la commande sur le site : on vous appelle pour confirmer pointure et livraison." },
      { q: "Les paires sont-elles authentiques ?", a: "Non : ce sont des répliques qualité Master Copy Premium 1:1, et nous l’indiquons sur chaque fiche." },
    ],
  };
}
