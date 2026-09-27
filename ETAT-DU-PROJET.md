# BEYOND PLUS — État du projet

Mis à jour le 26/09/2026. Un seul fichier pour savoir où on en est.

## Le site

- **Adresse :** https://beyondplusmaroc.com (www et l’ancien lien vercel.app redirigent)
- **Hébergement :** Vercel, projet `beyond-plus` · Domaine acheté chez Hostinger, DNS chez Vercel (IP fixe 76.76.21.21)
- **Catalogue :** 100 paires en ligne, 400 à 850 DH (prix validés tels quels le 26/09)
- **Commandes :** panier → demande enregistrée (Vercel Blob privé, sans données personnelles) → message WhatsApp vers le 06 69 86 68 31, pas de paiement en ligne. Suivi des demandes dans /admin/radar/commandes
- **Conditions :** livraison gratuite partout au Maroc en 12 à 48 h après confirmation · échange de pointure sous 3 jours (paire non portée, boîte d’origine, retour à la charge du client) · droit de rétractation 7 jours (loi 31-08)
- **Google / Bing :** Search Console vérifié, sitemap de 171 URL à soumettre dans Search Console et Bing Webmaster Tools, IndexNow actif

## Ce qui est fait

- Direction artistique (bordeaux, acier, nuit), slider, version mobile, fiches produit
- Moteur catalogue automatique (`storefront/catalog/`) : sélection, photos, noms, classement
- Collections par style, par marque (adidas, Nike, ASICS…) et par modèle (Samba, Kayano 14, 9060…)
- SEO : titres, H1, textes des pages modèles et produits, fil d’Ariane, FAQ, données structurées, pagination explorable, chargement automatique des paires, 14 guides, llms.txt
- Transparence : page « Qualité et transparence », mention « sans affiliation avec les marques » sur tout le site
- Collabs (Travis Scott, Kith, CDG, Wales Bonner) retirées ; leurs anciennes adresses redirigent vers la page du modèle

## Agents autonomes (tâches planifiées, app Claude ouverte)

| Heure | Agent | Sortie |
|---|---|---|
| 6h30 | Chef de projet (missions) | SEO/missions/ |
| 8h, un jour sur deux | Rédacteur (1 article de fond) | guides en ligne |
| Lundi 9h30 | Curateur catalogue (selon les ventes) | CATALOGUE/journal/ |
| 11h | Technique & veille | compte rendu dans la mission |
| 12h | Backlinks (5/jour) | SEO/backlinks/ + A-ENVOYER du jour |
| 17h | Designer UX/UI | UX/journal/ |
| 21h | Chef de projet (rapport) | SEO/rapports/ |

Règles communes : SEO/REGLES.md.

**Ta routine :** chaque jour 20 min, envoyer les messages de `SEO/backlinks/A-ENVOYER-<date>.md` et cocher « [x] envoyé ». Chaque semaine, déposer une capture « Performances » de Search Console dans `SEO/search-console/` (nom : date.png).

## Ce qui reste à faire

| Qui | Quoi |
|---|---|
| **Toi** | Compléter l’identité légale dans `storefront/src/data/legal.ts` (raison sociale, adresse, ICE, RC, e-mail) |
| **Toi** | Search Console : vérifier « Réussite » sur le sitemap, demander l’indexation des 10 pages principales |
| **Toi** | Lien du site dans Instagram, TikTok, WhatsApp Business ; fiche Google Business si possible |
| **Moi** | Textes à la main pour les 13 petits modèles |
| **Toi** | Mesures réelles des 10 paires prioritaires (longueur de semelle en cm) et tes propres photos |
| **Plus tard** | Tes propres photos (88 paires ont des photos fournisseur sous 1400 px) |

## Points de vigilance

- **Répliques :** annoncées partout. Les pages au nom des marques restent les plus exposées à une demande de retrait. Pas de Google Shopping possible.
- **Espace `/admin` (BEYOND RADAR) :** fermé tant qu’aucun mot de passe `RADAR_ADMIN_PASSWORD` n’est défini dans Vercel. Les demandes de commande sont déjà stockées (Vercel Blob) ; les autres données de l’outil Radar demandent encore une base (voir `docs/beyond-radar.md`).
- **Une seule session doit déployer à la fois**, sinon une version en écrase une autre.

## Commandes utiles (dans `storefront/`)

- Voir le site en local : `npm run dev -- -p 4333`
- Actualiser le catalogue : `npm run catalog`
- Mettre en ligne : `vercel deploy --prod`
- Prévenir Bing après une mise en ligne : `npm run indexnow`

## Où trouver le détail

- `README.md` : fonctionnement technique
- `SEO-PLAN.md` : stratégie SEO et mots-clés
- `storefront/catalog/reports/migration.md` : rapport du catalogue (produits, couverture des modèles)
- `docs/beyond-radar.md` : l’outil BEYOND RADAR
