import { PageHeader } from "@/components/layout/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { LEGAL } from "@/data/legal";
import { STORE } from "@/data/store";
import styles from "@/app/policies/policy.module.css";

export function Policy({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <>
      <PageHeader title={title} description={intro} />
      <div className={styles.body}>
        <p className={styles.updated}>Dernière mise à jour : {LEGAL.updated}</p>
        {children}
        <div className={styles.section}>
          <LinkButton href="/contact" variant="editorial">Nous écrire</LinkButton>
        </div>
      </div>
    </>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.prose}>{children}</div>
    </section>
  );
}

export const whatsappDisplay = () => {
  const d = STORE.whatsapp.replace(/\D/g, "");
  return d.startsWith("212") ? `0${d.slice(3, 4)} ${d.slice(4, 6)} ${d.slice(6, 8)} ${d.slice(8, 10)} ${d.slice(10, 12)}` : `+${d}`;
};

/** Seller identity: only the fields that are filled in src/data/legal.ts. */
export function SellerIdentity() {
  const rows = [
    ["Enseigne", LEGAL.tradeName], ["Société", LEGAL.company], ["Siège", LEGAL.address], ["ICE", LEGAL.ice], ["RC", LEGAL.rc],
    ["WhatsApp", whatsappDisplay()], ["E-mail", LEGAL.email],
  ].filter(([, v]) => v) as [string, string][];
  return <ul>{rows.map(([k, v]) => <li key={k}>{k} : {v}</li>)}</ul>;
}
