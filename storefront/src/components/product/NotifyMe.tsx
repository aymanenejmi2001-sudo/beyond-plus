"use client";

import { useState } from "react";
import { track } from "@/lib/commerce/track";
import styles from "./NotifyMe.module.css";

export function NotifyMe({ handle, size }: { handle: string; size: string }) {
  const [contact, setContact] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const r = await fetch("/api/stock-alert", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ handle, size, contact }) });
      if (!r.ok) throw new Error();
      track("notify_me", handle, { size });
      setState("done");
    } catch { setState("error"); }
  };
  if (state === "done") return <p className={styles.done} role="status">C’est noté : on vous prévient dès que le {size} revient.</p>;
  return (
    <form className={styles.form} onSubmit={submit}>
      <p className={styles.label}>Le {size} n’est plus disponible. Prévenez-moi quand ma taille revient :</p>
      <div className={styles.row}>
        <input
          required
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="E-mail ou téléphone"
          aria-label="E-mail ou téléphone"
          autoComplete="email"
          maxLength={120}
        />
        <button type="submit" disabled={state === "sending"}>{state === "sending" ? "Envoi…" : "Me prévenir"}</button>
      </div>
      {state === "error" && <p className={styles.error} role="alert">Envoi impossible. Vérifiez l’e-mail ou le numéro, puis réessayez.</p>}
      <p className={styles.small}>Utilisé uniquement pour cette alerte.</p>
    </form>
  );
}
