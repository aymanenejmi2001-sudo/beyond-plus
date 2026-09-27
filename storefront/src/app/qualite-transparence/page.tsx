import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qualité et transparence",
  description: "Ce que vend BEYOND PLUS : des répliques qualité Master Copy Premium 1:1, sans affiliation avec les marques citées. Comment on sélectionne, comment on commande.",
  alternates: { canonical: "/qualite-transparence" },
};

export default function Page() {
  return (
    <article className="beyond-page beyond-guide">
      <nav className="eyebrow" aria-label="Fil d'ariane"><Link href="/">Accueil</Link> / Qualité et transparence</nav>
      <h1>Qualité et transparence</h1>
      <p className="beyond-guide-intro">
        On préfère que vous sachiez exactement ce que vous achetez. Voici, sans détour, ce que propose BEYOND PLUS.
      </p>

      <section>
        <h2>Ce sont des répliques</h2>
        <p>
          Les paires vendues par BEYOND PLUS sont des répliques, de qualité « Master Copy Premium 1:1 » selon notre fournisseur.
          « High copy » et « Master Copy » sont des appellations commerciales, pas des certifications indépendantes ni une garantie de matériaux ou de durabilité identiques à l’original. Ce ne sont pas des produits authentiques des marques, et nous ne les présentons jamais comme tels. La mention figure sur chaque fiche produit.
        </p>
      </section>

      <section>
        <h2>Aucune affiliation avec les marques</h2>
        <p>
          BEYOND PLUS n’est ni affilié, ni partenaire, ni revendeur agréé d’adidas, Nike, Jordan, New Balance, ASICS, Converse, Vans, On, PUMA
          ou de toute autre marque citée sur le site. Les noms de marques et de modèles servent uniquement à décrire la paire proposée.
        </p>
      </section>

      <section>
        <h2>Comment on sélectionne</h2>
        <p>
          On ne met pas tout le catalogue du fournisseur en ligne. On garde les modèles demandés au Maroc et deux à cinq coloris par modèle,
          avec des photos nettes et des pointures disponibles. Les collaborations d’artistes et les maisons de luxe sont volontairement exclues.
        </p>
      </section>

      <section>
        <h2>Avant d’envoyer, on confirme avec vous</h2>
        <p>
          Vous commandez directement sur le site, puis on vous appelle pour confirmer. La livraison est gratuite sous 12 à 48 heures après confirmation de la commande. Avant validation, on confirme avec vous la pointure. Et si elle ne va pas, vous avez 3 jours après la livraison pour demander un échange.
          Rien n’est expédié sans votre accord, et il n’y a pas de paiement en ligne sur le site.
        </p>
      </section>

      <section>
        <h2>Une question ?</h2>
        <p>Écrivez-nous avant de commander : on préfère répondre à une question que gérer un échange.</p>
      </section>

      <nav className="beyond-guide-links" aria-label="Aller plus loin">
        <Link href="/contact" className="beyond-link">Nous écrire ↗</Link>
        <Link href="/guides/quelle-pointure-choisir-sneakers" className="beyond-link">Guide des pointures ↗</Link>
        <Link href="/collections/nouveautes" className="beyond-link">Voir la sélection ↗</Link>
      </nav>
    </article>
  );
}
