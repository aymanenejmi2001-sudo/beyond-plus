import { PageHeader } from "@/components/layout/PageHeader";
import { CheckoutView } from "./CheckoutView";
import styles from "./page.module.css";

export const metadata = { title: "Commande", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <>
      <PageHeader title="Commande" />
      <div className={styles.body}><CheckoutView /></div>
    </>
  );
}
