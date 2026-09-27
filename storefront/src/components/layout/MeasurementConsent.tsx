"use client";
import { useEffect, useState } from "react";
import { CONSENT_KEY } from "@/lib/commerce/track";
export function MeasurementConsent() {
  const [choice, setChoice] = useState<string | null>(null);
  useEffect(() => { try { setChoice(localStorage.getItem(CONSENT_KEY)); } catch {} }, []);
  function select(value: string) { setChoice(value); try { localStorage.setItem(CONSENT_KEY, value); } catch {} }
  return <div style={{padding:"1.6rem",fontSize:"1.2rem",lineHeight:1.6}}>
    <p>Mesure facultative : autoriser le comptage des consultations et des clics, sans coordonnées personnelles ni identifiant visiteur ?</p>
    <button onClick={() => select("yes")} aria-pressed={choice === "yes"} style={{padding:"1rem",textDecoration:"underline"}}>Autoriser</button>
    <button onClick={() => select("no")} aria-pressed={choice === "no"} style={{padding:"1rem",textDecoration:"underline"}}>Refuser</button>
    {choice && <span role="status">{choice === "yes" ? "Mesure autorisée. Vous pouvez la refuser à tout moment ici." : "Mesure désactivée."}</span>}
  </div>;
}
