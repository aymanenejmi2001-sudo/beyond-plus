import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "./ContactForm";
import styles from "./page.module.css";

export const metadata = { title: "Contact", description: "Une question sur une pointure ou une commande ? Écrivez à BEYOND PLUS, réponse sur WhatsApp. Livraison partout au Maroc.", alternates: { canonical: "/contact" } };

export default function Page() {
  return (
    <>
      <PageHeader title="Contact" description="Une pointure, un modèle, une commande : écrivez-nous, on répond sur WhatsApp." />
      <div className={styles.body}><ContactForm /></div>
    </>
  );
}
