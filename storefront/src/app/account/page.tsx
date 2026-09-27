import { PageHeader } from "@/components/layout/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import styles from "./page.module.css";

export const metadata = { title: "Suivi de commande", robots: { index: false, follow: true } };

export default function Page() {
  return (
    <>
      <PageHeader title="Suivi de commande" description="Une question sur votre commande ou sa livraison ? Écrivez-nous, on vous répond vite." />
      <div className={styles.body}>
        <LinkButton href="/contact" variant="editorial">Suivre ma commande</LinkButton>
      </div>
    </>
  );
}
