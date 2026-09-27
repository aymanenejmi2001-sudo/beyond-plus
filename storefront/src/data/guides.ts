// Editorial guides — written for people first. Each one answers a real
// question customers ask before ordering, and links to the relevant edit.

/** image (optional): only site photos, /products/*.webp or /images/beyond/*.jpg. */
export interface GuideSection { heading: string; body: string[]; table?: { head: string[]; rows: string[][] }; image?: { src: string; alt: string } }
export interface Guide {
  slug: string;
  title: string;
  description: string;
  intro: string;
  published: string;
  sections: GuideSection[];
  links: { label: string; href: string }[];
}

export const GUIDES: Guide[] = [
  {
    slug: "reconnaitre-bonne-copie-sneakers",
    title: "Sneakers high copy : comment reconnaître une bonne copie",
    description: "Copie à 250 DH ou à 700 DH : ce qui change vraiment. Les 8 points à vérifier sur une sneaker high copy avant de l’acheter au Maroc.",
    intro: "Au Maroc, presque toutes les boutiques de sneakers à moins de 1000 DH vendent des copies, souvent sans le dire. Entre une paire à 250 DH et une paire à 700 DH, la différence ne se voit pas toujours en photo, mais elle se sent au bout de deux semaines. Voici ce qu’il faut regarder, point par point.",
    published: "2026-09-26",
    sections: [
      {
        heading: "Pourquoi une copie coûte 250 DH et une autre 700 DH",
        body: [
          "Le prix suit trois choses : les matières (vrai daim ou synthétique, cuir ou simili), la précision du moule de la semelle, et le contrôle en usine. Une copie d’entrée de gamme économise sur les trois.",
          "Ce qu’on ne voit pas en photo se voit à l’usage : colle qui ressort, semelle qui se décolle, daim qui pèle, forme qui s’affaisse. Une bonne copie tient une saison entière sans ces défauts.",
        ],
        table: {
          head: ["Point", "Copie d’entrée de gamme", "Bonne copie (high copy)"],
          rows: [
            ["Daim et cuir", "Synthétique brillant, rigide", "Daim au toucher velouté, cuir souple"],
            ["Coutures", "Irrégulières, fils qui dépassent", "Droites, espacement régulier"],
            ["Colle", "Traces visibles le long de la semelle", "Joint propre entre tige et semelle"],
            ["Semelle", "Gomme dure, couleur trop orange ou trop claire", "Gomme souple, teinte proche du modèle"],
            ["Forme", "Bout trop large ou trop haut", "Profil fidèle, surtout de côté"],
            ["Odeur", "Forte odeur de colle", "Odeur légère qui disparaît en quelques jours"],
          ],
        },
      },
      {
        heading: "Les 8 points à vérifier à la réception",
        image: { src: "/products/adidas-samba-core-black-02.webp", alt: "adidas Samba noire, vue de profil : ligne basse et semelle gomme" },
        body: [
          "1. Le profil : posez la paire de côté. Sur une Samba par exemple, la ligne doit rester basse et allongée, sans bosse au niveau des orteils.",
          "2. Les coutures du bout et des bandes : régulières, sans fil qui dépasse.",
          "3. Le joint tige et semelle : pas de colle visible ni de décollement, même léger.",
          "4. Le daim : il doit changer légèrement de teinte quand on passe le doigt dessus.",
          "5. La semelle : souple quand on la plie, sans craquement.",
          "6. Les logos et impressions : nets, bien centrés, sans bavure.",
          "7. La symétrie : comparez le pied gauche et le pied droit côte à côte, hauteur et couleur doivent être identiques.",
          "8. La pointure : mesurez votre pied en centimètres et comparez à la longueur de la semelle intérieure, avec environ 1 cm de marge.",
        ],
      },
      {
        heading: "Les coloris en daim demandent plus d’attention",
        image: { src: "/products/adidas-handball-spezial-shadow-brown-alumina-04.webp", alt: "adidas Handball Spezial marron en daim, détail de la tige" },
        body: [
          "Sur une Handball Spezial ou une Gazelle, le daim est la matière qui trahit le plus vite une copie bas de gamme : il est plat, brillant et marque au premier frottement. Un bon daim a du relief et se brosse.",
          "Pour le garder, une brosse à daim et un spray imperméabilisant suffisent. Notre guide d’entretien détaille la méthode.",
        ],
      },
      {
        heading: "Notre façon de faire chez BEYOND PLUS",
        body: [
          "Nous vendons des répliques et nous le disons : chaque fiche porte la mention « High copy · Réplique non originale ». Une seule qualité, pas de gamme « basic » à côté.",
          "Chaque paire est contrôlée avant l’envoi, la pointure est confirmée par téléphone, la livraison est gratuite partout au Maroc en 12 à 48 heures, et l’échange de pointure est possible sous 3 jours (paire non portée, boîte d’origine).",
        ],
      },
    ],
    links: [
      { label: "adidas Samba au Maroc", href: "/collections/adidas-samba" },
      { label: "Handball Spezial au Maroc", href: "/collections/handball-spezial" },
      { label: "Sneakers à moins de 700 DH", href: "/collections/sneakers-moins-de-700-dh" },
      { label: "Qualité et transparence", href: "/qualite-transparence" },
    ],
  },
  {
    slug: "quelle-pointure-choisir-sneakers",
    title: "Quelle pointure choisir pour ses sneakers",
    description: "Mesurez votre pied en centimètres et faites confirmer la pointure de votre paire high copy avant de commander chez BEYOND PLUS.",
    intro: "La mauvaise pointure est la première raison d’un échange. Bonne nouvelle : cinq minutes et une règle suffisent pour viser juste.",
    published: "2026-09-24",
    sections: [
      {
        heading: "Mesurer son pied, en centimètres",
        body: [
          "Posez une feuille contre un mur, le talon collé au mur. Tracez la pointe du pied le plus long (on a souvent un pied plus grand que l’autre) et mesurez du mur au trait.",
          "Faites-le en fin de journée, avec les chaussettes que vous porterez : le pied gonfle légèrement dans la journée.",
        ],
      },
      {
        heading: "Confirmer la pointure de la paire choisie",
        body: ["Il n’existe pas de correspondance universelle entre centimètres et pointures. Les mesures d’une réplique peuvent différer de celles du modèle original. Envoyez-nous la longueur de vos deux pieds et la référence choisie pour vérifier la taille avant validation."],
      },
      {
        heading: "Entre deux pointures ?",
        body: ["Précisez si vous avez le pied large et quelles chaussettes vous porterez. Ne choisissez pas automatiquement une demi-pointure supplémentaire : seules les pointures affichées pour cette paire peuvent être demandées."],
      },
      {
        heading: "Le plus simple : demandez-nous",
        body: ["Notez votre longueur de pied et votre pointure habituelle : on vous appelle après la commande pour confirmer la pointure avant l’envoi."],
      },
    ],
    links: [{ label: "Toutes les sneakers", href: "/collections/nouveautes" }, { label: "Sneakers femme", href: "/collections/femme" }, { label: "Sneakers homme", href: "/collections/homme" }],
  },
  {
    slug: "sneakers-low-profile-comment-les-porter",
    title: "Sneakers low profile : comment les porter",
    description: "Silhouettes basses, semelle fine, esprit terrace : pourquoi les sneakers low profile sont partout, et comment les associer au quotidien.",
    intro: "Après des années de semelles épaisses, la sneaker est redescendue au ras du sol. Fine, plate, souvent en daim ou en cuir : c’est la low profile.",
    published: "2026-09-24",
    sections: [
      {
        heading: "Ce qui fait une low profile",
        body: [
          "Une semelle fine, souvent en gomme. Une ligne allongée qui suit la forme du pied. Peu de volume, peu de rembourrage.",
          "Beaucoup viennent du football en salle ou des tribunes (l’esprit « terrace »), d’autres du sport automobile : des chaussures pensées pour sentir le sol.",
        ],
      },
      {
        heading: "Avec quoi les porter",
        body: [
          "Pantalon large ou baggy qui tombe sur la chaussure : le contraste entre le volume du pantalon et la finesse de la sneaker fait tout.",
          "Jupe longue ou midi : la low profile allège une tenue habillée sans la casser.",
          "Jean droit, légèrement retroussé : la version la plus simple, qui montre toute la ligne.",
        ],
      },
      {
        heading: "Quels coloris choisir en premier",
        body: [
          "Blanc et gomme : la base, qui va avec tout.",
          "Noir et blanc : plus graphique, facile en ville.",
          "Un coloris affirmé (bleu ciel, bordeaux, argent) en deuxième paire, pour donner le ton à une tenue neutre.",
        ],
      },
    ],
    links: [{ label: "adidas Samba", href: "/collections/adidas-samba" }, { label: "adidas Handball Spezial", href: "/collections/handball-spezial" }, { label: "adidas Gazelle", href: "/collections/adidas-gazelle" }, { label: "Sneakers low profile", href: "/collections/low-profile" }],
  },
  {
    slug: "entretenir-ses-sneakers",
    title: "Entretenir ses sneakers : le guide simple",
    description: "Cuir, daim, mesh, semelle en gomme : les bons gestes pour nettoyer ses sneakers sans les abîmer, et les erreurs à éviter.",
    intro: "Une paire bien entretenue garde sa forme et sa couleur deux fois plus longtemps. Il suffit de quelques gestes réguliers.",
    published: "2026-09-24",
    sections: [
      {
        heading: "Les gestes de base, pour toutes les matières",
        body: [
          "Brossez à sec après chaque sortie poussiéreuse : c’est 80 % du travail.",
          "Retirez les lacets et les semelles intérieures avant un nettoyage complet.",
          "Séchage à l’air libre, à l’ombre, jamais sur un radiateur ni en plein soleil : la colle et le cuir n’aiment pas la chaleur.",
          "Glissez du papier journal à l’intérieur pour garder la forme et absorber l’humidité.",
        ],
      },
      {
        heading: "Selon la matière",
        body: [
          "Cuir lisse : chiffon humide et une goutte de savon doux, puis un chiffon sec.",
          "Daim et nubuck : brosse à daim et gomme dédiée, à sec. L’eau marque le daim.",
          "Mesh et textile : brosse souple et eau savonneuse tiède, en tamponnant plutôt qu’en frottant.",
          "Semelle en gomme : brosse à dents et bicarbonate pour faire revenir le blanc.",
        ],
      },
      {
        heading: "Les erreurs à éviter",
        body: [
          "La machine à laver : elle déforme la paire et décolle les semelles.",
          "Les produits javellisés : ils jaunissent les semelles blanches.",
          "Ranger une paire humide dans sa boîte.",
        ],
      },
    ],
    links: [{ label: "adidas Samba", href: "/collections/adidas-samba" }, { label: "Nike Air Force 1", href: "/collections/nike-air-force-1" }, { label: "adidas Handball Spezial", href: "/collections/handball-spezial" }],
  },
  {
    slug: "commander-sneakers-livraison-maroc",
    title: "Commander ses sneakers au Maroc : comment ça marche",
    description: "Choisir sa paire, confirmer la pointure, se faire livrer partout au Maroc : le déroulé complet d’une commande BEYOND PLUS.",
    intro: "Pas de compte à créer, pas de paiement en ligne : chez BEYOND PLUS, une commande se confirme en échangeant avec une vraie personne.",
    published: "2026-09-24",
    sections: [
      {
        heading: "1. Choisir sa paire et sa pointure",
        body: [
          "Choisissez explicitement votre pointure avant d’ajouter la paire au panier. En cas de doute, mesurez votre pied on confirme la taille avec vous par téléphone.",
        ],
      },
      {
        heading: "2. Confirmer la commande sur le site",
        body: [
          "Sur la page Commande, renseignez votre prénom, votre téléphone, votre ville et votre adresse, puis cliquez sur « Confirmer la commande ». C’est tout : pas de compte à créer, pas de paiement en ligne.",
        ],
      },
      {
        heading: "3. Confirmation et livraison",
        body: [
          "On vous appelle pour confirmer la pointure et la disponibilité. La livraison est gratuite sous 12 à 48 heures après confirmation de la commande. Rien n’est expédié avant votre accord.",
          "On livre partout au Maroc : Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir et ailleurs.",
        ],
      },
      {
        heading: "Questions fréquentes",
        body: [
          "Faut-il payer en ligne ? Non, le mode de paiement est convenu avec vous sur WhatsApp.",
          "Les paires sont-elles authentiques ? Non : ce sont des répliques de qualité Master Copy Premium 1:1, et nous l’indiquons sur chaque fiche.",
          "Et si la pointure ne va pas ? Vous avez 3 jours après la livraison pour demander un échange de pointure (paire non portée, dans sa boîte, frais de retour à votre charge).",
        ],
      },
    ],
    links: [{ label: "Toutes les sneakers", href: "/collections/nouveautes" }, { label: "Sneakers femme", href: "/collections/femme" }, { label: "Sneakers homme", href: "/collections/homme" }, { label: "Trending Now", href: "/collections/trending-now" }],
  },
  {
    slug: "sneakers-tendance-2026",
    title: "Sneakers tendance en 2026 : ce qui se porte",
    description: "Low profile, runners d’archive, reflets argentés : les tendances sneakers de 2026, et comment les adopter sans suivre la mode à l’aveugle.",
    intro: "Trois familles dominent la rue cette année. Voici ce qui les définit, et comment choisir celle qui vous ressemble.",
    published: "2026-09-24",
    sections: [
      {
        heading: "Les silhouettes basses",
        body: [
          "Semelle fine, esprit terrace ou racing : après des années de semelles épaisses, la sneaker redescend. C’est la tendance la plus facile à porter, du jean droit à la jupe longue.",
        ],
      },
      {
        heading: "Les runners d’archive",
        body: [
          "Les modèles de running des années 2000 reviennent, avec leur mesh, leurs overlays et leurs semelles techniques. Ils apportent du volume à une tenue sobre.",
        ],
      },
      {
        heading: "L’argent et les tons doux",
        body: [
          "Côté couleurs, l’argent métallisé, le crème et les gris clairs remplacent le blanc pur. Le bordeaux et les tons terre servent de touche forte.",
        ],
      },
      {
        heading: "Comment choisir",
        body: [
          "Une seule paire ? Prenez une silhouette basse dans un coloris neutre : elle ira avec tout. Deuxième paire : une runner, pour varier les volumes.",
        ],
      },
    ],
    links: [{ label: "ASICS Gel-Kayano 14", href: "/collections/asics-gel-kayano-14" }, { label: "New Balance 9060", href: "/collections/new-balance-9060" }, { label: "adidas Samba", href: "/collections/adidas-samba" }, { label: "Nike Vomero 5", href: "/collections/nike-vomero-5" }],
  },
  {
    slug: "retro-runners-comment-les-porter",
    title: "Retro runners : comment les porter",
    description: "Les runners d’archive sont partout. Nos conseils pour les associer à un baggy, un short ou un tailleur, et bien choisir sa pointure.",
    intro: "Plus volumineuses qu’une low profile, les retro runners demandent un peu d’équilibre dans la tenue. Rien de compliqué.",
    published: "2026-09-24",
    sections: [
      {
        heading: "Jouer sur les volumes",
        body: [
          "Pantalon large ou baggy : le volume du bas répond à celui de la chaussure, la silhouette reste équilibrée.",
          "Short ou jupe courte avec chaussettes hautes : la runner devient la pièce forte de la tenue.",
          "Tailleur ou costume trop grand : le contraste sport / habillé est l’un des looks les plus forts du moment.",
        ],
      },
      {
        heading: "Les coloris qui fonctionnent",
        body: ["Argent et blanc pour la lumière, noir et argent pour le soir, crème pour la douceur. Gardez le reste de la tenue simple."],
      },
      {
        heading: "La pointure",
        body: ["Le rembourrage prend de la place. Mesurez votre pied en centimètres et envoyez la mesure sur WhatsApp : on confirme la pointure de la paire fournie avant l’envoi."],
      },
    ],
    links: [{ label: "ASICS Gel-Kayano 14", href: "/collections/asics-gel-kayano-14" }, { label: "ASICS Gel-NYC", href: "/collections/asics-gel-nyc" }, { label: "New Balance 9060", href: "/collections/new-balance-9060" }, { label: "Nike Vomero 5", href: "/collections/nike-vomero-5" }],
  },
  {
    slug: "samba-ou-handball-spezial",
    title: "Samba ou Handball Spezial : laquelle choisir ?",
    description: "Samba ou Handball Spezial : différences de silhouette, de style et de coloris, et comment choisir entre les deux sneakers terrace les plus portées au Maroc.",
    intro: "Samba si vous voulez une paire sobre qui va avec tout, Handball Spezial si vous voulez de la couleur et une allure plus douce. Les deux sont des sneakers terrace basses à semelle gomme, mais elles ne donnent pas le même effet une fois portées. Voici comment les distinguer, les coloris disponibles chez nous et la bonne méthode pour la pointure. Nos paires sont des répliques Master Copy Premium 1:1, jamais présentées comme originales.",
    sections: [
      {
        "heading": "En bref",
        "body": [
          "La Samba est plus fine, plus allongée et plus graphique. C’est la paire passe-partout, du jean droit au pantalon à pinces.",
          "La Handball Spezial est un peu plus ronde et plus douce à l’œil. On la choisit d’abord pour sa couleur.",
          "Budget : les deux sont à 700 DH chez nous, sauf les versions à motif de Samba (750 DH)."
        ]
      },
      {
        "heading": "Ce qui les rapproche",
        "body": [
          "Les deux viennent du sport en salle et partagent les codes du style terrace : profil bas, trois bandes sur le côté, semelle couleur gomme sur beaucoup de coloris.",
          "Elles se portent de la même façon : avec un pantalon qui tombe sur la chaussure, un jean droit ou une jupe longue. Aucune ne demande une tenue compliquée.",
          "Si vous hésitez, c’est bon signe : vous ne pouvez pas vraiment vous tromper. La question est surtout celle de l’allure que vous cherchez."
        ]
      },
      {
        "heading": "Ce qui les distingue à l’œil",
        "body": [
          "La Samba a un bout plus pointu et une ligne plus longue. Posée à côté de la Spezial, elle paraît plus fine et plus nette. Elle allonge la jambe, ce qui plaît avec les pantalons larges.",
          "La Spezial a un bout plus arrondi et un peu plus de volume à l’avant. Son allure est plus décontractée, presque rétro sportive. Elle joue beaucoup sur les tons doux : bleu clair, marron, argent.",
          "Autre différence nette : la Samba se porte surtout en coloris neutres, alors que la Spezial est souvent choisie pour une couleur précise."
        ],
        "image": {
          "src": "/products/adidas-samba-vegan-white-gum-01.webp",
          "alt": "adidas Samba blanc et gomme"
        }
      },
      {
        "heading": "Tableau comparatif",
        "body": [
          "Comparaison visuelle et pratique des paires en ligne chez nous."
        ],
        "table": {
          "head": [
            "Critère",
            "Samba",
            "Handball Spezial"
          ],
          "rows": [
            [
              "Silhouette",
              "Fine, allongée, bout plus pointu",
              "Plus ronde, un peu plus de volume"
            ],
            [
              "Effet porté",
              "Net, graphique, allonge la jambe",
              "Doux, décontracté, rétro"
            ],
            [
              "Coloris types",
              "Blanc et gomme, noir, bleu halo, motifs léopard et vache",
              "Bleu clair, marron, argent violet, argent vert"
            ],
            [
              "Pour qui",
              "Une paire unique qui va avec tout",
              "Une touche de couleur dans une tenue neutre"
            ],
            [
              "Pointures en ligne",
              "36 à 44 selon le coloris",
              "36 à 40"
            ],
            [
              "Prix chez nous",
              "700 DH, 750 DH pour les motifs",
              "700 DH"
            ]
          ]
        }
      },
      {
        "heading": "Les coloris en ligne chez nous",
        "body": [
          "Samba : Vegan White Gum (blanc et gomme, 36 à 44), Core Black (36 à 44), Core White Halo Blue, et deux versions fortes pour femme, Cow Print et Leopard, plus la Pony Hair Wonder White.",
          "Handball Spezial : Light Blue, Shadow Brown Alumina, Silver Violet et Silver Green Magic, toutes en 36 à 40.",
          "Pour un homme qui chausse au-dessus du 40, la Samba blanche ou noire est donc la seule des deux disponible aujourd’hui."
        ],
        "image": {
          "src": "/products/adidas-handball-spezial-light-blue-01.webp",
          "alt": "adidas Handball Spezial bleu clair"
        }
      },
      {
        "heading": "Avec quelles tenues",
        "body": [
          "Samba blanche et gomme : jean brut droit, chemise blanche, ou pantalon de tailleur beige. C’est la paire la plus facile de toute la catégorie.",
          "Samba noire : parfaite avec un jean noir ou un pantalon large gris. Elle donne un côté plus urbain.",
          "Spezial bleu clair ou argent : avec un jean clair, un pantalon crème ou une jupe longue en satin. Laissez la couleur de la chaussure être le seul accent de la tenue.",
          "Spezial marron : avec des tons terre, un pantalon kaki ou un pull camel, pour une allure d’automne."
        ]
      },
      {
        "heading": "Checklist : laquelle pour moi ?",
        "body": [
          "Je veux une seule paire pour le travail et le week-end : Samba blanche ou noire.",
          "Je porte beaucoup de neutre et j’aime une touche de couleur : Spezial.",
          "Je chausse au-dessus du 40 : Samba (Spezial en ligne du 36 au 40).",
          "Je cherche une pièce forte : Samba Leopard ou Cow Print.",
          "J’aime les tons doux et rétro : Spezial Light Blue ou Silver Violet."
        ]
      },
      {
        "heading": "Pointure : ne pas se tromper",
        "body": [
          "Mesurez la longueur de votre pied en centimètres, talon contre un mur, le soir quand le pied est un peu plus long. Gardez ce chiffre sous la main : lors de notre appel de confirmation, on vérifie la pointure de la paire fournie avant l’envoi. Les conseils de taille des modèles originaux ne s’appliquent pas forcément à une réplique, c’est pour cela qu’on ne se fie qu’à la mesure en centimètres.",
          "La livraison est gratuite partout au Maroc, en 12 à 48 heures après l’appel de confirmation. Aucun paiement en ligne. Si la pointure ne va pas, l’échange est possible sous 3 jours après la livraison, paire non portée et dans sa boîte d’origine, retour à votre charge."
        ]
      }
    ],
    links: [{"label": "adidas Samba", "href": "/collections/adidas-samba"}, {"label": "adidas Handball Spezial", "href": "/collections/handball-spezial"}, {"label": "Sneakers low profile", "href": "/collections/low-profile"}],
    published: "2026-09-26"
  },
  {
    slug: "gel-nyc-ou-gel-kayano-14",
    title: "Gel-NYC ou Gel-Kayano 14 : les différences",
    description: "ASICS Gel-NYC ou Gel-Kayano 14 : allure, volume, coloris et usage au quotidien. Le comparatif simple pour choisir sa runner ASICS au Maroc.",
    intro: "Gel-NYC si vous voulez une runner ASICS facile, qui va avec tout du lundi au dimanche. Gel-Kayano 14 si vous voulez une paire plus chargée, plus brillante, qui donne tout de suite une allure Y2K à la tenue. Les deux viennent de l’archive running d’ASICS et font partie des runners les plus demandées au Maroc, mais elles ne racontent pas la même chose une fois aux pieds. Voici leurs différences visibles, les coloris en ligne chez nous avec leurs pointures et leurs prix, les tenues qui leur vont et la méthode fiable pour la pointure. Nos paires sont des répliques Master Copy Premium 1:1, jamais présentées comme originales.",
    sections: [
      {
        heading: "En bref",
        body: [
          "La Gel-Kayano 14 superpose les couches, les découpes et les reflets métallisés. C’est la paire qu’on remarque en premier.",
          "La Gel-NYC reprend les codes des runners d’archive dans une silhouette plus calme, avec des tons crème, gris et blanc. C’est la runner du quotidien.",
          "Budget : 750 DH pour toutes les Kayano 14 chez nous, de 700 à 750 DH pour les Gel-NYC selon le coloris."
        ]
      },
      {
        heading: "Ce qui les rapproche",
        body: [
          "Deux runners basses d’ASICS au look rétro, avec le motif de bandes croisées sur le côté, des empiècements superposés et une semelle marquée qui rappelle la course à pied des années 2000.",
          "Deux paires qui se portent en ville, avec un jean comme avec un jogging, et qui prennent tout leur sens avec un bas un peu ample.",
          "Si vous aimez l’une, vous aimerez probablement l’autre. Le vrai choix se fait sur le niveau de détail que vous voulez voir à vos pieds, et sur la pointure disponible dans le coloris qui vous plaît."
        ]
      },
      {
        heading: "Ce qui les distingue à l’œil",
        body: [
          "La Kayano 14 est la plus graphique des deux. Elle multiplie les lignes, les pièces argentées et les contrastes entre le maillage et les renforts. Vue de profil, sa semelle paraît plus découpée et son talon plus travaillé. Elle a un côté technique assumé.",
          "La Gel-NYC mélange plusieurs lignes d’archive, mais dans des tons plus doux et avec moins de reflets. Ses formes sont plus arrondies, ses couleurs plus proches les unes des autres. Résultat : elle paraît plus sobre et se glisse sans effort dans une tenue minimaliste ou un peu habillée.",
          "En résumé : la Kayano 14 fait la tenue, la Gel-NYC l’accompagne."
        ],
        image: { src: "/products/asics-gel-kayano-14-arctic-sky-pure-silver-01.webp", alt: "ASICS Gel-Kayano 14 Arctic Sky Pure Silver, argent et bleu glacier" }
      },
      {
        heading: "Tableau comparatif",
        body: [
          "Comparaison visuelle et pratique des paires en ligne chez nous aujourd’hui."
        ],
        table: {
          head: ["Critère", "Gel-NYC", "Gel-Kayano 14"],
          rows: [
            ["Silhouette", "Plus arrondie, tons proches, peu de reflets", "Très découpée, pièces argentées, beaucoup de lignes"],
            ["Effet porté", "Sobre, facile, se fond dans la tenue", "Remarqué, Y2K, devient le point fort de la tenue"],
            ["Tenue idéale", "Jean droit, pantalon de tailleur, robe", "Baggy, cargo, jogging, jupe longue fluide"],
            ["Coloris en ligne", "Cream Oyster Grey, White Steel Grey, Arctic Sky Bleu Ciel, Black Graphite, Ivy Smoke Grey", "Arctic Sky Pure Silver, White Fjord Grey, Triple Black, Cream Black Metallic Plum, Cream Sweet Pink"],
            ["Pointures femme (36 à 40)", "3 coloris", "1 coloris (Cream Sweet Pink)"],
            ["Pointures homme (40 à 44)", "4 coloris", "4 coloris"],
            ["Prix chez nous", "700 à 750 DH", "750 DH"]
          ]
        }
      },
      {
        heading: "Les coloris en ligne chez nous",
        body: [
          "Gel-NYC : Cream Oyster Grey (crème et gris, 36 à 44, 700 DH), White Steel Grey (blanc et gris acier, 36 à 44, 750 DH), Arctic Sky Bleu Ciel (bleu ciel, 36 à 40, 750 DH), Black Graphite (noir, 40 à 44, 710 DH) et Ivy Smoke Grey (gris fumé, 40 à 44, 700 DH).",
          "Gel-Kayano 14 : Arctic Sky Pure Silver (argent et bleu glacier), White Fjord Grey (blanc et gris), Triple Black (noir total) et Cream Black Metallic Plum (crème, noir et prune métallisé), toutes en 40 à 44. Pour les petites pointures, la Cream Sweet Pink (crème et rose) est en ligne du 36 au 40. Toutes à 750 DH.",
          "Les deux coloris Gel-NYC qui vont du 36 au 44 sont les plus simples à offrir ou à partager dans un couple : même paire, deux pointures."
        ],
        image: { src: "/products/asics-gel-nyc-cream-oyster-grey-01.webp", alt: "ASICS Gel-NYC Cream Oyster Grey, crème et gris" }
      },
      {
        heading: "Gel-NYC ou Kayano 14 pour une femme",
        body: [
          "Côté femme, la Gel-NYC offre plus de choix : Cream Oyster Grey pour le neutre, White Steel Grey pour la lumière, Arctic Sky Bleu Ciel pour une couleur douce. C’est la plus facile à porter avec une robe chemise ou un pantalon large beige.",
          "La Kayano 14 Cream Sweet Pink est la bonne option si vous voulez une runner plus affirmée mais pas agressive : le crème et le rose adoucissent la silhouette chargée du modèle."
        ]
      },
      {
        heading: "Avec quelles tenues",
        body: [
          "Kayano 14 argent ou blanche : un jean baggy clair, un t-shirt blanc et une veste zippée. Les reflets de la chaussure suffisent, gardez le reste simple.",
          "Kayano 14 Triple Black : avec un cargo noir ou un jogging gris, pour un look entièrement sombre et net.",
          "Gel-NYC crème ou blanche : un pantalon de tailleur écru, un jean brut droit, ou une jupe midi. Elle apporte du confort visuel sans casser une tenue habillée.",
          "Gel-NYC noire ou grise : la paire de tous les jours pour l’hiver, avec un jean foncé et un manteau long."
        ]
      },
      {
        heading: "Checklist : laquelle pour moi ?",
        body: [
          "Je veux une paire qui se voit et j’aime les reflets argentés : Kayano 14.",
          "Je veux une seule runner pour le travail et le week-end : Gel-NYC Cream Oyster Grey ou White Steel Grey.",
          "Je chausse entre 36 et 39 : Gel-NYC (3 coloris) ou Kayano 14 Cream Sweet Pink.",
          "J’ai le budget le plus serré : Gel-NYC Cream Oyster Grey ou Ivy Smoke Grey à 700 DH.",
          "Je porte surtout du noir : Kayano 14 Triple Black ou Gel-NYC Black Graphite."
        ]
      },
      {
        heading: "Pointure et livraison",
        body: [
          "Mesurez la longueur de votre pied en centimètres, talon contre un mur, le soir quand le pied est un peu plus long. Gardez ce chiffre sous la main : lors de notre appel de confirmation, on vérifie la pointure de la paire fournie avant l’envoi. Les conseils de taille des modèles originaux ne s’appliquent pas forcément à une réplique, c’est pour cela qu’on ne se fie qu’à la mesure en centimètres.",
          "La livraison est gratuite partout au Maroc, en 12 à 48 heures après l’appel de confirmation. Aucun paiement en ligne. Si la pointure ne va pas, l’échange est possible sous 3 jours après la livraison, paire non portée et dans sa boîte d’origine, retour à votre charge."
        ]
      }
    ],
    links: [
      {
        label: "ASICS Gel-Kayano 14",
        href: "/collections/asics-gel-kayano-14"
      },
      {
        label: "ASICS Gel-NYC",
        href: "/collections/asics-gel-nyc"
      },
      {
        label: "Tout ASICS",
        href: "/collections/asics"
      },
      {
        label: "Retro Runners",
        href: "/collections/retro-runners"
      }
    ],
    published: "2026-09-26"
  },
  {
    slug: "new-balance-9060-ou-530",
    title: "New Balance 9060 ou 530 : laquelle choisir ?",
    description: "New Balance 9060 ou 530 : volume, style, coloris et façon de les porter. Le comparatif pour choisir sa New Balance au Maroc.",
    intro: "9060 si vous voulez une paire volumineuse qui se remarque, 530 si vous voulez une runner fine et lumineuse pour tous les jours. Ce sont deux New Balance très demandées au Maroc, mais elles n’ont presque rien en commun une fois aux pieds. Voici leurs différences visibles, les coloris en ligne chez nous, les tenues qui leur vont et la méthode fiable pour la pointure. Nos paires sont des répliques Master Copy Premium 1:1, jamais présentées comme originales.",
    sections: [
      {
        "heading": "En bref",
        "body": [
          "La 9060 a une semelle épaisse et sculptée qui donne du poids à la silhouette. C’est une paire statement.",
          "La 530 garde une ligne de runner des années 2000, plus fine, avec des touches argentées. Elle accompagne la tenue sans la dominer.",
          "Budget : la 530 est à 650 DH chez nous (720 DH pour la Steel Grey), la 9060 de 730 à 760 DH."
        ]
      },
      {
        "heading": "Ce qui les rapproche",
        "body": [
          "Deux runners inspirées de l’archive running de New Balance, avec le logo N sur le côté et des empiècements superposés.",
          "Deux paires confortables à l’œil pour marcher toute la journée en ville, qui se portent sans effort avec un jogging ou un jean.",
          "Et deux paires très présentes sur les réseaux, donc faciles à associer : on trouve partout des idées de tenues."
        ]
      },
      {
        "heading": "Ce qui les distingue à l’œil",
        "body": [
          "La 9060 attire le regard par sa semelle : épaisse, ondulée, avec un talon qui ressort. Vue de profil, elle paraît plus haute et plus massive. Elle élargit le bas de la silhouette.",
          "La 530 est plus basse et plus effilée. Son maillage clair et ses reflets argentés lui donnent un côté lumineux. Elle affine le pied au lieu de l’alourdir.",
          "En résumé : la 9060 est la paire qu’on remarque en premier, la 530 celle qui complète la tenue."
        ],
        "image": {
          "src": "/products/new-balance-9060-white-taro-01.webp",
          "alt": "New Balance 9060 White Taro"
        }
      },
      {
        "heading": "Tableau comparatif",
        "body": [
          "Comparaison visuelle et pratique des paires en ligne chez nous."
        ],
        "table": {
          "head": [
            "Critère",
            "9060",
            "530"
          ],
          "rows": [
            [
              "Silhouette",
              "Volumineuse, semelle épaisse et sculptée",
              "Fine, basse, profil de runner"
            ],
            [
              "Effet porté",
              "Statement, élargit le bas",
              "Léger, lumineux, affine le pied"
            ],
            [
              "Bas idéal",
              "Jogging, cargo, jean baggy",
              "Jean droit ou clair, short, robe"
            ],
            [
              "Coloris en ligne",
              "White Taro, Black Castlerock Grey, Crystal Pink",
              "White Blue, White Silver Sky Blue, Steel Grey"
            ],
            [
              "Pointures en ligne",
              "36 à 44 selon le coloris",
              "36 à 44 selon le coloris"
            ],
            [
              "Prix chez nous",
              "730 à 760 DH",
              "650 DH, 720 DH pour la Steel Grey"
            ]
          ]
        }
      },
      {
        "heading": "Les coloris en ligne chez nous",
        "body": [
          "9060 : White Taro (blanc et violet doux, 38 à 44), Black Castlerock Grey (noir et gris, 40 à 44) et Crystal Pink (rose pâle, 36 à 40).",
          "530 : White Blue (blanc et bleu, 36 à 44), White Silver Metallic Sky Blue (36 à 40) et Steel Grey (gris acier, 40 à 44).",
          "Les deux modèles couvrent donc les tailles femme et homme, mais chaque coloris a sa propre plage : vérifiez-la sur la fiche."
        ],
        "image": {
          "src": "/products/new-balance-mr530sg-white-blue-01.webp",
          "alt": "New Balance 530 blanc et bleu"
        }
      },
      {
        "heading": "Avec quelles tenues",
        "body": [
          "9060 : elle a besoin d’un bas large pour garder l’équilibre. Jogging en molleton, cargo, jean baggy qui tombe sur la chaussure. Avec un pantalon slim, elle paraît trop massive.",
          "530 : elle suit presque tout. Jean clair droit, short en été, robe chemise ou jupe midi pour un contraste sport et chic.",
          "Astuce couleur : une 9060 noire calme une tenue chargée, une 530 blanche et argent éclaire une tenue sombre."
        ]
      },
      {
        "heading": "Checklist : laquelle pour moi ?",
        "body": [
          "Je porte surtout des coupes larges et j’aime les paires qui se voient : 9060.",
          "Je veux une runner discrète pour tous les jours : 530.",
          "Je porte souvent des robes ou des jupes : 530, plus légère visuellement.",
          "J’ai un budget serré : 530 à 650 DH.",
          "Je veux une seule paire sombre et solide pour l’hiver : 9060 Black Castlerock Grey."
        ]
      },
      {
        "heading": "Pointure : ne pas se tromper",
        "body": [
          "Mesurez la longueur de votre pied en centimètres, talon contre un mur, le soir quand le pied est un peu plus long. Gardez ce chiffre sous la main : lors de notre appel de confirmation, on vérifie la pointure de la paire fournie avant l’envoi. Les conseils de taille des modèles originaux ne s’appliquent pas forcément à une réplique, c’est pour cela qu’on ne se fie qu’à la mesure en centimètres.",
          "La livraison est gratuite partout au Maroc, en 12 à 48 heures après l’appel de confirmation. Aucun paiement en ligne. Si la pointure ne va pas, l’échange est possible sous 3 jours après la livraison, paire non portée et dans sa boîte d’origine, retour à votre charge."
        ]
      }
    ],
    links: [{"label": "New Balance 9060", "href": "/collections/new-balance-9060"}, {"label": "New Balance 530", "href": "/collections/new-balance-530"}, {"label": "Tout New Balance", "href": "/collections/new-balance"}, {"label": "Retro Runners", "href": "/collections/retro-runners"}],
    published: "2026-09-26"
  },
  {
    slug: "sneakers-femme-tendance-maroc",
    title: "Sneakers femme tendance au Maroc en 2026",
    description: "Les sneakers et baskets femme tendance au Maroc en 2026 : silhouettes basses, runners d’archive, coloris crème et argent, et comment les porter.",
    intro: "Les sneakers femme qui se portent au Maroc en 2026 tiennent en deux familles : les silhouettes basses et fines (Samba, Handball Spezial, Gazelle) et les runners d’archive au look rétro (Gel-NYC, Vomero 5, New Balance 530). Côté couleurs, le crème, l’argent et les tons poudrés dominent. Voici les six modèles qui reviennent le plus, avec quoi les porter, comment choisir une paire confortable pour la journée et comment trouver la bonne pointure. Tous les coloris cités sont en ligne chez nous, en répliques Master Copy Premium 1:1, jamais présentées comme originales.",
    sections: [
      {
        heading: "Les six modèles qui se portent",
        body: [
          "adidas Samba : la plus polyvalente. Fine, basse, bout allongé, elle va avec un jean droit comme avec une jupe longue. En ligne pour femme : Vegan White Gum (blanc et gomme), Core White Halo Blue, Pony Hair Wonder White, et deux versions fortes, Cow Print et Leopard. 700 DH, 750 DH pour les motifs.",
          "adidas Handball Spezial : même famille que la Samba, en plus arrondie et plus colorée. On la choisit pour sa couleur : Light Blue, Silver Violet, Silver Green Magic ou Shadow Brown Alumina, toutes à 700 DH, du 36 au 40.",
          "adidas Gazelle : la terrace au daim bien visible, avec des bandes contrastées. La Gazelle Indoor Green et la Grey Three à détails dorés sont à 650 DH. Les versions Bold Cream Collegiate Green et Bold Core Black White (720 DH) ont une semelle superposée nettement plus haute, pratique pour gagner un peu de hauteur sans talon.",
          "ASICS Gel-NYC : la runner d’archive la plus facile à porter. Cream Oyster Grey (700 DH), White Steel Grey et Arctic Sky Bleu Ciel (750 DH). Elle adoucit une tenue habillée sans la rendre trop sportive.",
          "Nike Vomero 5 : plus de volume, beaucoup de maillage et de superpositions. Pale Ivory & Sand Drift et White & Vast Grey à 660 DH, Photon Dust Pink Foam à 680 DH. C’est la paire des tenues oversize.",
          "New Balance 530 : fine, lumineuse, avec des touches argentées. White Silver Metallic Sky Blue et White Blue à 650 DH, l’une des runners les plus abordables de la sélection."
        ],
        image: { src: "/products/adidas-handball-spezial-w-silver-violet-01.webp", alt: "adidas Handball Spezial Silver Violet, argent et violet" }
      },
      {
        heading: "Tableau : quel modèle, avec quoi le porter",
        body: [
          "Un repère rapide pour associer chaque paire à votre garde-robe."
        ],
        table: {
          head: ["Modèle", "Style", "Avec quoi le porter", "Prix chez nous"],
          rows: [
            ["Samba", "Terrace fine et graphique", "Jean droit, pantalon à pinces, jupe longue", "700 à 750 DH"],
            ["Handball Spezial", "Terrace douce et colorée", "Jean clair, pantalon crème, jupe satinée", "700 DH"],
            ["Gazelle Indoor", "Terrace en daim, version Bold plus haute", "Jean brut, pull maille, robe pull", "650 à 720 DH"],
            ["Gel-NYC", "Runner rétro sobre", "Tailleur écru, robe chemise, jean droit", "700 à 750 DH"],
            ["Vomero 5", "Runner volumineuse", "Jogging, baggy, sweat oversize", "660 à 680 DH"],
            ["New Balance 530", "Runner fine et argentée", "Short, robe d’été, jean clair", "650 DH"]
          ]
        }
      },
      {
        heading: "Argent, crème et neutres : les coloris qui dominent",
        body: [
          "L’argent est la couleur que l’on voit le plus chez les femmes qui suivent la tendance. Il éclaire une tenue sombre et se marie bien avec les bijoux dorés comme argentés. Chez nous : Handball Spezial Silver Violet et Silver Green Magic, New Balance 530 White Silver Metallic Sky Blue, et la Gazelle Indoor Grey Three avec ses détails dorés métallisés.",
          "Le crème et le beige sont la valeur sûre. Ils vont avec le blanc, le camel, le kaki et le denim. Chez nous : Vomero 5 Pale Ivory & Sand Drift, Gel-NYC Cream Oyster Grey, Samba Pony Hair Wonder White et Gazelle Indoor Bold Cream Collegiate Green.",
          "Les tons poudrés (rose pâle, bleu ciel) donnent une touche plus féminine sans être criards : Vomero 5 Photon Dust Pink Foam, Gel-NYC Arctic Sky Bleu Ciel, Kayano 14 Cream Sweet Pink ou New Balance 9060 Crystal Pink.",
          "Pour affirmer, deux options : le bordeaux de la New Balance 550 White Burgundy, ou les motifs de la Samba Leopard et de la Samba Cow Print."
        ],
        image: { src: "/products/nike-zoom-vomero-5-pale-ivory-sand-drift-01.webp", alt: "Nike Zoom Vomero 5 Pale Ivory & Sand Drift, crème et sable" }
      },
      {
        heading: "Confortables au quotidien : comment choisir",
        body: [
          "On ne vous promettra pas d’amorti ni de technologie : nos paires sont des répliques et nous ne décrivons que ce qui se voit. En revanche, quelques repères simples aident à choisir une paire pour marcher toute la journée.",
          "Si vous marchez beaucoup en ville, les runners (Gel-NYC, Vomero 5, 530) ont une semelle plus épaisse et une tige plus enveloppante que les terraces. Les silhouettes basses comme la Samba ou la Spezial sont plus plates et plus fines : parfaites pour le bureau ou une sortie, un peu moins pour une journée entière debout.",
          "Le confort vient d’abord de la bonne longueur. Une paire trop juste fait mal quel que soit le modèle. Portez vos nouvelles paires quelques heures à la maison avant une longue journée.",
          "Pour les tenues, notre guide sur les sneakers avec un pantalon large, une robe ou un costume détaille les associations qui marchent."
        ]
      },
      {
        heading: "Petites pointures : ce qui est disponible",
        body: [
          "La plupart des paires femme sont en ligne du 36 au 40. Certains coloris vont plus haut, jusqu’au 44 : Samba Vegan White Gum, Gel-NYC Cream Oyster Grey et White Steel Grey, New Balance 530 White Blue. Les pointures disponibles sont indiquées sur chaque fiche.",
          "Pour trouver la bonne, mesurez la longueur de votre pied en centimètres, talon contre un mur, le soir quand le pied est un peu plus long. Gardez ce chiffre sous la main : lors de notre appel de confirmation, on vérifie la pointure de la paire fournie avant l’envoi. Les conseils de taille des modèles originaux ne s’appliquent pas forcément à une réplique."
        ]
      },
      {
        heading: "Checklist avant de commander",
        body: [
          "Je connais la longueur de mon pied en centimètres.",
          "J’ai vérifié que ma pointure est en ligne dans le coloris choisi.",
          "Je sais avec quelles tenues je vais la porter : basse et fine, ou runner plus volumineuse.",
          "Je choisis une couleur qui va avec au moins trois pièces de ma garde-robe.",
          "Je garde mon téléphone à portée de main pour l’appel de confirmation."
        ]
      },
      {
        heading: "Livraison et échange",
        body: [
          "La commande se fait sur le site, puis on vous appelle pour confirmer le modèle, la pointure et l’adresse. Aucun paiement en ligne. La livraison est gratuite partout au Maroc, en 12 à 48 heures après la confirmation.",
          "Si la pointure ne va pas, l’échange est possible sous 3 jours après la livraison, paire non portée et dans sa boîte d’origine, retour à votre charge."
        ]
      }
    ],
    links: [
      {
        label: "Sneakers femme",
        href: "/collections/femme"
      },
      {
        label: "Sneakers low profile",
        href: "/collections/low-profile"
      },
      {
        label: "Nike Vomero 5",
        href: "/collections/nike-vomero-5"
      },
      {
        label: "ASICS Gel-NYC",
        href: "/collections/asics-gel-nyc"
      }
    ],
    published: "2026-09-26"
  },
  {
    slug: "sneakers-homme-tendance-maroc",
    title: "Sneakers homme tendance au Maroc en 2026",
    description: "Les sneakers et baskets homme tendance au Maroc en 2026 : runners Y2K, classiques du basket, silhouettes techniques, et comment les associer.",
    intro: "Côté homme, trois directions se partagent la rue cette année. Voici comment choisir selon votre style.",
    sections: [
      {
        heading: "Les runners Y2K",
        body: [
          "Kayano 14, 9060, Vomero 5 : volume, superpositions, reflets métallisés. À porter avec un baggy, un cargo ou un jogging large."
        ]
      },
      {
        heading: "Les classiques du basket",
        body: [
          "Dunk Low, Air Jordan 1 et 4, New Balance 550 : cuir, blocs de couleur, semelle plate. La base du vestiaire streetwear."
        ]
      },
      {
        heading: "Les silhouettes techniques",
        body: [
          "Air Max Dn, On, Adizero : des lignes récentes venues du running, à porter avec du nylon, un cargo ou un total look sombre."
        ]
      },
      {
        heading: "Pointures",
        body: [
          "Notre sélection homme va du 40 au 47. Mesurez la longueur de votre pied en centimètres et gardez-la sous la main : lors de notre appel de confirmation, on vérifie la pointure de la paire fournie avant l’envoi. Les conseils de taille des modèles originaux ne s’appliquent pas forcément à une réplique."
        ]
      }
    ],
    links: [
      {
        label: "Sneakers homme",
        href: "/collections/homme"
      },
      {
        label: "Basketball",
        href: "/collections/basketball"
      },
      {
        label: "New Balance 9060",
        href: "/collections/new-balance-9060"
      },
      {
        label: "Tech Runners",
        href: "/collections/tech-runners"
      }
    ],
    published: "2026-09-26"
  },
  {
    slug: "comment-choisir-ses-sneakers",
    title: "Comment choisir ses sneakers : le guide simple",
    description: "Comment choisir ses sneakers ou baskets : silhouette, coloris, pointure, usage. Cinq questions à se poser avant d’acheter, avec des exemples concrets.",
    intro: "Avant de choisir une paire, cinq questions suffisent. Elles évitent l’achat qu’on ne porte jamais.",
    sections: [
      {
        heading: "1. Quelle silhouette pour votre style ?",
        body: [
          "Style minimaliste ou habillé : une silhouette basse (Samba, Gazelle).",
          "Style streetwear : une paire basket (Dunk, Jordan 1).",
          "Style sportif ou Y2K : une runner (Kayano 14, 9060, Vomero 5)."
        ]
      },
      {
        heading: "2. Quel coloris porter le plus souvent ?",
        body: [
          "Pour une première paire, choisissez un neutre : blanc, crème, noir ou gris. Gardez les coloris forts pour la deuxième paire."
        ]
      },
      {
        heading: "3. Quel volume ?",
        body: [
          "Une paire volumineuse demande un bas ample. Une paire fine s’accorde avec tout, y compris les coupes ajustées."
        ]
      },
      {
        heading: "4. Quelle pointure ?",
        body: [
          "Mesurez la longueur de votre pied en centimètres et gardez-la sous la main : lors de notre appel de confirmation, on vérifie la pointure de la paire fournie avant l’envoi. Les conseils de taille des modèles originaux ne s’appliquent pas forcément à une réplique."
        ]
      },
      {
        heading: "5. Quel entretien ?",
        body: [
          "Le daim demande une brosse et de l’attention, le cuir lisse se nettoie facilement, le mesh se lave doucement. Voyez notre guide d’entretien."
        ]
      }
    ],
    links: [
      {
        label: "Toutes les sneakers",
        href: "/collections/nouveautes"
      },
      {
        label: "Guide des pointures",
        href: "/guides/quelle-pointure-choisir-sneakers"
      },
      {
        label: "Entretenir ses sneakers",
        href: "/guides/entretenir-ses-sneakers"
      }
    ],
    published: "2026-09-26"
  },
  {
    slug: "porter-sneakers-pantalon-large-robe",
    title: "Porter des sneakers avec un pantalon large, une robe ou un costume",
    description: "Comment porter des sneakers avec un pantalon large, une robe, une jupe longue ou un costume : quelles paires choisir et les erreurs à éviter.",
    intro: "Les sneakers se portent aujourd’hui avec tout. Encore faut-il accorder le volume de la paire à celui de la tenue.",
    sections: [
      {
        heading: "Avec un pantalon large",
        body: [
          "Le pantalon doit tomber sur la chaussure. Une paire fine (Samba, Spezial) crée un contraste élégant ; une runner volumineuse (9060, Kayano 14) donne une silhouette plus streetwear."
        ]
      },
      {
        heading: "Avec une robe ou une jupe longue",
        body: [
          "Choisissez une paire basse et claire : Samba blanc et gomme, Gel-NYC crème, 530 argent. Elle allège la tenue sans la casser."
        ]
      },
      {
        heading: "Avec un costume ou un tailleur",
        body: [
          "Une paire sobre, en cuir ou en tons neutres. Le contraste sport et habillé fonctionne quand la chaussure reste simple."
        ]
      },
      {
        heading: "Les erreurs à éviter",
        body: [
          "Une paire très volumineuse sous un pantalon étroit, des coloris qui se battent avec la tenue, des lacets trop serrés qui déforment la paire."
        ]
      }
    ],
    links: [
      {
        label: "Sneakers low profile",
        href: "/collections/low-profile"
      },
      {
        label: "Retro Runners",
        href: "/collections/retro-runners"
      },
      {
        label: "Sneakers femme",
        href: "/collections/femme"
      },
      {
        label: "Sneakers homme",
        href: "/collections/homme"
      }
    ],
    published: "2026-09-26"
  },
  {
    slug: "sneakers-pied-large",
    title: "Sneakers et pied large : comment bien choisir",
    description: "Pied large : comment choisir ses sneakers, quelles silhouettes éviter, comment mesurer la largeur de son pied et bien confirmer sa pointure avant de commander.",
    intro: "Avec un pied large, la bonne longueur ne suffit pas : la forme de la paire compte autant que la pointure.",
    sections: [
      {
        heading: "Mesurez aussi la largeur",
        body: [
          "Posez le pied sur une feuille, tracez son contour et mesurez la partie la plus large, au niveau des orteils. Envoyez-nous la longueur et la largeur sur WhatsApp."
        ]
      },
      {
        heading: "Les formes qui conviennent souvent mieux",
        body: [
          "Les silhouettes basket et les runners à l’avant arrondi laissent en général plus de place que les silhouettes terrace, fines et allongées. Ce sont des tendances de forme, à confirmer sur la paire fournie."
        ]
      },
      {
        heading: "Les bons réflexes",
        body: [
          "Desserrez les premiers œillets du laçage. Évitez les chaussettes épaisses si la paire est ajustée. Ne choisissez pas une pointure plus grande par défaut : la chaussure glisserait au talon."
        ]
      },
      {
        heading: "On confirme avant l’envoi",
        body: [
          "Mesurez la longueur de votre pied en centimètres et gardez-la sous la main : lors de notre appel de confirmation, on vérifie la pointure de la paire fournie avant l’envoi. Les conseils de taille des modèles originaux ne s’appliquent pas forcément à une réplique."
        ]
      }
    ],
    links: [
      {
        label: "Guide des pointures",
        href: "/guides/quelle-pointure-choisir-sneakers"
      },
      {
        label: "Basketball",
        href: "/collections/basketball"
      },
      {
        label: "Retro Runners",
        href: "/collections/retro-runners"
      }
    ],
    published: "2026-09-26"
  },
  {
    slug: "vomero-5-ou-p-6000",
    title: "Nike Vomero 5 ou P-6000 : laquelle choisir ?",
    description: "Vomero 5 ou P-6000 : silhouette, volume, allure, tenues et pointure. Le comparatif clair pour choisir sa runner Nike au Maroc.",
    intro: "En bref : prenez la Vomero 5 si vous voulez une runner généreuse, douce et très visible ; prenez la P-6000 si vous cherchez une ligne plus fine, plus métallique et plus facile à glisser dans une tenue de tous les jours. Les deux viennent de l’archive running de Nike et on nous demande sans arrêt laquelle choisir. Voici comment trancher, sans jargon.",
    published: "2026-09-26",
    sections: [
      {
        heading: "Ce qui les rapproche",
        body: [
          "La Vomero 5 et la P-6000 appartiennent à la même famille : celle des runners du début des années 2000 revenues en ville. Même idée de départ, une chaussure de course reprise comme sneaker de mode, avec du mesh, des renforts superposés et des touches argentées qui accrochent la lumière.",
          "Les deux jouent la carte Y2K et remplacent aujourd’hui la sneaker blanche trop sage dans beaucoup de garde-robes. Elles se portent avec les mêmes pièces : pantalon ample, jean large, jupe longue, short avec chaussettes hautes. Si vous aimez l’une, l’autre vous plaira aussi. La vraie question est l’allure que vous recherchez.",
          "Précision importante : nos paires sont des répliques (qualité Master Copy Premium 1:1), pas des originales. Ce comparatif parle de forme, de style et de manière de les porter, pas de performance de course.",
        ],
      },
      {
        heading: "Ce qui les distingue à l’œil",
        body: [
          "La Vomero 5 a plus de volume. Sa semelle est plus épaisse et plus travaillée, avec des éléments sculptés visibles sur le côté, et la tige multiplie les couches. Posée au sol, elle paraît plus haute et plus massive : c’est une chaussure qui se remarque et qui structure toute la tenue autour d’elle.",
          "La P-6000 est plus allongée et plus basse. Les superpositions sont nombreuses, mais la silhouette reste fine, avec un profil qui file vers l’avant. L’argent y est souvent plus présent, ce qui lui donne un côté plus métallique et plus nerveux.",
          "Résultat : la Vomero 5 donne une allure plus douce et plus imposante, la P-6000 une allure plus légère et plus graphique. Sur un pied fin ou une petite pointure, la P-6000 alourdit moins la silhouette. Si vous aimez les sneakers qui ont du coffre, la Vomero 5 est faite pour vous.",
        ],
      },
      {
        heading: "Le tableau comparatif",
        body: ["Ce que l’on voit et ce que l’on ressent en les portant, point par point."],
        table: {
          head: ["Critère", "Nike Vomero 5", "Nike P-6000"],
          rows: [
            ["Volume", "Généreux, semelle épaisse", "Plus fin, profil allongé"],
            ["Allure", "Douce, imposante, très Y2K", "Nerveuse, métallique, rétro"],
            ["Se remarque", "Beaucoup : c’est la pièce forte", "Oui, mais s’intègre plus facilement"],
            ["Coloris chez nous", "Ivoire et sable, blanc et gris, rose poudré, tons terre, voile et orange", "Argent et blanc, noir et blanc, violet platine, rose délavé"],
            ["Pour qui", "Ceux qui aiment les baskets volumineuses", "Ceux qui veulent une runner du quotidien"],
            ["Tenue idéale", "Baggy, cargo, jupe longue", "Jean droit ou large, jogging, jupe en jean"],
            ["Pointure", "Mesure du pied en cm, confirmée par téléphone", "Mesure du pied en cm, confirmée par téléphone"],
          ],
        },
      },
      {
        heading: "Les coloris : par où commencer",
        body: [
          "Pour une première paire de Vomero 5, les tons ivoire et sable ou blanc et gris sont les plus simples : ils adoucissent le volume et vont avec le denim comme avec le beige. Le rose poudré apporte de la fraîcheur à une tenue neutre ; les tons terre sont parfaits pour l’automne avec du marron, du kaki ou du noir.",
          "Pour la P-6000, l’argent et blanc est le choix le plus polyvalent, celui qui résume le mieux l’esprit du modèle. Le noir et blanc passe partout, y compris le soir. Le violet platine et le rose délavé sont plus doux et donnent une touche de couleur sans crier.",
          "Une règle simple quel que soit le modèle : plus la paire est chargée, plus le reste de la tenue doit être calme. Un t-shirt uni, un bon pantalon, et la chaussure fait le travail.",
        ],
      },
      {
        heading: "Avec quelles tenues",
        body: [
          "Vomero 5 : jouez sur les volumes. Un baggy ou un cargo qui tombe sur la chaussure, un sweat un peu large, et la silhouette reste équilibrée. Côté féminin, la jupe longue ou le pantalon de tailleur ample crée un joli contraste entre la chaussure technique et une pièce plus habillée. En été, short et chaussettes hautes blanches.",
          "P-6000 : elle supporte plus de choses. Jean droit, jogging, jupe en jean, pantalon à pinces : sa ligne fine ne demande pas forcément un bas volumineux. C’est la meilleure des deux pour une tenue de bureau décontractée ou un look simple de tous les jours.",
          "À éviter dans les deux cas : le slim très serré qui s’arrête au-dessus de la cheville. Il accentue le volume de la chaussure et coupe la jambe.",
        ],
      },
      {
        heading: "Checklist : laquelle pour moi ?",
        body: [
          "Vous voulez que vos baskets soient la pièce forte de la tenue : Vomero 5.",
          "Vous portez surtout des pantalons larges et des baggys : Vomero 5.",
          "Vous voulez une paire à porter tous les jours, au travail comme le week-end : P-6000.",
          "Vous avez une petite pointure ou un pied fin et craignez l’effet « gros pied » : P-6000.",
          "Vous aimez les reflets argentés et l’esprit rétro running : P-6000.",
          "Vous hésitez encore : regardez vos cinq pantalons les plus portés. S’ils sont amples, Vomero 5 ; s’ils sont droits, P-6000.",
        ],
      },
      {
        heading: "Pointure : ne pas se tromper",
        body: [
          "Ne vous fiez pas aux conseils de taille lus ailleurs pour les modèles originaux : ils ne s’appliquent pas forcément à une réplique. La méthode fiable est simple. Posez votre pied sur une feuille contre un mur, marquez le point le plus long, et mesurez en centimètres, le soir de préférence. Gardez cette mesure sous la main.",
          "Après votre commande sur le site, on vous appelle pour la confirmer : c’est à ce moment que l’on vérifie la pointure de la paire fournie avant l’envoi. Aucun paiement en ligne, et la livraison est gratuite partout au Maroc en 12 à 48 h après confirmation.",
          "Si la paire ne va pas, l’échange de pointure est possible sous 3 jours après la livraison : paire non portée, dans sa boîte d’origine, retour à votre charge. Le guide des pointures détaille la mesure pas à pas.",
        ],
      },
    ],
    links: [
      { label: "Nike Vomero 5", href: "/collections/nike-vomero-5" },
      { label: "Nike P-6000", href: "/collections/nike-p-6000" },
      { label: "Retro Runners", href: "/collections/retro-runners" },
      { label: "Tout Nike", href: "/collections/nike" },
    ],
  },
];

export const GUIDE_BY_SLUG = new Map(GUIDES.map((g) => [g.slug, g]));

// Un guide trop court (contenu mince) reste lisible mais n'est ni indexé ni
// dans le sitemap tant qu'il n'a pas été enrichi (SEO/REGLES.md : 700 mots).
export const MIN_INDEXABLE_WORDS = 600;
export function guideWords(g: Guide) {
  return [g.intro, ...g.sections.flatMap((s) => [s.heading, ...s.body, ...(s.table?.rows.flat() ?? [])])].join(" ").split(/\s+/).filter(Boolean).length;
}
export const isIndexableGuide = (g: Guide) => guideWords(g) >= MIN_INDEXABLE_WORDS;
