import Link from "next/link";
import s from "../../admin.module.css";
import { getStore } from "../../../../../radar/lib/store.ts";
import { createCandidateAction } from "../actions";
import { Flash, Header } from "../ui";

export default async function NewCandidate({ searchParams }: { searchParams: Promise<{ err?: string }> }) {
  const { err } = await searchParams;
  return (
    <main className={s.wrap}>
      <Header storeKind={getStore().kind} />
      <p className={s.small}><Link href="/admin/radar">← Radar</Link></p>
      <Flash err={err} />
      <section className={s.panel}>
        <h1 className={s.h1}>Nouveau candidat</h1>
        <p className={s.sub}>Laisser vide ce qui n&apos;est pas connu. Un candidat existant (même SKU, ou même marque + modèle + coloris) n&apos;est pas dupliqué.</p>
        <form action={createCandidateAction} className={s.form}>
          <label className={s.field}>Marque<input name="brand" required list="brands" /></label>
          <label className={s.field}>Modèle<input name="model" required /></label>
          <label className={s.field}>Coloris<input name="colorway" placeholder="vide = modèle, tous coloris" /></label>
          <label className={s.field}>SKU<input name="sku" /></label>
          <label className={s.field}>Genre<select name="gender" defaultValue=""><option value="">Inconnu</option><option value="women">Femme</option><option value="men">Homme</option><option value="unisex">Unisexe</option></select></label>
          <label className={s.field}>Famille de style<select name="style_family" defaultValue=""><option value="">,</option>{["low-profile", "retro-runner", "y2k-runner", "skate", "basketball-retro", "terrace", "racing", "technical", "icon"].map((f) => <option key={f}>{f}</option>)}</select></label>
          <label className={s.field}>Prix officiel<input name="official_price" type="number" step="any" /></label>
          <label className={s.field}>Devise<input name="official_currency" placeholder="EUR" /></label>
          <label className={`${s.field} ${s.wide}`}>URL officielle<input name="official_url" type="url" placeholder="https://" /></label>
          <label className={`${s.field} ${s.wide}`}>Notes<textarea name="notes" /></label>
          <datalist id="brands">{["ASICS", "adidas", "New Balance", "PUMA", "Nike", "Saucony", "Salomon", "Vans", "Jordan", "Mizuno"].map((b) => <option key={b} value={b} />)}</datalist>
          <button className={`${s.btn} ${s.btnPrimary}`}>Créer</button>
        </form>
      </section>
    </main>
  );
}
