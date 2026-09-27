import { Policy, Section, SellerIdentity, whatsappDisplay } from "@/components/policy/Policy";
import { LEGAL } from "@/data/legal";

export const metadata = {
  alternates: { canonical: "/policies/privacy" },
  title: "Confidentialité",
  description: "Quelles données BEYOND PLUS utilise, pourquoi, et comment exercer vos droits (loi 09-08).",
};

export default function Page() {
  return (
    <Policy title="Confidentialité" intro="Nous utilisons le moins de données possible, uniquement pour traiter votre commande.">
      <Section title="Responsable">
        <SellerIdentity />
        <p>Ces traitements respectent la loi n° 09-08 relative à la protection des personnes physiques à l’égard du traitement des données à caractère personnel{LEGAL.cndp ? ` (déclaration CNDP n° ${LEGAL.cndp})` : ""}.</p>
      </Section>

      <Section title="Ce que nous recevons">
        <ul>
          <li><strong>Commande</strong> : votre prénom, votre téléphone, votre ville, votre adresse de livraison et, si vous l’indiquez, votre e-mail, saisis sur la page Commande, nous sont transmis par e-mail pour confirmer et livrer votre commande. Si vous indiquez votre e-mail, nous vous envoyons un récapitulatif de commande. Si vous nous écrivez sur WhatsApp, vos messages.</li>
          <li><strong>Demande préparée</strong> : lorsque le stockage est disponible, le site enregistre une référence, les articles, les pointures et le montant. Vos coordonnées (prénom, téléphone, ville, adresse) ne sont pas incluses dans cet enregistrement : elles sont seulement transmises par e-mail à notre boîte hello@beyondplusmaroc.com (hébergée par Hostinger).</li>
          <li><strong>Formulaire de contact</strong> : il ne stocke rien sur nos serveurs ; il ouvre simplement WhatsApp avec votre message.</li>
        </ul>
        <p>Nous ne vendons ni ne louons vos données, et nous ne les utilisons pas pour de la publicité sans votre accord.</p>
      </Section>

      <Section title="Ce qui reste dans votre navigateur">
        <p>Votre panier est conservé dans votre navigateur pour reprendre vos achats. Les articles sont transmis au site pour revérifier prix et disponibilité avant de préparer votre demande. Vous pouvez vider le panier ou effacer les données du site à tout moment.</p>
        <p>Le site ne dépose pas de cookie publicitaire. Avec votre accord depuis le pied de page, nous comptons les consultations de produits, ajouts au panier, débuts de demande et clics WhatsApp. Ces événements ne contiennent ni coordonnées personnelles ni identifiant visiteur. Vous pouvez refuser ou retirer votre accord dans le pied de page.</p>
      </Section>

      <Section title="Pourquoi et combien de temps">
        <p>Vos données servent à confirmer, préparer, livrer et suivre votre commande, et à répondre à vos questions. Elles sont conservées le temps de la relation commerciale, puis la durée imposée par nos obligations légales et comptables.</p>
      </Section>

      <Section title="Qui y a accès">
        <ul>
          <li>L’équipe BEYOND PLUS qui traite votre commande.</li>
          <li>Le livreur, pour votre nom, votre téléphone et votre adresse.</li>
          <li>WhatsApp (Meta), qui transporte nos échanges, l’hébergeur du site (Vercel) et notre messagerie (Hostinger), qui peuvent enregistrer des données techniques de connexion comme l’adresse IP.</li>
        </ul>
      </Section>

      <Section title="Vos droits">
        <p>Vous pouvez à tout moment demander l’accès à vos données, leur rectification ou leur suppression, et vous opposer à leur utilisation, en nous écrivant sur WhatsApp ({whatsappDisplay()}){LEGAL.email ? ` ou à ${LEGAL.email}` : ""}. Vous pouvez aussi saisir la CNDP (www.cndp.ma).</p>
      </Section>
    </Policy>
  );
}
