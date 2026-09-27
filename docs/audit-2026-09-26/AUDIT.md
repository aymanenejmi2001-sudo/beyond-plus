# BEYOND PLUS — audit technique, commercial et SEO

Date : 26 septembre 2026. Site : https://beyondplusmaroc.com

## Conclusion

La base de référencement est déjà construite. Le principal retard est commercial : conditions peu précises, parcours WhatsApp fragile, absence de mesure des ventes et différenciation encore centrée sur l'image. Consolider ces fondations avant d'augmenter le trafic.

Le catalogue est explicitement présenté comme composé de répliques. C'est une contrainte structurelle de distribution, de confiance et d'acquisition. Google Merchant Center interdit les contrefaçons : la transparence du texte ne suffit pas à rendre une offre admissible. Une croissance durable nécessite un approvisionnement dont la commercialisation est autorisée, documenté produit par produit. Ce rapport ne constitue pas une validation juridique du catalogue.

## Périmètre et preuves

- Exploration HTTP des 160 URL du sitemap : 100 produits, 47 collections, 6 articles de guide et 7 autres pages. Les documents internes annoncent 7 guides ; le sitemap live en contient 6 articles.
- Les 160 URL répondent en 200, possèdent un H1, une canonical et un titre unique. Aucune ne porte de noindex. Ces vérifications ne prouvent ni leur indexation ni leur classement.
- Les 12 liens internes supplémentaires extraits, dont 11 liens de pagination et /account, répondent également en 200. Ce contrôle ne constitue pas un crawl récursif de toutes les combinaisons de filtres et de pagination.
- Robots live ouvert aux moteurs. Résultats détaillés conservés dans crawl.json.
- Inspection navigateur de l'accueil et de la fiche Samba ; contrôle mobile en 390 × 844, sélection de la pointure 40, ajout au panier et arrivée au checkout avec le bon prix de 700 DH. Aucune commande envoyée.
- TypeScript : contrôle réussi. Radar : 13 tests réussis. Lint : configuration interactive demandée, donc pas de contrôle lint validé.
- npm audit production : 2 vulnérabilités signalées, une haute et une modérée, chaîne PostCSS/Next. Exploitabilité dans cette application non démontrée. Ne pas appliquer une migration majeure automatique sans validation.
- Aucun accès aux statistiques Search Console, aux ventes, aux marges réelles, aux campagnes ni aux données Core Web Vitals terrain. Aucun score de performance ou de conversion inventé. Build production non relancé pour cet audit sans modification du site.

## Corrections prioritaires

| Priorité | Faiblesse et preuve | Amélioration | Validation attendue |
|---|---|---|---|
| P0 | CheckoutView.tsx appelle clear() immédiatement après window.open vers WhatsApp | Conserver le panier et le brouillon, prévoir réouverture/copie du message ; distinguer demande préparée et commande confirmée | Fermer WhatsApp sans envoyer, revenir et retrouver tous les articles |
| P0 | Checkout live : livraison offerte ; fiche : frais à confirmer ; panier : taxes et frais calculés au paiement | Une seule configuration commerciale partagée | Même prix et même règle sur fiche, panier, checkout et message |
| P0 | ETAT-DU-PROJET indique que les prix sont encore ceux du fournisseur | Valider coût d'achat, livraison, emballage, retours, acquisition et prix de vente | Chaque article actif possède une marge de contribution calculable |
| P0 | Répliques revendiquées, noms de marques et modèles au centre des pages | Clarifier sourcing autorisé et stratégie de catalogue avant développement de l'acquisition | Documentation fournisseur et droits vérifiés ; éligibilité des canaux examinée |
| P1 | Aucun événement de conversion trouvé dans src ; Radar confirme l'absence d'analytics | Mesurer consultation produit, panier, début checkout et clic WhatsApp ; enregistrer séparément confirmation et livraison | Un clic WhatsApp ne compte jamais comme une vente |
| P1 | Aucune des 160 pages crawlées ne lie les pages /policies | Ajouter livraison/retours, CGV et confidentialité dans le footer et près du checkout | Pages accessibles et informations cohérentes |
| P1 | legal.ts : identité juridique, adresse et e-mail non renseignés | Compléter avec les informations réelles et faire valider les conditions applicables | Un acheteur sait qui vend et comment contacter le vendeur |
| P1 | Commande construite uniquement dans le navigateur, numéro aléatoire ; pas d'enregistrement serveur dans ce flux | Stocker la demande avec identifiant unique, articles, pointures, prix validés côté serveur et statut | Retrouver une demande indépendamment du navigateur |
| P1 | Panier local conserve les prix des articles au moment de l'ajout | Revalider prix et disponibilité à la reprise du panier et avant confirmation | Un changement de prix ou produit retiré déclenche une information claire |
| P1 | Audit dépendances signalé et lint non configuré | Corriger versions compatibles, configurer ESLint, exécuter build et parcours critiques | Contrôles reproductibles sans prompt interactif |
| P2 | Auth Radar à mot de passe partagé, sans limitation des essais visible dans le code | Limiter les tentatives, journaliser les accès, secret de session distinct | Tests d'auth et contrôle du dispositif de protection déployé |
| P2 | Catalogue compilé depuis des fichiers, sans stock transactionnel dans le parcours | Suivre fraîcheur fournisseur et statut de chaque pointure | Ne pas confondre pointure listée et stock confirmé |

## Expérience et conversion

La direction artistique est cohérente : contraste, grandes typographies, univers femme/homme et codes éditoriaux. Elle doit maintenant expliquer le service. « Go beyond » donne une personnalité mais ne répond pas à pourquoi acheter ici, à quel délai et avec quelles garanties.

Sur mobile, la galerie prend une grande partie du premier écran ; le bouton d'achat arrive après les pointures. Tester une barre d'achat persistante qui indique le prix et oblige à choisir une pointure. Actuellement la première taille disponible est sélectionnée automatiquement, ce qui facilite les erreurs. Une sélection explicite est préférable.

Réduire les champs avant ouverture WhatsApp : l'e-mail obligatoire, le prénom, le nom, l'adresse, la ville et le téléphone représentent une friction forte pour une simple demande. Décider si ce formulaire est une demande de disponibilité ou une véritable commande. Pour une demande : modèle, taille, ville et moyen de contact peuvent suffire ; demander l'adresse au stade approprié.

La nature de réplique apparaît dans les textes bas de page et l'accordéon Qualité, mais pas dans le bloc principal observé à proximité du prix. L'information essentielle sur la nature du produit doit être visible avant l'ajout au panier. Ne pas présenter « Master Copy Premium 1:1 » comme une certification indépendante.

Le guide Samba conseille une demi-pointure au-dessus alors que les choix observés sont des pointures entières. Remplacer les conseils génériques par des mesures réelles du produit fourni, idéalement longueur de semelle en centimètres. Les caractéristiques d'un modèle authentique ne prouvent pas celles de sa réplique.

Le panier emploie « Size », le site « Pointure ». Uniformiser le français : Femme, Homme, Pointure, Nouveautés. Garder les expressions anglaises là où elles servent réellement l'identité.

Accessibilité : focus visible et styles de réduction du mouvement existent. Le carrousel JS continue cependant à avancer toutes les six secondes, avec pause seulement au survol. Ajouter pause clavier/tactile et respect de la préférence de réduction des animations dans le comportement JS. Contrôler contraste des petits libellés, focus des overlays et lecture des boutons : « Ajouter au panier » est annoncé deux fois dans l'arbre observé.

## SEO : préserver les acquis, améliorer la valeur

### Ce qui fonctionne

URLs lisibles, rendu HTML exploitable, sitemap, robots, titres uniques, canonical, structure marque/modèle/produit, maillage des guides, données Product et BreadcrumbList et pagination par liens. Inutile de recommencer toute cette architecture.

### Points à corriger

1. **Dates du sitemap** : sitemap.ts applique new Date() à toutes les pages. Utiliser la date réelle de modification significative, ou omettre lastmod si inconnue.
2. **Paramètres des collections** : tout paramètre autre que page provoque noindex, y compris utm_source. La canonical d'une page 2 avec UTM revient en plus à la première page. Distinguer tracking, pagination et filtres ; conserver la canonical de la page paginée correspondante.
3. **Descriptions** : 15 descriptions dépassent 170 caractères. Ce n'est pas une pénalité automatique ; réécrire les extraits pour faire apparaître rapidement l'information utile, le prix confirmé et la différence de service.
4. **47 collections pour 100 produits** : inspecter le chevauchement et l'utilité de chaque page avec Search Console. Ne pas supprimer arbitrairement ; fusionner seulement les pages sans intention ni assortiment distincts.
5. **Contenu produit** : enrichir les paires prioritaires avec photos réelles, mesures, matière vérifiée, détails visibles et conditions. Les variations de textes générées par modèle/couleur ne remplacent pas une connaissance du produit.
6. **Données structurées** : BackOrder est déclaré globalement. Aligner disponibilité et offre sur la situation réelle ; ne pas ajouter avis, GTIN, origine ou certifications non prouvés. Les rich results ne sont pas garantis et dépendent des politiques applicables.
7. **Variables d'environnement** : metadataBase et sitemap retombent sur localhost si la variable URL manque. Bloquer le build production si les variables publiques essentielles sont absentes. Le site live contrôlé possède actuellement la bonne canonical.
8. **Indexation mesurée** : vérifier Search Console : pages soumises/indexées, exclusions, canonical choisie, requêtes, clics et CTR par page. Un sitemap HTTP 200 ne prouve pas sa prise en compte.
9. **Documents divergents** : README parle encore d'un site non indexable ; SEO-PLAN annonce 74 URL et une stratégie générique, alors que le live comporte 160 URL et cible aussi les marques. Unifier le plan autour des choix commerciaux réels.
10. **IA** : robots ouverts et llms.txt peuvent aider à exposer du contenu, mais ne prouvent aucune visibilité dans ChatGPT ou d'autres assistants. Priorité aux informations vérifiables et aux mentions externes légitimes.

### Carte de contenus proposée

Hypothèses à valider avec les requêtes réelles ; volumes, positions, difficulté et backlinks non mesurés. Ces contenus doivent servir une offre dont la commercialisation est autorisée.

| Requête / sujet | Intention | Page / format | Priorité éditoriale |
|---|---|---|---|
| BEYOND PLUS Maroc | Navigation | Accueil et présentation de l'entreprise | Haute |
| sneakers femme Maroc | Achat | Collection femme enrichie | Haute |
| sneakers homme Maroc | Achat | Collection homme enrichie | Haute |
| baskets femme Maroc | Achat | Même collection femme, éviter le doublon | Haute |
| baskets homme Maroc | Achat | Même collection homme | Haute |
| commander sneakers Maroc | Achat | Guide du parcours et des conditions | Haute |
| livraison sneakers Maroc | Achat | Page livraison avec tarifs réels | Haute |
| échange pointure sneakers | Réassurance | Politique et FAQ concrète | Haute |
| choisir pointure sneakers | Information | Guide de mesures illustré | Haute |
| mesurer son pied en cm | Information | Tutoriel avec photos | Haute |
| sneakers pied large | Comparaison | Guide fondé sur mesures testées | Moyenne |
| sneakers low profile femme | Achat | Collection + idées de tenues | Moyenne |
| baskets rétro homme | Achat | Collection retro runners | Moyenne |
| sneakers avec pantalon large | Inspiration | Guide photo original | Moyenne |
| sneakers avec robe | Inspiration | Guide photo original | Moyenne |
| nettoyer sneakers en daim | Information | Tutoriel après vérification des matières | Moyenne |
| entretenir baskets blanches | Information | Guide pratique | Moyenne |
| sneakers tendance 2026 Maroc | Découverte | Guide mis à jour avec observations sourcées | Secondaire |

Éviter des pages par ville presque identiques. Une page Casablanca ou Rabat ne se justifie que par un service local distinct et documenté.

## Marketing et exploitation

**Différenciation proposée, à valider :** sélection de silhouettes faciles à porter, aide réelle à la pointure et commande accompagnée au Maroc. Pour l'affirmer, produire les preuves correspondantes. Une sélection éditoriale seule est facilement copiée.

**Catalogue :** concentrer le travail initial sur 10 à 15 références à approvisionnement et marge confirmés. Classer les mises en avant sur commandes livrées, marge, retours et disponibilité ; ne pas confondre score éditorial ou tendance fournisseur avec best-seller BEYOND.

**Contenu :** créer une base de photos propres : profil, dessus, talon, semelle et porté ; une vidéo produit et deux tenues par référence prioritaire. Les documents internes signalent 88 paires sous 1400 px : c'est un indicateur à vérifier, pas une preuve que toutes les images sont inutilisables. La fidélité à ce qui sera livré compte davantage qu'une résolution arbitraire.

**Confiance :** vrais avis après livraison avec accord, exemples de colis reçus, identité du vendeur, conditions visibles, horaires de réponse réellement tenables. Pas de compteur de ventes ou d'avis simulés.

**Acquisition :** d'abord rendre le parcours fiable et choisir les produits admissibles aux canaux utilisés. Puis tester des contenus organiques qui répondent à des objections : rendu au pied, choix de taille, tenue, livraison. Renvoyer chaque contenu vers la bonne fiche via un lien mesurable. Aucun budget recommandé sans marge et conversion observées.

**Rétention :** service après-vente et demande d'avis après livraison ; alertes retour en stock seulement sur consentement. La newsletter actuelle est un lien éditorial, pas un mécanisme de capture. STORE.instagram pointe sur la page générique instagram.com ; renseigner le vrai profil avant son utilisation.

**Comparaison observée :** Le Club Sportif Maroc affiche dès le début authenticité revendiquée et paiement à la livraison. Ces déclarations commerciales ne sont pas auditées ici, mais montrent un contraste : BEYOND explique d'abord son univers, moins vite ses conditions. Aucun classement SEO comparatif n'est établi. L'accès à Courir Maroc n'a pas permis une analyse exploitable.

**Pilotage :** suivre chaque semaine visites produit, ajouts panier, démarrages checkout, clics WhatsApp, demandes reçues, commandes confirmées, livrées, refusées et retournées. Ventiler par source, produit, taille et ville. Ne jamais transmettre noms, adresses ou téléphones aux outils analytics.

Calcul opérationnel : marge de contribution = revenu réellement encaissé − achat − transport supporté − emballage − frais variables − coût attendu des refus/retours − acquisition. Le coût d'acquisition maximal doit laisser une contribution positive ; aucun montant fiable n'est calculable avec les données actuelles.

## Performance, maintenance et infrastructure

Next/Image, formats modernes, fichiers produits WebP et tailles responsives sont déjà présents. Les trois visuels du hero sont chargés eager ; différer les slides secondaires mérite un test. Mesurer LCP, INP et CLS sur mobile avant/après, avec données terrain si disponibles et tests de laboratoire documentés. Aucun temps réel n'a été mesuré dans cet audit.

Le code garde un ancien AccountProvider simulé monté globalement. La page /account actuelle est bien une page de suivi WhatsApp : ne pas confondre ce code dormant avec une connexion factice exposée. Supprimer les composants inutilisés pour réduire ambiguïté et maintenance.

Le dossier courant n'est pas reconnu comme dépôt Git par git status. Un workflow Radar existe, mais ne prouve pas une exécution GitHub ; il ne contient pas de contrôle build/lint avant publication. Mettre en place versionnement, branche de travail, CI, déploiement preview et rollback reproductible.

Les actions de photos Radar écrivent dans le système de fichiers local. Pour un usage hébergé, vérifier persistance, stockage objet, base de données, sauvegardes et méthode de publication. Le fait que l'admin soit accessible ne prouve pas que ses écritures persistent sur Vercel.

## Plan proposé

| Quand | Livraison | Responsable | Effort indicatif | Dépendance |
|---|---|---|---|---|
| J1–J2 | Conditions commerciales et prix approuvés ; décision sourcing | Direction / opérations | 0,5–2 jours | Données fournisseur et logistique |
| J1–J3 | Corriger livraison contradictoire, panier conservé, liens politiques, choix explicite de taille | Développement | 1–2 jours | Conditions validées |
| Semaine 1 | Lint, dépendances, tests des parcours, versionnement | Développement | 1–3 jours | Choix de migration après audit |
| Semaine 1–2 | Demandes enregistrées, statuts et analytics sans données personnelles | Développement / opérations | 2–5 jours | Stockage et règles de confidentialité |
| Semaine 2 | 10 fiches prioritaires documentées et photographiées | Contenu / opérations | 3–5 jours | Produits disponibles pour prises de vue |
| Semaine 2 | Canonical paramètres, dates sitemap, extraits et documents harmonisés | SEO / développement | 0,5–1,5 jour | Stratégie catalogue arrêtée |
| Semaines 3–4 | Premiers tests de contenu/acquisition admissibles et bilan ventes livrées | Marketing | Continu | Mesure fiable et marge positive |

Les efforts sont des estimations, pas un engagement de délai. Les quick wins incluent les liens de footer, libellés, correction de canonical et suppression de la fausse gratuité après validation des conditions. La commande enregistrée et la qualité des données constituent les investissements principaux.

## Sources externes

- Google Merchant Center, contrefaçons : https://support.google.com/merchants/answer/6149993?hl=en
- Google Search Central, dates sitemap : https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google Search Central, données produits : https://developers.google.com/search/docs/appearance/structured-data/merchant-listing
- Observation du positionnement concurrent : https://leclubsportifmaroc.com/

Audit livré sans modification fonctionnelle ni déploiement du site.
