# BEYOND PLUS

Boutique sneakers — Next.js, commandes par WhatsApp.

**Où en est le projet :** voir [ETAT-DU-PROJET.md](ETAT-DU-PROJET.md) (fait, à faire, points de vigilance).

**En ligne :** https://beyondplusmaroc.com (domaine Hostinger, DNS chez Vercel ; projet Vercel `beyond-plus`, compte heythelab-coder). www et l’ancien lien beyond-plus-gamma.vercel.app redirigent en 308.

## Structure

- `storefront/` — le site (Next.js). Photos dans `public/images/beyond/`, choix des visuels dans `src/data/assets.ts`, WhatsApp dans `src/data/store.ts`.
- `BEYOND WOMEN/`, `BEYOND MEN/`, `LOGO/` — photos et logos sources.
- `storefront/catalog/` — moteur catalogue (manifeste, sources, images, score). Voir ci-dessous.
- `research/plumas/` + `scripts/` — ancien relevé Plumas (historique, remplacé par `storefront/catalog/`).
- `storefront/radar/` — travail d'une autre session (« BEYOND RADAR »), exclu du build du site.
- `theme/` + `shopify-import/` — thème Shopify et CSV produits (brouillon), pour une future bascule Shopify.

## Commandes courantes

Aperçu local : `cd storefront && npm run dev -- -p 4333`, puis http://localhost:4333.

Mettre en ligne une modification : `cd storefront && vercel deploy --prod`.

Actualiser le catalogue : `cd storefront && npm run catalog` (cache 24 h) ou `npm run catalog -- --refresh`, puis `vercel deploy --prod`.

## Catalogue

- **Ajouter un modèle** : une ligne dans `storefront/catalog/manifest.ts` (marque, modèle, règle de correspondance, style, tier, collections, 2–5 coloris, signaux).
- **Sources** : `catalog/sources/supplier-shopify.ts` (fournisseur autorisé, photos publiables) et `catalog/sources/official.ts` (sites de marques : métadonnées seulement, photos NOT_PUBLISHABLE, uniquement l'URL fournie). robots.txt respecté, 1 requête / 1,2 s par site, 3 essais, cache, aucun contournement de blocage.
- **Images** : original téléchargé, dédoublonné (SHA-256), rejeté sous 700 px, signalé sous 1400 px, WebP sans agrandissement ni retouche → `public/products/marque-modele-coloris-01.webp`.
- **Score** (interne) : `catalog/score.ts`. Seuls best-seller fournisseur et date de mise en ligne sont des données vérifiées ; le reste est du jugement éditorial.
- **Rapports** : `catalog/reports/migration.md` (classement des produits existants, couverture, homepage), `catalog/reports/ingest-log.json`.
- **Données complètes** (y compris masqués) : `catalog/data/products.json`.

## Commandes clients

Panier → page Commande → message WhatsApp prérempli vers le 06 69 86 68 31 (articles, pointures, total, adresse). Contact et suivi passent aussi par WhatsApp. Aucun paiement en ligne.

## Direction artistique

Trois registres : Women (studio acier froid, sneakers bordeaux), Men (nuit, chrome, béton), Culture (noir et blanc). Couleurs dans `storefront/src/styles/tokens.css` (`--c-bordeaux`, `--c-steel`, `--c-night`). Photos écartées : padel (fond blanc multicolore) et collage Asics (bleu saturé).

## Reste à faire

- Prix de revente BEYOND PLUS (les prix affichés sont ceux du fournisseur).
- Textes livraison / retours / CGV / confidentialité (pages actuelles : bouton « Nous écrire »).
- Nom de domaine. Le site est volontairement non indexé par Google ; passer `NEXT_PUBLIC_SITE_STATUS=live` dans Vercel le jour du lancement officiel.
- Plusieurs photos sont des visuels de campagnes Nike / Adidas / Salomon : à remplacer par des photos propres à BEYOND PLUS.
- Thème Shopify (`theme/`) pas encore aligné sur la nouvelle direction.
