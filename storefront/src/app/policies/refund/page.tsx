import Link from "next/link";
import { Policy, Section, whatsappDisplay } from "@/components/policy/Policy";

export const metadata = {
  alternates: { canonical: "/policies/refund" },
  title: "Livraison et retours",
  description: "Livraison gratuite partout au Maroc en 12 à 48 h, échange de pointure sous 3 jours, droit de rétractation de 7 jours : les conditions BEYOND PLUS.",
};

export default function Page() {
  return (
    <Policy title="Livraison et retours" intro="Livraison gratuite partout au Maroc. Chaque commande est confirmée avec vous par téléphone avant l’envoi.">
      <Section title="Commander">
        <p>Ajoutez vos paires au panier, puis confirmez la commande sur le site avec votre téléphone et votre adresse. Nous vous appelons pour confirmer la pointure et le prix total. La commande n’est validée qu’avec votre accord.</p>
        <p>Il n’y a aucun paiement en ligne sur le site : le mode de paiement est convenu avec vous lors de notre appel de confirmation.</p>
      </Section>

      <Section title="Livraison">
        <ul>
          <li>Nous livrons partout au Maroc : Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir et ailleurs.</li>
          <li>La livraison est gratuite partout au Maroc sous 12 à 48 heures après confirmation de la commande.</li>
          <li>À la réception, vérifiez l’état du colis. En cas de colis abîmé ou de paire non conforme, prévenez-nous sur WhatsApp dès la réception, avec une photo.</li>
        </ul>
      </Section>

      <Section title="Échange de pointure">
        <p>La pointure ne va pas ? Vous disposez de <strong>3 jours après la livraison</strong> pour demander un échange de pointure sur WhatsApp. La nouvelle pointure vous est envoyée selon sa disponibilité ; les frais de retour de la première paire sont à votre charge.</p>
        <p>Pour être échangée, la paire doit être non portée, dans son état d’origine et dans sa boîte. Notre <Link href="/guides/quelle-pointure-choisir-sneakers">guide des pointures</Link> aide à choisir la bonne taille du premier coup.</p>
      </Section>

      <Section title="Droit de rétractation : 7 jours">
        <p>Conformément à la loi n° 31-08 édictant des mesures de protection du consommateur (articles 36 et 37), vous disposez de <strong>7 jours à compter de la réception</strong> pour renoncer à votre achat, sans avoir à vous justifier ni à payer de pénalité. Seuls les frais de retour restent à votre charge.</p>
        <ul>
          <li>Prévenez-nous sur WhatsApp ({whatsappDisplay()}) dans ce délai.</li>
          <li>Renvoyez la paire non portée, complète, dans sa boîte d’origine.</li>
          <li>Nous vous remboursons les sommes versées au plus tard dans les 15 jours suivant l’exercice de ce droit.</li>
        </ul>
      </Section>

      <Section title="Erreur ou défaut">
        <p>Si vous recevez une paire qui ne correspond pas à votre commande ou qui présente un défaut, écrivez-nous avec une photo. Nous organisons l’échange ou le remboursement, et les frais d’envoi sont alors à notre charge.</p>
      </Section>
    </Policy>
  );
}
