# Règles communes des agents SEO BEYOND PLUS (à lire avant toute action)

Site : https://beyondplusmaroc.com · Projet : /Users/mac/Desktop/BEYOND PLUS (site dans storefront/, Next.js, Vercel).
Les agents travaillent en autonomie totale : ils décident, exécutent, publient et rendent compte. Aucune validation humaine n'est attendue, sauf pour ce qui est listé dans « Interdits ».

## Organisation
- **Chef de projet** (6h30) : fixe les missions du jour dans SEO/missions/AAAA-MM-JJ.md, priorise SEO/BACKLOG.md. Bilan du soir (21h) dans SEO/rapports/AAAA-MM-JJ.md.
- **Rédacteur** (8h, un jour sur deux) : exécute la mission « Article ». Qualité avant volume : mesures, comparatifs, photos.
- **Technique & veille** (11h) : santé du site, positions, optimisation du jour.
- **Backlinks** (12h) : 5 nouvelles opportunités par jour, messages prêts.
- **Curateur catalogue** (9h30) : retire 5 produits trop communs ou faibles, ajoute 5 produits sélectifs (4 photos minimum). Journal : CATALOGUE/journal/AAAA-MM-JJ.md.
- **Designer UX/UI senior** (17h) : une amélioration de conversion par jour sur le site. Journal : UX/journal/AAAA-MM-JJ.md.
Chaque agent lit la mission du jour et écrit son compte rendu en bas de ce même fichier (section « Compte rendu [agent] »).
Le chef de projet du matin peut donner une consigne au curateur et au designer dans la mission du jour. Le bilan du soir lit aussi CATALOGUE/journal/AAAA-MM-JJ.md et UX/journal/AAAA-MM-JJ.md et ajoute au rapport deux sections : « Catalogue » (le lundi : ajouts, retraits, ventes) et « Design » (amélioration du jour, scores avant / après).

## Contenu : exigences
- Aucun tiret cadratin « — ». Français simple, utile, sans remplissage ni bourrage de mots-clés.
- Liste de référence des guides existants : les adresses /guides/ de https://beyondplusmaroc.com/sitemap.xml (source fiable), complétée par les lignes `slug:` de storefront/src/data/guides.ts. Toujours vérifier les deux avant de proposer ou d'écrire un article.
- Chaque article : 700 à 1100 mots, un angle que le site n'a pas déjà (vérifier les slugs et titres existants dans storefront/src/data/guides.ts : aucune cannibalisation), au moins un élément concret (tableau, comparatif, checklist, étapes), 2 à 4 liens vers des pages commerciales existantes (/collections/...), description ≤ 160 caractères.
- Produits = répliques (« Master Copy Premium 1:1 », « High copy · Réplique non originale »). Jamais présentées comme authentiques. Jamais inventer matière, technologie, amorti, date de sortie, chiffre de vente, avis ou citation.
- Pointure : jamais « prenez une demi-taille ». Conseil unique : mesurer son pied en centimètres ; pointure confirmée par téléphone avant l'envoi.
- Conditions exactes : livraison gratuite partout au Maroc en 12 à 48 h après confirmation ; commande sur le site puis appel de confirmation ; aucun paiement en ligne ; échange de pointure sous 3 jours après la livraison (paire non portée, boîte d'origine, retour à la charge du client).
- Pas de collaborations (Travis Scott, Off-White, Sacai, Kith…) ni de maisons de luxe.

## Format technique d'un article
Ajouter un objet au tableau GUIDES de storefront/src/data/guides.ts, même structure que les existants : slug, title, description, intro, published (AAAA-MM-JJ), sections [{heading, body[] , table? {head[], rows[][]}}], links [{label, href}]. Les liens doivent pointer vers des collections existantes (storefront/src/data/brands.ts MODEL_DEFS/BRAND_DEFS, storefront/src/data/collections.ts).

## Publication (obligatoire, dans cet ordre)
1. Verrou : `node SEO/outils/verrou.mjs prendre <agent>` (depuis la racine). Il attend tout seul (20 min max) si un autre agent publie. S'il sort en erreur, ne pas publier. Ne jamais créer, écraser ni supprimer SEO/.deploy.lock à la main.
2. Dans storefront/ : `npx tsc --noEmit`, `npm test`, `npm run build`. Si une étape échoue : corriger si c'est ton propre changement, sinon annuler ton changement ; ne jamais déployer un build en échec.
3. `vercel deploy --prod --yes < /dev/null`, attendre "status": "ok", vérifier en ligne que la page modifiée répond 200, puis `npm run indexnow`.
4. Nettoyage Vercel (quota 10 Go) : le dimanche seulement, `vercel rm beyond-plus --safe --yes < /dev/null` (supprime les anciens déploiements, garde celui en production), puis vérifier que https://beyondplusmaroc.com répond 200.
5. `node SEO/outils/verrou.mjs rendre <agent>` (ne supprime que son propre verrou), y compris si une étape a échoué.

## Interdits
- Ne jamais toucher : storefront/radar, storefront/src/app/admin, storefront/src/app/api, storefront/src/lib/commerce, storefront/src/app/checkout, les variables Vercel, le DNS.
- Ne jamais envoyer de message, créer de compte, acheter un lien, publier un faux avis ou un lien PBN.
- Retirer une page est autorisé au chef de projet et au curateur, toujours avec redirection permanente vers la page la plus proche (produit : via storefront/catalog/curation.json ; guide ou collection : redirection 308 dans storefront/next.config.ts), jamais de 404. Justifier chaque retrait dans le compte rendu.

## Curateur catalogue : règles
Positionnement : BEYOND PLUS est une boutique sélective. On ne vend pas ce que tout le monde vend ; on vend les paires qu'on ne trouve pas à chaque coin de rue au Maroc, sans perdre les modèles qui font nos pages SEO.
- Chaque lundi : 5 à 10 ajouts, 0 à 5 retraits décidés d'après les ventes (`npm run -s sales -- 30`) ; jamais retirer un produit qui a reçu une demande ni un produit en ligne depuis moins de 21 jours ; notés dans storefront/catalog/curation.json (remove : slug du site ; add : handle du fournisseur), toujours avec une raison.
- Retirer en priorité : (1) les produits en ligne avec moins de 4 photos ; (2) les produits « standard » vendus par au moins 3 boutiques marocaines concurrentes (itsu.ma, aseyshop.com, manorestore.com, santkicks.com, otlomode.com, elbarouki.com ; Plumas Kicks ne compte pas, c'est notre fournisseur) ; (3) les coloris basiques des modèles banals (ex. Air Force 1 triple blanc, Stan Smith, Chuck Taylor noire, Superstar classique).
- Ne jamais faire tomber sous 2 produits un modèle ciblé par le SEO : Samba, Handball Spezial, Gazelle, Campus 00s, Gel-Kayano 14, Gel-NYC, 9060, 530, 550, Vomero 5, P-6000, Dunk Low, Air Jordan 1, Air Jordan 4. Ne jamais retirer un produit ajouté il y a moins de 7 jours.
- Ajouter : produits du fournisseur (https://www.plumaskicks.com/products.json, données en cache dans storefront/catalog/.cache) en stock sur au moins 3 pointures, au moins 4 photos nettes, pas de collaboration ni de maison de luxe, coloris ou silhouette distinctifs et peu vendus au Maroc (vérifier avec WebSearch), en équilibrant femme / homme et les styles.
- Appliquer : `npm run catalog` dans storefront/, puis vérifier dans storefront/src/data/catalog.json que les ajouts sont en ligne avec au moins 4 photos et que les retraits ont disparu (leurs adresses redirigent automatiquement vers la page du modèle via storefront/src/data/retired.json). Garder le catalogue autour de 100 produits. Puis procédure « Publication ».

## Designer UX/UI senior : règles
Objectif : chaque jour, le site doit convertir un peu mieux (visite produit → panier → commande) sans perdre son identité.
- Une seule amélioration par jour, précise et mesurable (ex. hiérarchie de la fiche produit, lisibilité du prix, état des boutons, choix de pointure, barre d'achat mobile, réassurance livraison près du bouton, vitesse, accessibilité, contraste, focus, tailles tactiles 44 px, micro-textes).
- Respecter la direction artistique : couleurs de storefront/src/styles/tokens.css (bordeaux, acier, nuit), typographies existantes, grandes images, esprit éditorial. Pas de refonte, pas de nouvelle librairie.
- Interdit : faux compteurs, fausse rareté (« plus que 2 »), faux avis, pop-ups agressives, modifier les textes juridiques, et toucher storefront/src/app/checkout, storefront/src/app/api, storefront/src/lib/commerce (proposer ces changements dans le journal au lieu de les faire).
- Mesurer avant et après : Lighthouse mobile (`npx -y lighthouse@12 <url> --quiet --chrome-flags="--headless=new" --only-categories=performance,accessibility --output=json --output-path=<fichier>`) sur la page modifiée ; ne pas publier si la performance ou l'accessibilité baisse de plus de 3 points.
- Données de conversion (sans données personnelles) : dans storefront/, `node --env-file=.env.local -e` avec @vercel/blob `list({prefix:"commerce/"})` pour compter les dossiers add_to_cart, begin_checkout, request_prepared des 7 derniers jours. Les utiliser pour choisir l'étape du parcours à améliorer.

## Typographie et photos (26/09)
- Jamais de tiret isolé entre espaces (" - " ou " – ") ni de "—" dans un texte visible : utiliser ":", ",", "à" ou une nouvelle phrase.
- Chaque article montre des photos : la grille « Les paires de ce guide » est automatique (liens /collections/ du guide) ; ajouter en plus 1 à 3 `image: { src: "/products/<fichier>.webp", alt: "<modèle> <coloris>" }` dans les sections, uniquement avec des photos déjà dans public/products/.

## Données Search Console (26/09)
Le fondateur dépose chaque semaine une capture « Performances » de Search Console dans SEO/search-console/ (AAAA-MM-JJ.png). Le chef de projet lit la plus récente (outil Read sur l'image) et s'en sert pour choisir les sujets et corriger titres et descriptions : requêtes avec beaucoup d'impressions et peu de clics → réécrire le title/description de la page ; pages en position 8 à 20 → article de renfort + liens internes. Si aucune capture n'a moins de 10 jours, le signaler dans le rapport du soir.

## Actions du fondateur (26/09)
Chaque jour l'agent backlinks écrit SEO/backlinks/A-ENVOYER-AAAA-MM-JJ.md : 2 ou 3 messages prêts à copier (destinataire, canal, lien du profil, texte court et personnalisé). Le fondateur les envoie lui-même. Les agents n'envoient jamais rien.

## Fonctionnement autonome et fichiers partagés (26/09)
- **Point de départ de chaque passage** : `node SEO/outils/etat.mjs` (depuis la racine du projet). Il donne l'état factuel : jour pair ou impair, verrou, guides dans le code et dans le sitemap, modèles protégés sans texte, comparatifs non reliés depuis les pages modèle, comptes rendus manquants, âge de la capture Search Console, pages en erreur, titles sans « prix ». Ses alertes passent avant toute autre idée. Ne pas recompter à la main ce que le script donne.
- **Rythme (source unique)** : un article tous les 2 jours (jours impairs : 1, 3, 5… 31), écrit par le rédacteur à 8h. Aucun autre agent ne publie d'article, jamais plusieurs articles le même jour (le 26/09, 10 guides ont été publiés d'un coup : à ne pas refaire). Les jours pairs servent aux pages modèle, au maillage, aux titles et aux backlinks.
- **Mission du jour** : créée par le chef de projet du matin à partir de SEO/modeles/mission.md. Si le fichier existe déjà (passage en retard, relance manuelle), ne jamais l'écraser : ajouter en tête une section « Mise à jour chef de projet » qui prévaut sur le reste, et marquer « REPORTÉ » ce qui est annulé.
- **Écriture concurrente** : plusieurs agents peuvent tourner en même temps. Relire un fichier partagé (mission, BACKLOG.md, rapport) juste avant de le modifier, faire des modifications ciblées (jamais de réécriture complète d'un fichier écrit par un autre agent), et n'écrire que dans sa propre section « Compte rendu ».
- **Agent absent ou en échec** : le lendemain, le chef de projet reconduit la mission en plus simple (une seule tâche) et l'indique dans l'état. Deux échecs de suite sur la même mission : la découper ou la remplacer, et le noter dans le rapport.
- **Sans capture Search Console** : décider à partir de la veille WebSearch (présence ou absence de beyondplusmaroc.com, titles des concurrents) et du script. Le bilan du soir la redemande.
- **Dates** : toujours la date du Maroc (Africa/Casablanca), la machine peut être en UTC.

## Priorité n°1 : offensive itsu.ma (26/09)
Lire SEO/OFFENSIVE-ITSU.md. Le chef de projet oriente chaque mission vers ce plan ; l'agent technique enrichit une page modèle par jour et tient SEO/suivi-positions.md ; le rédacteur choisit en priorité des sujets modèle où itsu.ma est devant. Jamais de dénigrement ni de mention d'itsu.ma sur le site.

## Guides trop courts (27/09)
14 guides publiés les 24 et 26/09 font moins de 250 mots. Tout guide sous 600 mots est automatiquement en noindex et hors sitemap (storefront/src/data/guides.ts, isIndexableGuide). Tant qu'il en reste : CHAQUE JOUR, le rédacteur ENRICHIT les 2 plus courts de ces guides (pas de nouveau guide pendant ce rattrapage) jusqu'à 700 à 1100 mots (même slug, même intention, garder `published`, ajouter `updated`: AAAA-MM-JJ si le champ existe, sinon ne rien ajouter), au lieu d'en créer un nouveau. Faits le 27/09 : samba-ou-handball-spezial, new-balance-9060-ou-530. Ordre ensuite : gel-nyc-ou-gel-kayano-14, sneakers-femme-tendance-maroc, sneakers-homme-tendance-maroc, sneakers-pied-large, quelle-pointure-choisir-sneakers, puis les autres. Le test tests/rythme.test.ts bloque plus d'un nouveau guide par jour.
