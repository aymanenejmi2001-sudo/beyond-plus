/* eslint-disable @next/next/no-img-element -- Admin/local preview images and small brand marks use explicit dimensions or CSS bounds. */
import s from "../../admin.module.css";
import { adminConfigured } from "../../../../../radar/lib/auth.ts";
import { login } from "../actions";

export default async function Login({ searchParams }: { searchParams: Promise<{ err?: string }> }) {
  const { err } = await searchParams;
  return (
    <main className={s.loginShell}>
      <div className={s.loginArt} style={{ backgroundImage: "url(/images/beyond/men-chrome.jpg)" }} aria-hidden />
      <div className={s.loginPanel}>
        <span className={s.logo} style={{ color: "#fff" }}>
          <img src="/images/beyond/symbol-256.png" alt="" width="26" height="26" style={{ filter: "invert(1)" }} />BEYOND PLUS<em>RADAR</em>
        </span>
        <h1 className={s.heroTitle}>Espace<br /><span>interne.</span></h1>
        <p>Sélection et publication des sneakers.</p>
        {!adminConfigured() ? (
          <p className={s.loginErr}>Accès fermé : définir RADAR_ADMIN_PASSWORD dans les variables d&apos;environnement.</p>
        ) : (
          <form action={login}>
            <div className={s.loginField}>
              <input name="password" type="password" autoComplete="current-password" placeholder="Mot de passe" aria-label="Mot de passe" required autoFocus />
              <button>Entrer</button>
            </div>
            {err && <p className={s.loginErr} role="alert" style={{ marginTop: 10 }}>Mot de passe incorrect.</p>}
          </form>
        )}
      </div>
    </main>
  );
}
