"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useAccount } from "@/components/account/AccountProvider";
import { Button } from "@/components/ui/Button";
import styles from "./page.module.css";

type Mode = "signin" | "register";

function AuthForms() {
  const { signIn } = useAccount();
  const [mode, setMode] = useState<Mode>("signin");
  const [values, setValues] = useState({ firstName: "", lastName: "", email: "", password: "" });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!values.email || !values.password) return;
    // → Shopify `customerAccessTokenCreate` (Se connecter) or
    //   `customerCreate` (Créer un compte). No backend yet, so any email +
    //   password combination opens a session — the form itself, and what it
    //   collects, already matches what that call will need.
    signIn(values.email, mode === "register" ? values.firstName : undefined);
  };

  return (
    <>
      <div className={styles.tabs} role="tablist">
        <button
          type="button"
          role="tab"
          className={styles.tab}
          data-active={mode === "signin"}
          aria-selected={mode === "signin"}
          onClick={() => setMode("signin")}
        >
          Se connecter
        </button>
        <button
          type="button"
          role="tab"
          className={styles.tab}
          data-active={mode === "register"}
          aria-selected={mode === "register"}
          onClick={() => setMode("register")}
        >
          Créer un compte
        </button>
      </div>

      <form className={styles.form} onSubmit={onSubmit}>
        {mode === "register" && (
          <div className={styles.row2}>
            <div className={styles.field}>
              <label htmlFor="acc-first">Prénom</label>
              <input
                id="acc-first"
                autoComplete="given-name"
                required
                value={values.firstName}
                onChange={(e) => setValues((v) => ({ ...v, firstName: e.target.value }))}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="acc-last">Nom</label>
              <input
                id="acc-last"
                autoComplete="family-name"
                required
                value={values.lastName}
                onChange={(e) => setValues((v) => ({ ...v, lastName: e.target.value }))}
              />
            </div>
          </div>
        )}

        <div className={styles.field}>
          <label htmlFor="acc-email">E-mail</label>
          <input
            id="acc-email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="acc-password">Mot de passe</label>
          <input
            id="acc-password"
            type="password"
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            required
            minLength={6}
            value={values.password}
            onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
          />
        </div>

        <div className={styles.submitRow}>
          <Button type="submit" variant="editorial">
            {mode === "register" ? "Créer mon compte" : "Se connecter"}
          </Button>
        </div>

        <p className={styles.note}>
          En {mode === "register" ? "créant un compte" : "vous connectant"}, vous acceptez nos{" "}
          <Link href="/policies/terms">conditions générales</Link> et notre{" "}
          <Link href="/policies/privacy">politique de confidentialité</Link>.
        </p>
      </form>
    </>
  );
}

function Dashboard() {
  const { customer, signOut } = useAccount();
  if (!customer) return null;

  return (
    <>
      <div className={styles.hello}>
        <h1 className={styles.helloTitle}>Bonjour, {customer.firstName}</h1>
        <button type="button" className={styles.signOut} onClick={signOut}>
          Se déconnecter
        </button>
      </div>

      <div className={styles.panels}>
        <div className={styles.panel}>
          <p className={styles.panelTitle}>Commandes</p>
          <p className={styles.panelBody}>
            Vous n&apos;avez pas encore de commande.{" "}
            <Link href="/collections/nouveautes">Découvrir la collection →</Link>
          </p>
        </div>

        <div className={styles.panel}>
          <p className={styles.panelTitle}>Adresses</p>
          <p className={styles.panelBody}>Aucune adresse enregistrée pour le moment.</p>
        </div>

        <div className={styles.panel}>
          <p className={styles.panelTitle}>Informations du compte</p>
          <p className={styles.panelBody}>{customer.email}</p>
        </div>
      </div>
    </>
  );
}

export function AccountView() {
  const { customer, hydrated } = useAccount();

  // Avoids a signed-out flash before localStorage has been read.
  if (!hydrated) return null;

  return customer ? <Dashboard /> : <AuthForms />;
}
