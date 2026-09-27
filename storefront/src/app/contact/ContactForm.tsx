"use client";

/* No backend: the message is handed to WhatsApp (see data/store.ts). */

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { whatsappUrl } from "@/data/store";
import styles from "./page.module.css";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", message: "" });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!values.name || !values.email || !values.message) return;
    window.open(whatsappUrl(`${values.message}\n\n${values.name} · ${values.email}`), "_blank", "noopener");
    setSent(true);
  };

  if (sent) {
    return (
      <p className={styles.done} role="status">
        Merci, {values.name.split(" ")[0]}. Votre message est prêt dans WhatsApp : il ne reste
        qu’à l’envoyer.
      </p>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.field}>
        <label htmlFor="contact-name">Nom</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-email">E-mail</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
        />
      </div>
      <div className={styles.submitRow}>
        <Button type="submit" variant="editorial">
          Envoyer sur WhatsApp
        </Button>
      </div>
    </form>
  );
}
