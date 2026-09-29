"use client";
import { useFormStatus } from "react-dom";

/** Shows that the click was taken into account (publishing takes a few seconds). */
export function PublishButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending} aria-busy={pending}>{pending ? "Publication…" : "Publier"}</button>;
}
