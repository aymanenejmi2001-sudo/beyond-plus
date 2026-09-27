# Plan SEO BEYOND PLUS — beyondplusmaroc.com

Stratégie (décidée le 25/09) : **BEYOND PLUS**, recherches **génériques** (sneakers / baskets / espadrilles femme et homme Maroc, low profile, pointure…) **et pages marque / modèle** (Samba Maroc, Kayano 14 Maroc…). Les pages au nom des marques restent les plus exposées juridiquement (répliques) ; les collabs sont exclues.

## Déjà fait sur le site (24/09/2026)

- Domaine `beyondplusmaroc.com`, HTTPS, www et ancien lien vercel.app redirigés en 308.
- Indexation ouverte, `robots.txt` (robots IA autorisés), `sitemap.xml` (171 URL), `llms.txt` généré depuis le catalogue, pages commande/compte/admin exclues.
- Titres et descriptions uniques : accueil, 8 collections, 55 fiches produits, 7 guides.
- Données structurées : Organization, WebSite, Product (réplique, sur commande), BreadcrumbList, Article.
- Texte éditorial sous chaque collection, liens internes vers les guides.
- 14 guides : pointures, low profile, entretien, commander au Maroc, tendances 2026, retro runners, Samba ou Spezial, Gel-NYC ou Kayano 14, 9060 ou 530, tendances femme, tendances homme, choisir ses sneakers, porter avec pantalon large / robe, pied large.
- Pages marque (adidas, Nike, ASICS…) et modèle (Samba, Kayano 14, 9060…) avec texte, FAQ, pointures ; chaque guide renvoie vers ses pages produit et inversement.
- Descriptions Google réécrites (≤ 160 caractères) avec prix et « livraison gratuite en 12 à 48 h ».
- Bing / Yandex notifiés via IndexNow (`npm run indexnow` après chaque mise en ligne).

## Mots-clés visés

| Page | Recherches visées |
|---|---|
| Accueil | beyond plus, sneakers maroc, concept store sneakers maroc |
| /collections/femme | sneakers femme maroc, baskets femme maroc |
| /collections/homme | sneakers homme maroc, baskets homme maroc |
| /collections/low-profile | sneakers low profile, baskets basses tendance |
| /collections/retro-runners | retro runners, sneakers running rétro |
| /guides/quelle-pointure-choisir-sneakers | quelle pointure sneakers, taille sneakers cm |
| /guides/commander-sneakers-livraison-maroc | acheter sneakers maroc livraison |
| /guides/sneakers-tendance-2026 | sneakers tendance 2026 |

Volumes non mesurés : à vérifier dans Search Console après 4 à 6 semaines.

## À faire par toi (comptes personnels)

1. **Google Search Console** — ajouter `beyondplusmaroc.com` (type Domaine), m’envoyer le code TXT, puis soumettre `https://beyondplusmaroc.com/sitemap.xml`.
2. **Bing Webmaster Tools** — « Importer depuis Google Search Console » (2 clics une fois l’étape 1 faite).
3. **Google Business Profile** — si tu peux déclarer une zone de livraison au Maroc : nom BEYOND PLUS, catégorie « Magasin de chaussures », site, WhatsApp.
4. **Instagram / TikTok** — lien `beyondplusmaroc.com` en bio, et le lien d’une fiche produit dans chaque post produit.
5. **WhatsApp Business** — site web dans le profil, catalogue avec liens vers les fiches.

## Liens entrants (propres, sans achat)

- Annuaires marocains d’entreprises (profil complet avec lien).
- Pages « où acheter » / collaborations avec des stylistes, photographes, créateurs de contenu mode au Maroc (échange de visibilité, pas de lien acheté).
- Articles invités sur des blogs mode / lifestyle marocains à partir des guides (pointures, tendances).
- Chaque collaboration Instagram : demander le lien du site dans la bio ou la story.

À éviter : achat de liens, packs de backlinks, réseaux de sites (PBN), faux avis. Google les détecte et pénalise tout le domaine.

## Rythme

- **Chaque mois** : 1 à 2 nouveaux guides utiles, mise à jour du catalogue (`npm run catalog`), `npm run indexnow`.
- **Toutes les 4 à 6 semaines** : lecture Search Console (requêtes réelles, pages qui montent) et ajustement des titres.
- **Attendu** : « BEYOND PLUS » en première page en quelques jours à semaines après validation Search Console ; recherches génériques en plusieurs mois, selon les liens entrants.
