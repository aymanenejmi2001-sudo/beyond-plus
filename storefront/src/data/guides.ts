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
    slug: "samba-ou-gazelle",
    title: "Samba ou Gazelle : laquelle choisir ?",
    description: "Samba ou Gazelle : silhouette, coloris, prix au Maroc et façon de les porter. Le comparatif simple pour choisir entre les deux sneakers terrace.",
    intro: "Samba si vous cherchez la ligne la plus fine et la plus sobre, Gazelle si vous voulez une allure un peu plus ronde, plus rétro et plus colorée. Les deux viennent du sport en salle, ont trois bandes et une semelle en gomme, et on les confond souvent en photo. Portées, elles ne racontent pourtant pas la même chose. Voici les vraies différences, les coloris disponibles chez BEYOND PLUS et nos conseils pour choisir. Nos paires sont des répliques high copy, jamais présentées comme originales.",
    published: "2026-09-29",
    sections: [
      {
        heading: "En bref",
        body: [
          "La Samba est la plus basse et la plus allongée des deux. Son bout en T contrasté et sa ligne fine en font la paire passe-partout par excellence.",
          "La Gazelle est un peu plus ronde à l’avant, avec des bandes plus larges et plus contrastées. Elle donne un effet plus rétro, années 70, et assume davantage la couleur.",
          "Budget chez BEYOND PLUS : la Samba de 500 à 750 DH selon le coloris, la Gazelle de 650 à 720 DH, livraison gratuite partout au Maroc.",
        ],
      },
      {
        heading: "Tableau comparatif",
        body: ["Ce que l’on voit et ce que l’on ressent au quotidien, pour les paires en ligne chez nous."],
        table: {
          head: ["Critère", "Samba", "Gazelle"],
          rows: [
            ["Silhouette", "Très basse, allongée, bout plus pointu", "Un peu plus ronde et plus haute à l’avant"],
            ["Bandes", "Fines, discrètes sur les versions claires", "Plus larges, souvent en couleur contrastée"],
            ["Effet porté", "Net, graphique, allonge la jambe", "Rétro, décontracté, plus coloré"],
            ["Coloris chez nous", "Blanc et gomme, noir, bleu halo, léopard, vache", "Crème et vert, noir et blanc, vert, gris et or"],
            ["Versions épaisses", "Non", "Oui, la Gazelle Bold (semelle plus haute)"],
            ["Prix BEYOND PLUS", "500 à 750 DH", "650 à 720 DH"],
          ],
        },
      },
      {
        heading: "La Samba : la valeur sûre",
        image: { src: "/products/adidas-samba-vegan-white-gum-01.webp", alt: "adidas Samba Vegan blanc et gomme, vue de profil" },
        body: [
          "Si vous ne deviez avoir qu’une paire terrace, ce serait elle. La Samba blanc et gomme va avec un jean clair, un pantalon noir à pinces, une jupe longue ou un short en été. La noire est encore plus facile à vivre : elle reste propre plus longtemps et passe avec une tenue plus habillée.",
          "Les versions à motif, léopard ou vache, servent de pièce forte : on les porte avec une tenue neutre, jean brut et haut uni, pour que la chaussure fasse tout le travail.",
          "Côté forme, la Samba chausse près du pied et reste très basse. C’est ce qui lui donne sa finesse, mais c’est aussi pour cela qu’il faut bien mesurer son pied avant de commander.",
        ],
      },
      {
        heading: "La Gazelle : plus rétro, plus de couleur",
        image: { src: "/products/adidas-gazelle-indoor-bold-cream-collegiate-green-01.webp", alt: "adidas Gazelle Indoor Bold crème et vert collegiate" },
        body: [
          "La Gazelle se remarque d’abord par ses bandes : larges, souvent vertes, bleues ou noires sur une base claire. Elle apporte de la couleur sans être criarde, et donne tout de suite une allure années 70 à une tenue simple.",
          "La version Bold pose la même tige sur une semelle plus épaisse. Elle gagne quelques centimètres et équilibre mieux les pantalons très larges et les robes longues, ce que la Samba, très plate, fait moins bien.",
          "Chez nous, quatre coloris : crème et vert collegiate, noir et blanc, vert franc, et gris, blanc et or pour une version plus lumineuse.",
        ],
      },
      {
        heading: "Laquelle choisir selon votre style",
        body: [
          "Vous voulez une paire pour tout faire, du bureau au week-end : la Samba blanche ou noire.",
          "Vous portez beaucoup de bas larges, cargo ou baggy : la Gazelle Bold, dont la semelle plus haute tient mieux le volume.",
          "Vous aimez la couleur : la Gazelle crème et vert, ou la Samba bleu halo pour rester plus discret.",
          "Vous cherchez une pièce qui se remarque : la Samba léopard ou vache.",
          "Vous hésitez encore : regardez aussi la Handball Spezial, la troisième terrace, en daim et en couleurs franches. Notre comparatif Samba ou Handball Spezial détaille les différences.",
        ],
      },
      {
        heading: "Pointure : la méthode qui évite les échanges",
        body: [
          "Mesurez votre pied en centimètres, talon contre un mur, en fin de journée et avec vos chaussettes. Choisissez votre pointure habituelle parmi celles affichées sur la fiche, puis donnez-nous votre mesure : on confirme la pointure par téléphone avant l’envoi.",
          "Samba comme Gazelle ne sont proposées qu’en pointures entières. Si vous avez le pied large, dites-le lors de l’appel : on vous conseille sur la paire la plus adaptée. Et si la pointure ne va pas, l’échange est possible sous 3 jours après la livraison, paire non portée et dans sa boîte d’origine.",
        ],
      },
      {
        heading: "Checklist avant de commander",
        body: [
          "1. Choisir la silhouette : fine (Samba) ou plus ronde (Gazelle).",
          "2. Choisir la couleur selon vos tenues les plus portées.",
          "3. Mesurer son pied en centimètres.",
          "4. Vérifier la pointure disponible sur la fiche.",
          "5. Commander : on vous appelle pour confirmer, livraison gratuite en 12 à 48 h après confirmation.",
        ],
      },
    ],
    links: [
      { label: "adidas Samba au Maroc", href: "/collections/adidas-samba" },
      { label: "adidas Gazelle au Maroc", href: "/collections/adidas-gazelle" },
      { label: "Sneakers low profile", href: "/collections/low-profile" },
      { label: "Samba ou Handball Spezial ?", href: "/guides/samba-ou-handball-spezial" },
    ],
  },
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
    description: "Low profile, runners d’archive, runners techniques, argent et tons doux : les tendances sneakers 2026, les modèles, les prix au Maroc et comment les porter.",
    intro: "En 2026, quatre familles de sneakers tiennent la rue : les silhouettes basses façon terrace (Samba, Handball Spezial, Gazelle), les runners d’archive des années 2000 (Gel-Kayano 14, Vomero 5, 9060), les runners techniques portés en ville (Air Max Dn, On Cloudtilt, Adizero) et, toujours là, les classiques du basket (Dunk Low, Jordan 1, 550). Côté couleurs, l’argent, le crème et les gris clairs prennent la place du blanc pur. Ce guide explique ce qui définit chaque tendance, ce qu’elle coûte chez BEYOND PLUS et comment l’adopter sans acheter une paire qu’on ne portera plus dans un an. Nos paires sont des répliques high copy, jamais présentées comme originales.",
    published: "2026-09-24",
    sections: [
      {
        heading: "1. Les silhouettes basses : la tendance la plus facile",
        image: { src: "/products/adidas-handball-spezial-silver-green-magic-01.webp", alt: "adidas Handball Spezial Silver Green Magic, vue de profil" },
        body: [
          "Après des années de semelles épaisses, la sneaker redescend. Semelle fine en gomme, empeigne en daim ou en cuir, bout allongé : c’est l’esprit terrace, venu du sport en salle et adopté par les tribunes de foot anglaises. La Samba en est le symbole, la Handball Spezial en est la version plus colorée, la Gazelle la version plus ronde et plus rétro.",
          "Pourquoi elle dure : une paire basse ne décide pas de la tenue à votre place. Elle passe avec un jean droit, un pantalon à pinces, une jupe longue, une robe ou un short. C’est la tendance qui vieillit le moins mal, parce que ces modèles existent depuis des décennies.",
          "Ce qui change en 2026 : les coloris. Le blanc et gomme reste la base, mais les versions argent, bleu clair, marron ou à motif (léopard, vache) sont celles qui donnent l’effet « de la saison ».",
        ],
      },
      {
        heading: "2. Les runners d’archive : le volume assumé",
        image: { src: "/products/asics-gel-kayano-14-arctic-sky-pure-silver-01.webp", alt: "ASICS Gel-Kayano 14 Arctic Sky Pure Silver" },
        body: [
          "Mesh aéré, renforts superposés, touches métallisées et semelle marquée : les modèles de running des années 2000 sont devenus des sneakers de ville. La Gel-Kayano 14 et la Gel-NYC chez ASICS, la Vomero 5 et la P-6000 chez Nike, la 9060, la 530 et la 1906R chez New Balance.",
          "Elles apportent du volume à une tenue simple : un jogging droit, un cargo, un jean large, une robe en maille. Ce sont des paires qu’on choisit aussi pour le confort de marche, d’où leur succès pour les longues journées.",
          "Le piège : les porter avec un pantalon très étroit, qui fait paraître le pied énorme. Un bas droit ou large qui tombe sur la chaussure équilibre la silhouette.",
        ],
      },
      {
        heading: "3. Les runners techniques : la nouvelle vague",
        body: [
          "Troisième famille, plus récente dans la rue : des chaussures de course actuelles, pas d’archive, portées avec une tenue de ville. Air Max Dn, On Cloudtilt, adidas Adizero Evo SL ou Adistar BYD, ASICS Gel-Quantum. Lignes nettes, semelles travaillées, coloris souvent sobres avec un détail vif.",
          "Elles plaisent à ceux qui veulent une paire moderne sans passer par les classiques. Elles se portent comme un runner d’archive, avec un bas droit ou un short, et vont bien avec des vêtements techniques ou très simples.",
        ],
      },
      {
        heading: "4. Les classiques du basket : la base qui ne bouge pas",
        body: [
          "Dunk Low, Air Jordan 1, Air Jordan 4, New Balance 550, Air Force 1 : ce ne sont pas des nouveautés, mais elles restent la base du vestiaire streetwear. En 2026, on les choisit plutôt dans des coloris doux ou chauds (crème, gris, marron, bordeaux) que dans les associations très contrastées des années précédentes.",
          "Si vous avez déjà une paire basket blanche, la tendance ne vous oblige pas à la remplacer : elle vous invite plutôt à ajouter une silhouette basse ou une runner pour varier.",
        ],
      },
      {
        heading: "Tableau : les tendances 2026 en un coup d’œil",
        body: ["Prix relevés sur les paires en ligne chez BEYOND PLUS au moment de la mise à jour, livraison gratuite partout au Maroc."],
        table: {
          head: ["Tendance", "Modèles chez nous", "Prix BEYOND PLUS", "Avec quoi la porter", "Durée de vie du style"],
          rows: [
            ["Silhouette basse", "Samba, Handball Spezial, Gazelle, Campus 00s", "500 à 750 DH", "Jean droit, pantalon à pinces, jupe longue", "Très longue : modèles installés depuis des décennies"],
            ["Runner d’archive", "Gel-Kayano 14, Gel-NYC, Vomero 5, P-6000, 9060, 530", "650 à 760 DH", "Bas droit ou large, jogging, cargo", "Longue : la famille est installée"],
            ["Runner technique", "Air Max Dn, On Cloudtilt, Adizero Evo SL, Gel-Quantum", "680 à 760 DH", "Tenue simple ou technique, short", "À suivre : tendance plus récente"],
            ["Classique basket", "Dunk Low, Jordan 1, Jordan 4, 550", "600 à 770 DH", "Jean, jogging, cargo", "Intemporelle"],
          ],
        },
      },
      {
        heading: "Les couleurs de l’année : argent, crème et tons terre",
        image: { src: "/products/nike-zoom-vomero-5-earth-fossil-01.webp", alt: "Nike Zoom Vomero 5 Earth Fossil, tons terre" },
        body: [
          "Le blanc pur laisse la place à des blancs cassés, du crème, du gris clair et de l’argent métallisé. Ces teintes vont avec autant de choses que le blanc, mais paraissent moins « neuves » et se salissent moins vite à l’œil.",
          "Pour la touche forte, deux familles : les tons terre (marron, kaki, olive, sable) et le bordeaux. Ils se marient bien avec le denim, le noir et le beige, donc avec la plupart des garde-robes.",
          "Les motifs animaux (léopard, vache) sont la tendance la plus marquée de la saison. À réserver à une deuxième ou troisième paire, portée avec une tenue unie.",
        ],
      },
      {
        heading: "Checklist : adopter une tendance sans se tromper",
        body: [
          "Regardez votre bas le plus porté : pantalon fin ou jupe, choisissez une silhouette basse ; bas large ou jogging, une runner.",
          "Une seule paire dans l’année ? Prenez un coloris neutre (blanc, crème, noir, gris) dans la famille qui vous va. Le coloris fort vient ensuite.",
          "Vérifiez que la paire existe depuis plusieurs saisons : une silhouette installée se démode moins vite qu’un coloris du moment.",
          "Pensez à l’usage : pour marcher beaucoup, une runner ; pour une allure plus habillée, une silhouette basse.",
          "Pour un choix par genre, nos guides sneakers femme tendance et sneakers homme tendance au Maroc détaillent les modèles et les pointures disponibles.",
          "Mesurez votre pied en centimètres avant de commander : on confirme la pointure de la paire par téléphone avant l’envoi. Les conseils de taille des modèles originaux ne s’appliquent pas forcément à une réplique.",
        ],
      },
      {
        heading: "Commander et échanger",
        body: [
          "Vous commandez sur le site, on vous appelle pour confirmer la paire et la pointure, puis la livraison est gratuite partout au Maroc en 12 à 48 h après confirmation. Aucun paiement en ligne. Si la pointure ne va pas, l’échange est possible sous 3 jours après la livraison : paire non portée, dans sa boîte d’origine, retour à votre charge.",
        ],
      },
    ],
    links: [{ label: "Low Profile", href: "/collections/low-profile" }, { label: "Retro Runners", href: "/collections/retro-runners" }, { label: "Basketball", href: "/collections/basketball" }, { label: "Trending Now", href: "/collections/trending-now" }],
  },
  {
    slug: "retro-runners-comment-les-porter",
    title: "Retro runners : comment les porter",
    description: "Les runners d’archive sont partout. Nos conseils pour les associer à un baggy, un short ou un tailleur, et bien choisir sa pointure.",
    intro: "Une retro runner se porte avec presque tout, à une condition : donner à la tenue assez de volume pour équilibrer la chaussure. Pantalon large ou droit qui tombe sur la paire, short avec chaussettes visibles, ou tailleur un peu ample : ce sont les trois tenues qui marchent à tous les coups. Voici la méthode, les coloris réellement disponibles chez nous et les erreurs qui cassent une silhouette.",
    published: "2026-09-24",
    sections: [
      {
        heading: "Ce qu’on appelle une retro runner",
        image: { src: "/products/asics-gel-kayano-14-white-fjord-grey-01.webp", alt: "ASICS Gel-Kayano 14 White Fjord Grey, vue de profil" },
        body: [
          "C’est une chaussure de course au design des années 2000, ressortie pour la ville. On la reconnaît à l’œil : semelle épaisse et travaillée, tige faite de plusieurs empiècements superposés, beaucoup de mesh, et souvent des touches argentées ou métallisées.",
          "Chez BEYOND PLUS, la famille compte surtout l’ASICS Gel-Kayano 14, l’ASICS Gel-NYC, la New Balance 9060, la Nike Vomero 5 et la Nike P-6000. Elles n’ont pas toutes le même volume : la 9060 est la plus massive, la P-6000 et la Gel-NYC restent plus contenues, la Kayano 14 et la Vomero 5 sont entre les deux.",
          "Pour choisir entre deux modèles précis, nos comparatifs Gel-NYC ou Gel-Kayano 14 et Vomero 5 ou P-6000 détaillent les différences. Ici, on part de la tenue.",
        ],
      },
      {
        heading: "La règle des volumes",
        body: [
          "Une retro runner prend de la place au pied. Si tout le reste de la tenue est serré, le regard tombe sur les chaussures et la silhouette paraît coupée en deux. La solution est simple : le volume du bas répond au volume de la paire.",
          "Pantalon large ou baggy : l’ourlet tombe sur la tige et laisse voir la semelle. C’est la tenue la plus facile, en jean comme en cargo ou en pantalon de toile. Avec la 9060, c’est presque obligatoire.",
          "Pantalon droit : il fonctionne avec les modèles plus fins, Gel-NYC ou P-6000. Gardez une longueur qui touche la chaussure, sans plis accumulés sur le coup de pied.",
          "Short ou jupe courte : laissez la chaussure devenir la pièce forte. Des chaussettes blanches ou grises visibles de quelques centimètres font le lien entre la jambe et la paire.",
          "Tailleur ou costume un peu ample : le contraste entre une veste structurée et une runner technique est l’un des looks les plus forts du moment. Il marche si le pantalon a de la largeur et si la paire reste claire ou argentée.",
        ],
      },
      {
        heading: "Quelle tenue avec quel modèle",
        body: [
          "Prix et pointures relevés dans notre catalogue au moment de l’écriture. Les coloris peuvent changer : la page de chaque modèle montre ce qui est en ligne aujourd’hui.",
        ],
        table: {
          head: ["Tenue", "Bas conseillé", "Modèle", "Coloris en ligne"],
          rows: [
            ["Bureau décontracté", "Pantalon droit ou chino", "ASICS Gel-NYC", "Cream Oyster Grey (700 DH, du 36 au 44), White Steel Grey (750 DH)"],
            ["Sortie le soir", "Jean large foncé ou cargo noir", "New Balance 9060", "Black Castlerock Grey (730 DH, homme), White Taro (760 DH, du 38 au 44)"],
            ["Week-end, café, courses", "Short, jupe courte ou jogging", "Nike Vomero 5", "Pale Ivory & Sand Drift, White & Vast Grey (660 DH, femme), Earth Fossil (660 DH, homme)"],
            ["Tailleur ou costume ample", "Pantalon de costume large", "ASICS Gel-Kayano 14", "White Fjord Grey, Arctic Sky Pure Silver (750 DH, homme), Cream Sweet Pink (750 DH, femme)"],
            ["Tenue sport chic", "Pantalon de survêtement droit", "Nike P-6000", "White Silver, Black & White (660 DH, homme), Premium Washed Pink (660 DH, femme)"],
          ],
        },
      },
      {
        heading: "Les coloris qui fonctionnent",
        image: { src: "/products/new-balance-9060-black-castlerock-grey-2025-01.webp", alt: "New Balance 9060 Black Castlerock Grey, vue de profil" },
        body: [
          "Blanc et argent : c’est la base de la famille. White Fjord Grey ou Arctic Sky Pure Silver sur la Kayano 14, White Silver sur la P-6000, White Steel Grey sur la Gel-NYC. Ils éclairent une tenue sombre et vont avec toutes les couleurs de pantalon.",
          "Crème et beige : Cream Oyster Grey sur la Gel-NYC, Pale Ivory & Sand Drift sur la Vomero 5. Plus doux que le blanc pur, ils s’accordent avec le lin, le beige, le kaki et le denim clair, très pratiques quand il fait chaud.",
          "Noir : Black Castlerock Grey sur la 9060, Black Graphite sur la Gel-NYC, Triple Black sur la Kayano 14. Le choix le plus sobre, idéal le soir ou avec un costume sombre, et le plus simple à garder propre au quotidien.",
          "Une touche de couleur : White Taro ou Crystal Pink sur la 9060, Cream Sweet Pink sur la Kayano 14, Photon Dust Pink Foam sur la Vomero 5. Dans ce cas, gardez le reste de la tenue neutre et laissez la paire parler.",
        ],
      },
      {
        heading: "Les erreurs qui cassent la silhouette",
        body: [
          "1. Un slim très serré avec une 9060 : la chaussure paraît énorme et la jambe trop fine. Passez au droit ou au large.",
          "2. Un pantalon trop long qui s’écrase sur la tige : il cache la semelle, c’est-à-dire ce qui fait tout le style de la paire. L’ourlet doit toucher la chaussure, pas l’avaler.",
          "3. Des chaussettes invisibles avec un short : la cheville nue sous une runner volumineuse déséquilibre la jambe. Préférez une chaussette visible.",
          "4. Trop de couleurs en même temps : une paire colorée avec un haut imprimé et un pantalon de couleur, c’est trop. Une seule pièce forte par tenue.",
          "5. Une paire sale avec un tailleur : le contraste sport et habillé ne marche que si la chaussure est nette. Un coup de brosse sur le mesh avant de sortir suffit.",
        ],
      },
      {
        heading: "Adapter la tenue à la chaleur",
        body: [
          "Au Maroc, une retro runner se porte bien au-delà de l’hiver. En été, choisissez un coloris clair (crème, blanc, argent), un pantalon large en lin ou en coton léger, ou un short. Une semelle épaisse reste une chaussure de ville fermée : les jours de forte chaleur, alternez avec une paire plus basse et plus légère, comme une Samba ou une Gazelle.",
        ],
      },
      {
        heading: "La pointure et la commande",
        body: [
          "Ne vous fiez pas à la pointure d’une autre marque. Mesurez votre pied en centimètres, talon contre un mur, du talon au bout du plus long orteil, le soir de préférence. Après votre commande sur le site, nous vous appelons pour confirmer la commande : donnez-nous cette mesure et nous confirmons la pointure de la paire avant l’envoi. Aucun paiement en ligne n’est demandé.",
          "La livraison est gratuite partout au Maroc, en 12 à 48 h après confirmation. Si la pointure ne va pas, l’échange est possible sous 3 jours après la livraison, paire non portée et dans sa boîte d’origine, retour à la charge du client.",
          "Nos paires sont des répliques (Master Copy Premium 1:1), pas des paires originales : nous le disons clairement sur chaque fiche.",
        ],
      },
    ],
    links: [{ label: "Toutes les Retro Runners", href: "/collections/retro-runners" }, { label: "ASICS Gel-Kayano 14", href: "/collections/asics-gel-kayano-14" }, { label: "ASICS Gel-NYC", href: "/collections/asics-gel-nyc" }, { label: "Nike Vomero 5", href: "/collections/nike-vomero-5" }],
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
    intro: "Côté homme, trois familles se partagent la rue au Maroc en 2026 : les runners d’archive au look Y2K (Gel-Kayano 14, New Balance 9060, Vomero 5), les classiques du basket (Air Jordan 4, Air Jordan 1, New Balance 550) et les silhouettes techniques venues du running (Air Max Dn, On Cloudtilt, Adizero). Les coloris qui dominent : argent, gris, noir et tons terre. Voici les modèles, les prix chez nous et avec quoi les porter. Toutes les paires citées sont des répliques Master Copy Premium 1:1, jamais présentées comme originales.",
    sections: [
      {
        heading: "Les runners Y2K : la famille la plus portée",
        body: [
          "Ce sont les paires qu’on voit le plus aux pieds des garçons qui suivent la mode : beaucoup de superpositions, du maillage, des reflets métallisés et une semelle épaisse. Un jean et un t-shirt blanc suffisent.",
          "ASICS Gel-Kayano 14 : la référence du genre. Quatre coloris homme à 750 DH, du 40 au 44 : Arctic Sky Pure Silver (argent et bleu glacier), White Fjord Grey, Triple Black et Cream Black Metallic Plum.",
          "New Balance 9060 : la plus volumineuse, avec sa semelle sculptée. Black Castlerock Grey à 730 DH (40 à 44) et White Taro à 760 DH (38 à 44).",
          "Nike Vomero 5 : plus de maillage, un look plus sport. Earth Fossil à 660 DH et Premium Sail Total Orange à 730 DH, cette dernière disponible jusqu’au 45.",
          "Plus rares dans la rue : Nike P-6000 White Silver ou Black & White (660 DH), ASICS Gel-NYC Black Graphite (710 DH) et Ivy Smoke Grey (700 DH), New Balance 1906R Metallic Silver Gold (720 DH), New Balance 860v2 Black Silver (750 DH)."
        ],
        image: { src: "/products/asics-gel-kayano-14-arctic-sky-pure-silver-01.webp", alt: "ASICS Gel-Kayano 14 Arctic Sky Pure Silver, argent et bleu glacier" }
      },
      {
        heading: "Les classiques du basket : la base du vestiaire streetwear",
        body: [
          "Tige en cuir, blocs de couleur, semelle plate : ces silhouettes existent depuis des décennies et vont avec presque tout.",
          "Air Jordan 4 : la plus recherchée de la famille. Black Cat (tout noir, du 36 au 44) et Cool Grey 2019 (40 à 44), toutes deux à 770 DH.",
          "Air Jordan 1 : la montante. Light Smoke Grey (36 à 44) et Dark Mocha (39 à 44), à 720 DH.",
          "New Balance 550 : plus sobre, parfaite pour débuter. White Summer Fog à 600 DH, White Green Black à 680 DH, White Grey à 700 DH, toutes du 40 au 44.",
          "Pour sortir des sentiers battus : adidas Forum Low White Royal Blue (700 DH) ou Air Force 1 LV8 EMB Black Silver (700 DH). À noter, la Nike Dunk Low est en ce moment en ligne uniquement du 36 au 40 : si vous chaussez plus grand, regardez plutôt la 550 ou la Jordan 1."
        ],
        image: { src: "/products/jordan-air-jordan-4-retro-cool-grey-2019-01.webp", alt: "Air Jordan 4 Retro Cool Grey 2019, gris et blanc" }
      },
      {
        heading: "Les silhouettes techniques : la nouvelle vague",
        body: [
          "Ce sont les lignes les plus récentes : des paires pensées pour la course, portées en ville avec un cargo, un pantalon en nylon ou un total look sombre.",
          "Nike Air Max Dn : All Day, Particle Grey et Black White Cool Grey, à 680 DH, jusqu’au 45 selon le coloris.",
          "On Cloudtilt : la silhouette la plus épurée, à 750 DH. La version d’origine va du 38 au 45, Eclipse Cinder (tons terre) et Clove Sand (sable) du 38 au 44.",
          "adidas Adizero Evo SL (Black Iron Metallic ou Black White) et ASICS Gel-Quantum (Kinetic Grey Pure Silver ou Kinetic Pepper Light Indigo) : 750 DH, du 40 au 44."
        ],
        image: { src: "/products/nike-air-max-dn-black-white-cool-grey-01.webp", alt: "Nike Air Max Dn Black White Cool Grey, noir et gris" }
      },
      {
        heading: "Tableau : quelle famille pour quel style",
        body: [
          "Un repère rapide pour choisir selon ce que vous portez le plus souvent."
        ],
        table: {
          head: ["Famille", "Modèles chez nous", "Avec quoi la porter", "Prix chez nous"],
          rows: [
            ["Runner Y2K", "Gel-Kayano 14, 9060, Vomero 5, P-6000, 1906R", "Baggy, cargo, jogging large, jean droit", "660 à 760 DH"],
            ["Basket", "Air Jordan 4, Air Jordan 1, 550, Forum Low", "Jean brut, short en jean, survêtement", "600 à 770 DH"],
            ["Technique", "Air Max Dn, On Cloudtilt, Adizero Evo SL, Gel-Quantum", "Pantalon nylon, cargo, total look noir", "680 à 850 DH"],
            ["Terrace", "Samba, Gazelle Indoor, Campus 00s", "Pantalon à pinces, chino, jean droit", "650 à 700 DH"]
          ]
        }
      },
      {
        heading: "Et les silhouettes basses ?",
        body: [
          "La Samba et ses cousines ne sont pas réservées aux femmes. Plusieurs coloris existent jusqu’au 44 : Samba Core Black et Vegan White Gum (700 DH), Gazelle Indoor Green et Grey Three à détails dorés (650 DH), Campus 00s Crystal White Dark Green (700 DH). Avec un pantalon droit ou à pinces, c’est le choix le plus simple pour le bureau ou une soirée."
        ]
      },
      {
        heading: "Les coloris qui marchent au Maroc",
        body: [
          "Noir et argent, gris, tons terre : ce sont les couleurs qui se portent tous les jours et se salissent le moins vite. Le triple noir (Kayano 14 Triple Black, Jordan 4 Black Cat) reste la valeur sûre pour ceux qui veulent une seule paire.",
          "Le gris clair (Jordan 4 Cool Grey, 550 White Grey, Kayano 14 White Fjord Grey) va avec le denim comme avec le noir. Les tons terre (Vomero 5 Earth Fossil, Jordan 1 Dark Mocha) se marient avec le beige, le kaki et le marron.",
          "Pour une paire qui se remarque sans être criarde : New Balance 1906R Neon Nights (750 DH) ou Vomero 5 Premium Sail Total Orange."
        ]
      },
      {
        heading: "Pointures homme : ce qui est disponible",
        body: [
          "La plupart des paires homme sont en ligne du 40 au 44. Quelques coloris montent jusqu’au 45 : Air Max Dn All Day et Black White Cool Grey, Vomero 5 Premium Sail Total Orange, On Cloudtilt, New Balance 1000 Reflective Pack Raincloud. Les pointures disponibles sont indiquées sur chaque fiche.",
          "Pour viser juste, mesurez la longueur de votre pied en centimètres, talon contre un mur, le soir, avec les chaussettes que vous porterez. Gardez ce chiffre sous la main : lors de notre appel de confirmation, on vérifie la pointure de la paire fournie avant l’envoi. Les conseils de taille des modèles originaux ne s’appliquent pas forcément à une réplique."
        ]
      },
      {
        heading: "Checklist avant de commander",
        body: [
          "Je connais la longueur de mon pied en centimètres.",
          "Ma pointure est en ligne dans le coloris choisi.",
          "Le volume de la paire va avec mes bas : runner ou basket avec un bas ample, silhouette basse avec une coupe droite.",
          "Le coloris va avec au moins trois pièces de ma garde-robe.",
          "Mon téléphone est à portée de main pour l’appel de confirmation."
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
        label: "Sneakers homme",
        href: "/collections/homme"
      },
      {
        label: "Retro Runners",
        href: "/collections/retro-runners"
      },
      {
        label: "Basketball",
        href: "/collections/basketball"
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
    description: "Comment choisir ses sneakers ou baskets : silhouette, coloris, volume, pointure en cm, entretien. Cinq questions, un tableau et une checklist avant d’acheter.",
    intro: "Pour bien choisir ses sneakers, partez de ce que vous portez déjà, pas de la paire à la mode. Cinq questions suffisent : quelle silhouette pour votre style, quel coloris vous porterez le plus, quel volume va avec vos pantalons, quelle pointure en centimètres et quel entretien vous êtes prêt à faire. Ce guide les reprend une par une, avec les modèles de la sélection BEYOND PLUS, leurs prix et une checklist à suivre avant de commander. Nos paires sont des répliques high copy, jamais présentées comme originales.",
    sections: [
      {
        heading: "1. Quelle silhouette pour votre style ?",
        image: { src: "/products/adidas-samba-core-black-01.webp", alt: "adidas Samba Core Black, silhouette basse terrace" },
        body: [
          "La silhouette, c’est la forme générale de la paire : sa hauteur, sa semelle, son volume. C’est elle qui décide si la chaussure se fond dans la tenue ou la domine. On peut ranger presque toutes les sneakers dans quatre familles.",
          "Style minimaliste, habillé ou féminin : une silhouette basse, dite low profile ou terrace. Samba, Handball Spezial, Gazelle, Campus 00s. Semelle fine, ligne allongée, elles passent avec un pantalon à pinces, une jupe ou une robe.",
          "Style streetwear : une paire issue du basket. Dunk Low, Air Jordan 1, New Balance 550, Air Force 1. Plus larges, plus présentes, elles vont avec un jean, un jogging ou un cargo.",
          "Style sportif ou Y2K : une runner d’archive. Gel-Kayano 14, Gel-NYC, Vomero 5, P-6000, 9060, 530. Du mesh, des renforts, parfois de l’argent : du volume et du confort pour marcher.",
          "Style moderne et épuré : une runner technique actuelle. Air Max Dn, On Cloudtilt, Adizero Evo SL. Lignes nettes, semelles travaillées, souvent dans des coloris sobres.",
        ],
      },
      {
        heading: "Tableau : quel profil, quelle paire",
        body: ["Prix relevés sur les paires en ligne chez BEYOND PLUS au moment de la mise à jour. Livraison gratuite partout au Maroc."],
        table: {
          head: ["Votre profil", "Famille", "Modèles chez nous", "Prix BEYOND PLUS"],
          rows: [
            ["Tenues sobres, pantalons fins, jupes", "Silhouette basse", "Samba, Handball Spezial, Gazelle, Campus 00s", "500 à 750 DH"],
            ["Jean, jogging, streetwear", "Classique basket", "Dunk Low, Air Jordan 1, 550, Air Force 1", "590 à 750 DH"],
            ["Beaucoup de marche, bas larges", "Runner d’archive", "Gel-Kayano 14, Gel-NYC, Vomero 5, 9060, 530", "650 à 760 DH"],
            ["Look moderne, vêtements techniques", "Runner technique", "Air Max Dn, On Cloudtilt, Adizero Evo SL", "680 à 760 DH"],
            ["Budget serré", "Toutes familles", "Sélection moins de 600 DH", "Moins de 600 DH"],
            ["Budget moyen", "Toutes familles", "Sélection moins de 700 DH", "Moins de 700 DH"],
          ],
        },
      },
      {
        heading: "2. Quel coloris porterez-vous le plus souvent ?",
        body: [
          "Pour une première paire, choisissez un neutre : blanc, crème, noir ou gris. Ce sont les coloris qui vont avec le plus de vêtements, donc ceux que vous porterez vraiment. Le crème et le gris clair ont un avantage : ils paraissent propres plus longtemps que le blanc pur.",
          "Le noir est le choix le plus pratique au quotidien, notamment en ville et en hiver. Il passe aussi avec une tenue plus habillée.",
          "Gardez les coloris forts (bleu, rose, vert, motif léopard ou vache) pour la deuxième paire. Une règle simple : si la paire est colorée, le reste de la tenue reste neutre.",
        ],
      },
      {
        heading: "3. Quel volume pour vos pantalons ?",
        image: { src: "/products/new-balance-9060-white-taro-01.webp", alt: "New Balance 9060 White Taro, runner volumineuse" },
        body: [
          "C’est la question qu’on oublie le plus, et celle qui explique la plupart des paires jamais portées. Une chaussure volumineuse, comme la 9060 ou la Kayano 14, demande un bas qui a lui aussi du volume : jean droit ou large, cargo, jogging. Avec un slim, le pied paraît énorme.",
          "Une paire fine, comme la Samba ou la Spezial, s’accorde avec presque tout, y compris les coupes ajustées, les jupes et les robes. C’est pour cela qu’on la conseille souvent comme première paire.",
          "Ouvrez votre armoire : si la majorité de vos pantalons sont larges, une runner vous ira naturellement. S’ils sont fins ou si vous portez souvent des jupes, commencez par une silhouette basse.",
        ],
      },
      {
        heading: "4. Quelle pointure ?",
        body: [
          "Mesurez la longueur de votre pied en centimètres : talon contre un mur, pied posé sur une feuille, trait au bout du plus long orteil, puis mesure du mur au trait. Faites-le en fin de journée, avec les chaussettes que vous porterez, et mesurez les deux pieds.",
          "Gardez cette mesure sous la main : lors de notre appel de confirmation, on vérifie la pointure de la paire choisie avant l’envoi. Les conseils de taille des modèles originaux ne s’appliquent pas forcément à une réplique, et il n’existe pas de correspondance universelle entre centimètres et pointures. Si vous avez le pied large, dites-le au moment de l’appel : notre guide sneakers et pied large indique les silhouettes les plus confortables.",
        ],
      },
      {
        heading: "5. Quel entretien êtes-vous prêt à faire ?",
        body: [
          "Le daim et le nubuck donnent un bel aspect mais craignent l’eau et les taches : il faut une brosse et un peu d’attention. Le cuir lisse est le plus simple, un chiffon humide suffit le plus souvent. Le mesh des runners respire bien mais attrape la poussière : il se nettoie doucement, à la brosse souple.",
          "Si vous voulez zéro contrainte, préférez un cuir lisse ou un coloris foncé. Notre guide d’entretien détaille chaque matière.",
        ],
      },
      {
        heading: "Checklist avant de commander",
        body: [
          "J’ai choisi une famille qui va avec mes pantalons les plus portés.",
          "J’ai choisi un coloris que je peux porter au moins trois jours par semaine.",
          "J’ai mesuré mes deux pieds en centimètres, en fin de journée.",
          "Je sais quel entretien demande la matière de la paire.",
          "Je connais les conditions : commande sur le site, appel de confirmation, livraison gratuite partout au Maroc en 12 à 48 h après confirmation, aucun paiement en ligne.",
          "Je sais que l’échange de pointure est possible sous 3 jours après la livraison, paire non portée, dans sa boîte d’origine, retour à ma charge.",
        ],
      },
    ],
    links: [
      {
        label: "Toutes les sneakers",
        href: "/collections/nouveautes"
      },
      {
        label: "Low Profile",
        href: "/collections/low-profile"
      },
      {
        label: "Moins de 700 DH",
        href: "/collections/sneakers-moins-de-700-dh"
      },
      {
        label: "Sneakers femme",
        href: "/collections/femme"
      },
      {
        label: "Moins de 600 DH",
        href: "/collections/sneakers-moins-de-600-dh"
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
    intro: "Avec un pantalon large, prenez soit une paire basse et fine (Samba, Gazelle) pour un effet élégant, soit une runner volumineuse (9060) pour un effet streetwear. Avec une robe ou une jupe longue, restez sur une paire basse et claire. Avec un costume, choisissez une paire sobre et nette. Tout se joue sur deux réglages : la largeur de l’ourlet et l’endroit où il tombe sur la chaussure. Voici la règle pièce par pièce, pour elle comme pour lui, avec les paires en ligne chez nous.",
    sections: [
      {
        heading: "La règle de base : largeur et longueur",
        body: [
          "Regardez d’abord le bas de votre vêtement, pas la chaussure. Plus l’ourlet est large, plus la paire peut avoir de volume. Plus il est étroit, plus la paire doit être fine. C’est ce rapport qui rend une tenue équilibrée ou qui la coupe en deux.",
          "La longueur compte autant. Un pantalon qui s’accumule sur la tige cache la chaussure et tasse la silhouette. Un pantalon qui s’arrête juste au-dessus de la semelle, ou qui la touche à peine, laisse voir la paire et allonge la jambe. Pour une robe ou une jupe, c’est l’espace de jambe visible entre l’ourlet et la chaussure qui guide le choix.",
          "Deux familles suffisent pour presque tout : les silhouettes basses et fines (Samba, Gazelle, Handball Spezial, Campus 00s) et les runners plus volumineuses (New Balance 9060, ASICS Gel-NYC, Kayano 14).",
        ],
      },
      {
        heading: "Avec un pantalon large ou un baggy",
        image: { src: "/products/new-balance-9060-white-taro-01.webp", alt: "New Balance 9060 White Taro, vue de profil" },
        body: [
          "C’est la pièce la plus facile. Deux options, selon l’effet voulu.",
          "Effet streetwear : une runner volumineuse. La New Balance 9060 est faite pour ça, sa semelle massive tient tête à un jean baggy ou à un cargo. White Taro (760 DH, du 38 au 44) pour une tenue claire, Black Castlerock Grey (730 DH, homme, du 40 au 44) avec un jean foncé.",
          "Effet plus habillé : une paire basse et fine. Le contraste entre un pantalon ample et une chaussure plate donne une allure nette, presque rétro. La Samba Vegan White Gum (700 DH, du 36 au 44) ou la Gazelle Indoor Green (650 DH, du 36 au 44) fonctionnent avec un pantalon de toile large comme avec un jean droit un peu ample.",
          "Dans les deux cas, l’ourlet doit tomber sur la chaussure, pas la recouvrir entièrement.",
        ],
      },
      {
        heading: "Avec un pantalon fluide ou un palazzo",
        body: [
          "Le palazzo et les pantalons très fluides bougent à chaque pas. Une chaussure volumineuse alourdit ce mouvement ; une paire fine le laisse vivre. Restez sur les silhouettes basses : Samba, Handball Spezial ou Gazelle.",
          "Côté couleur, une paire qui reprend un ton de la tenue fait durer la ligne de la jambe. Un palazzo beige avec une Handball Spezial Earth Strata Gum (700 DH, du 36 au 40), un pantalon bleu avec une Handball Spezial Light Blue (700 DH, du 36 au 40), un noir avec une Samba Core Black (700 DH, du 36 au 44).",
        ],
      },
      {
        heading: "Avec une robe courte",
        body: [
          "La jambe est visible, la chaussure devient donc une vraie pièce de la tenue. Les deux familles marchent. Une paire basse garde un esprit léger et vintage ; une runner comme la Gel-NYC Cream Oyster Grey (700 DH, du 36 au 44) donne un contraste plus moderne, surtout avec une chaussette blanche visible de quelques centimètres.",
        ],
      },
      {
        heading: "Avec une robe longue ou une jupe mi-mollet",
        image: { src: "/products/adidas-samba-vegan-white-gum-01.webp", alt: "adidas Samba Vegan White Gum, vue de profil" },
        body: [
          "Ici, la paire doit rester discrète : on n’en voit que le bout et la cheville. Choisissez une paire basse et claire. La Samba blanche à semelle gomme est le choix le plus sûr ; la New Balance 530 White Silver Metallic Sky Blue (650 DH, du 36 au 40) ajoute une touche argentée sans alourdir.",
          "Plus la jupe descend, plus la chaussure doit être fine. Une runner massive sous une robe longue fait disparaître la cheville et donne une impression de pieds trop grands.",
        ],
      },
      {
        heading: "Avec un costume ou un tailleur",
        body: [
          "Le contraste sport et habillé fonctionne à deux conditions : un pantalon qui a un peu de largeur, et une chaussure sobre et impeccable. Une Samba Core Black ou une Gazelle Indoor Bold Core Black White (720 DH, du 36 au 40) avec un costume sombre ; une Samba blanche ou une runner argentée avec un costume clair ou un tailleur beige.",
          "Pour un costume ample, une retro runner claire marche aussi très bien : notre guide Retro runners détaille ces associations. Évitez simplement les coloris très vifs, qui prennent le dessus sur la tenue.",
        ],
      },
      {
        heading: "Le tableau pour choisir vite",
        body: ["Prix et pointures relevés dans notre catalogue au moment de l’écriture. Les coloris en ligne peuvent changer."],
        table: {
          head: ["Pièce", "Sneaker conseillée", "Modèle en ligne", "Coloris et prix"],
          rows: [
            ["Pantalon large, baggy, cargo", "Runner volumineuse ou paire basse", "New Balance 9060, adidas Samba", "White Taro (760 DH), Vegan White Gum (700 DH)"],
            ["Palazzo, pantalon fluide", "Paire basse et fine", "adidas Handball Spezial, Gazelle", "Earth Strata Gum (700 DH), Gazelle Indoor Green (650 DH)"],
            ["Robe courte", "Basse ou runner fine", "ASICS Gel-NYC", "Cream Oyster Grey (700 DH)"],
            ["Robe longue, jupe mi-mollet", "Paire basse et claire", "adidas Samba, New Balance 530", "Vegan White Gum (700 DH), White Silver Metallic Sky Blue (650 DH)"],
            ["Costume, tailleur", "Paire sobre, noire ou blanche", "adidas Samba, Gazelle", "Core Black (700 DH), Indoor Bold Core Black White (720 DH)"],
          ],
        },
      },
      {
        heading: "Checklist avant de sortir",
        body: [
          "1. L’ourlet touche la chaussure sans s’écraser dessus.",
          "2. Le volume de la paire suit celui du bas : large avec volumineux ou fin, étroit avec fin uniquement.",
          "3. Une seule pièce forte : si la paire est colorée, le reste de la tenue reste neutre.",
          "4. Les lacets sont serrés juste assez, sans plisser la tige.",
          "5. La paire est propre : avec une robe ou un costume, une semelle sale se voit tout de suite.",
        ],
      },
      {
        heading: "Pointure, livraison et échange",
        body: [
          "Mesurez votre pied en centimètres, talon contre un mur, jusqu’au bout du plus long orteil. Après votre commande sur le site, nous vous appelons pour la confirmer : donnez-nous cette mesure et nous confirmons la pointure de la paire avant l’envoi. Aucun paiement en ligne n’est demandé.",
          "Livraison gratuite partout au Maroc en 12 à 48 h après confirmation. Échange de pointure possible sous 3 jours après la livraison, paire non portée et dans sa boîte d’origine, retour à la charge du client. Nos paires sont des répliques Master Copy Premium 1:1, jamais présentées comme originales.",
        ],
      },
    ],
    links: [
      {
        label: "adidas Samba",
        href: "/collections/adidas-samba"
      },
      {
        label: "New Balance 9060",
        href: "/collections/new-balance-9060"
      },
      {
        label: "Sneakers low profile",
        href: "/collections/low-profile"
      },
      {
        label: "Sneakers femme",
        href: "/collections/femme"
      }
    ],
    published: "2026-09-26"
  },
  {
    slug: "sneakers-pied-large",
    title: "Sneakers et pied large : comment bien choisir",
    description: "Pied large : comment choisir ses sneakers, quelles silhouettes éviter, comment mesurer la largeur de son pied et bien confirmer sa pointure avant de commander.",
    intro: "Avec un pied large, la bonne longueur ne suffit pas : la forme de la paire compte autant que la pointure. En pratique, les silhouettes basket et les runners à l’avant arrondi laissent en général plus de place que les silhouettes basses et allongées comme la Samba. Voici comment mesurer la largeur de votre pied, quelles familles regarder en premier, comment régler le laçage et pourquoi il ne faut pas prendre une pointure au dessus par réflexe. Nos paires sont des répliques Master Copy Premium 1:1 : on confirme toujours la pointure de la paire fournie avant l’envoi.",
    sections: [
      {
        heading: "Pourquoi la largeur compte autant que la longueur",
        body: [
          "Une paire trop étroite se sent tout de suite au niveau des orteils et sur le côté du petit orteil. Elle frotte, elle marque la tige, et elle se déforme vite : le cuir ou le daim finit par pousser vers l’extérieur, la semelle aussi.",
          "Le réflexe courant est de prendre une pointure au dessus. C’est souvent une erreur : la chaussure devient trop longue, le talon glisse à chaque pas et le pli de la tige tombe au mauvais endroit. Mieux vaut garder la bonne longueur et choisir une forme plus généreuse."
        ]
      },
      {
        heading: "Mesurer la longueur et la largeur de son pied",
        body: [
          "1. Posez une feuille au sol, contre un mur. Mettez les chaussettes que vous porterez avec vos sneakers.",
          "2. Placez le talon contre le mur, pied à plat, le poids du corps dessus. Faites-le en fin de journée : le pied est un peu plus volumineux le soir.",
          "3. Tracez le contour du pied avec un crayon tenu bien droit.",
          "4. Longueur : mesurez du mur au bout de l’orteil le plus long. Largeur : mesurez la partie la plus large, à la base des orteils.",
          "5. Recommencez avec l’autre pied : on a souvent un pied un peu plus grand. Gardez la mesure la plus grande.",
          "Notez les deux chiffres en centimètres. Vous pouvez nous les envoyer sur WhatsApp avant de commander, ou les donner lors de l’appel de confirmation."
        ]
      },
      {
        heading: "Les formes à regarder en premier",
        body: [
          "Ce sont des tendances de forme, pas des règles : chaque paire se vérifie. Mais elles aident à trier.",
          "Les silhouettes basket (Air Jordan 1, Air Jordan 4, New Balance 550, Air Force 1, Forum Low) ont en général un avant plus haut et plus arrondi. C’est souvent la famille la plus simple pour un pied large.",
          "Les runners au volume généreux (New Balance 9060, Gel-Kayano 14, Vomero 5, Gel-NYC) ont une tige en maillage et en superpositions qui laisse en général un peu de souplesse sur les côtés.",
          "Les terraces fines (Samba, Handball Spezial, Gazelle Indoor) sont basses et allongées, avec un bout effilé : ce sont elles qui serrent le plus souvent un pied large. Si vous y tenez, dites-le nous à la confirmation."
        ],
        image: { src: "/products/jordan-air-jordan-1-dark-mocha-01.webp", alt: "Air Jordan 1 Dark Mocha, marron et blanc, avant arrondi" }
      },
      {
        heading: "Tableau : quelle famille pour un pied large",
        body: [
          "Un repère pour orienter votre choix avant de parler pointure avec nous."
        ],
        table: {
          head: ["Famille", "Forme de l’avant", "Pour un pied large", "Exemples chez nous"],
          rows: [
            ["Basket", "Arrondie, plutôt haute", "Souvent le meilleur choix", "Air Jordan 1, Air Jordan 4, New Balance 550"],
            ["Runner Y2K", "Volume généreux, maillage", "Bon choix en général", "9060, Gel-Kayano 14, Vomero 5"],
            ["Runner rétro fine", "Plus fine, tige souple", "À vérifier avec nous", "Gel-NYC, New Balance 530"],
            ["Terrace", "Basse, allongée, effilée", "Souvent trop étroite", "Samba, Handball Spezial, Gazelle"]
          ]
        },
        image: { src: "/products/new-balance-550-white-grey-01.webp", alt: "New Balance 550 White Grey, blanc et gris" }
      },
      {
        heading: "Régler le laçage pour gagner de la place",
        body: [
          "Le laçage change beaucoup de choses, surtout sur l’avant du pied.",
          "Desserrez nettement les deux ou trois premiers œillets, côté orteils, et gardez le serrage en haut pour tenir le talon.",
          "Si la pression vient d’un point précis sur le dessus du pied, sautez l’œillet à cet endroit : passez le lacet directement à l’œillet suivant.",
          "Évitez les chaussettes épaisses avec une paire déjà ajustée, et ne serrez jamais au point de plisser la tige : c’est ce qui déforme une paire le plus vite."
        ]
      },
      {
        heading: "Les erreurs à éviter",
        body: [
          "Prendre une pointure au dessus par défaut : le talon glisse et la paire se plie mal.",
          "Choisir une terrace fine parce qu’elle est à la mode, sans vérifier la forme.",
          "Mesurer le matin ou pieds nus alors que vous portez des chaussettes épaisses.",
          "Se fier aux conseils de taille des modèles originaux : une réplique peut chausser différemment."
        ]
      },
      {
        heading: "Checklist avant de commander",
        body: [
          "J’ai mesuré la longueur et la largeur de mes deux pieds, en centimètres.",
          "J’ai choisi une famille adaptée : basket ou runner au volume généreux en priorité.",
          "Ma pointure est en ligne dans le coloris choisi.",
          "Je signale que j’ai le pied large, sur WhatsApp ou lors de l’appel de confirmation.",
          "À la réception, j’essaie la paire sur un sol propre et je garde la boîte d’origine : une paire non portée peut être échangée sous 3 jours."
        ]
      },
      {
        heading: "On confirme avant l’envoi, et l’échange reste possible",
        body: [
          "Après votre commande sur le site, on vous appelle pour confirmer le modèle, la pointure et l’adresse. Donnez-nous vos mesures en centimètres et précisez que vous avez le pied large : on vérifie la pointure de la paire fournie avant l’envoi. Aucun paiement en ligne.",
          "La livraison est gratuite partout au Maroc, en 12 à 48 heures après la confirmation. Si la paire serre malgré tout, l’échange de pointure est possible sous 3 jours après la livraison, paire non portée et dans sa boîte d’origine, retour à votre charge."
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
      },
      {
        label: "New Balance 550",
        href: "/collections/new-balance-550"
      }
    ],
    published: "2026-09-26"
  },
  {
    slug: "vomero-5-ou-p-6000",
    title: "Nike P-6000 vs Vomero 5 : laquelle choisir ?",
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
