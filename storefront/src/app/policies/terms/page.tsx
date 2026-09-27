import Link from "next/link";
import { Policy, Section, SellerIdentity } from "@/components/policy/Policy";
import { LEGAL } from "@/data/legal";

export const metadata = {
  alternates: { canonical: "/policies/terms" },
  title: "Conditions générales de vente",
  description: "Conditions générales de vente de BEYOND PLUS : produits, prix, commande en ligne, livraison au Maroc, rétractation.",
};

export default function Page() {
  return (
    <Policy title="Conditions de vente" intro="Les règles simples qui encadrent chaque commande passée chez BEYOND PLUS.">
      <Section title="1. Qui vend">
        <p>Le site beyondplusmaroc.com est édité par :</p>
        <SellerIdentity />
        <p>Les présentes conditions s’appliquent à toute commande passée à partir du site et confirmée par téléphone. Elles sont soumises au droit marocain, notamment à la loi n° 31-08 relative à la protection du consommateur.</p>
      </Section>

      <Section title="2. Les produits">
        <p>Les sneakers proposées par BEYOND PLUS sont des <strong>répliques</strong> (qualité « Master Copy »), comme indiqué sur chaque fiche produit. Ce ne sont pas des produits authentiques des marques citées, et BEYOND PLUS n’est affilié à aucune de ces marques. Les noms de modèles servent uniquement à décrire la paire.</p>
        <p>Les photos présentent la paire aussi fidèlement que possible ; de légères différences de teinte peuvent exister selon l’écran.</p>
      </Section>

      <Section title="3. Prix">
        <p>Les prix sont indiqués en dirhams (DH). La livraison est gratuite partout au Maroc sous 12 à 48 heures après confirmation de la commande. Le prix applicable est celui affiché au moment de la commande et rappelé lors de l’appel de confirmation.</p>
      </Section>

      <Section title="4. Commande">
        <p>Vous passez commande sur le site en indiquant vos coordonnées et votre adresse de livraison. La commande devient ferme lorsque nous avons confirmé avec vous, par téléphone, la disponibilité, le prix total et la livraison gratuite sous 12 à 48 heures après confirmation, et que vous avez donné votre accord.</p>
        <p>Si une pointure n’est plus disponible, nous vous le disons avant toute validation ; aucune somme n’est due pour un article non disponible.</p>
      </Section>

      <Section title="5. Paiement">
        <p>Aucun paiement n’est effectué sur le site. Le mode de paiement est convenu avec vous lors de l’appel de confirmation.</p>
      </Section>

      <Section title="6. Livraison, échange et rétractation">
        <p>Livraison partout au Maroc. Les modalités, l’échange de pointure et le droit de rétractation de 7 jours sont détaillés sur la page <Link href="/policies/refund">Livraison et retours</Link>, qui fait partie des présentes conditions.</p>
      </Section>

      <Section title="7. Garantie">
        <p>Vous bénéficiez de la garantie légale contre les défauts de la chose vendue prévue par le Dahir des obligations et contrats. En cas de défaut, contactez-nous avec une photo : nous proposons un échange ou un remboursement.</p>
      </Section>

      <Section title="8. Données personnelles">
        <p>Les informations nécessaires à votre commande sont traitées conformément à la loi n° 09-08. Voir la page <Link href="/policies/privacy">Confidentialité</Link>.</p>
      </Section>

      <Section title="9. Litiges">
        <p>En cas de désaccord, écrivez-nous d’abord : nous cherchons toujours une solution à l’amiable. À défaut, le litige relève des tribunaux marocains compétents{LEGAL.city ? `, notamment ceux de ${LEGAL.city}` : ""}.</p>
      </Section>
    </Policy>
  );
}
