"use client";
import { useFormStatus } from "react-dom";
import s from "../admin.module.css";

export function DeployButton() {
  const { pending } = useFormStatus();
  return (
    <button className={s.deployBtn} disabled={pending}>
      {pending ? "Lancement…" : "Mettre en ligne maintenant"}
    </button>
  );
}
