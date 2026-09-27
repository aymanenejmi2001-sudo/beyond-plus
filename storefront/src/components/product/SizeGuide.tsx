"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { CloseIcon } from "@/components/ui/icons";
import styles from "./SizeGuide.module.css";

// Native <dialog>: no dependency, focus trap and Escape handled by the browser.
export function SizeGuide({ open, onClose, sizes }: { open: boolean; onClose(): void; sizes: string[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className={styles.dialog} onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }} aria-labelledby="size-guide-title">
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="size-guide-title" className={styles.title}>Guide des tailles</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Fermer le guide des tailles"><CloseIcon size={18} /></button>
        </div>
        <ol className={styles.steps}>
          <li><strong>Mesurez votre pied</strong> : talon contre un mur, tracez la pointe du pied le plus long, mesurez en centimètres. En fin de journée, avec vos chaussettes.</li>
          <li><strong>Choisissez votre pointure habituelle</strong> parmi celles disponibles pour cette paire.</li>
          <li><strong>On confirme par téléphone</strong> avant l’envoi, avec votre mesure en cm. Entre deux pointures ou pied large : dites-le nous à l’appel.</li>
        </ol>
        {sizes.length > 0 && <p className={styles.available}>Pointures disponibles pour cette paire : <strong>{sizes.join(", ")}</strong></p>}
        <p className={styles.note}>Il n’existe pas de tableau cm universel : les mesures d’une réplique peuvent différer du modèle original. Échange de pointure possible sous 3 jours (paire non portée, boîte d’origine).</p>
        <Link href="/guides/quelle-pointure-choisir-sneakers" className={styles.link} onClick={onClose}>Le guide complet des pointures</Link>
      </div>
    </dialog>
  );
}
