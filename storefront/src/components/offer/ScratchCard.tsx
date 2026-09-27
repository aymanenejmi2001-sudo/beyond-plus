"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/components/ui/icons";
import { OFFER_KEY, OFFER_SEEN_KEY, readOffer, type StoredOffer } from "@/lib/commerce/offer-shared";
import { promotion, track } from "@/lib/commerce/track";
import styles from "./ScratchCard.module.css";

// First-order scratch card. Shown once per session, after ~10 s or a little
// scroll, never on checkout/admin, never if an offer is already saved. The
// amount is unknown to the page until the card is scratched: it comes from the
// server (/api/offer), which also signs the code applied at checkout.
const DELAY = 10_000;
const SCROLL = 600;
const REVEAL_AT = 0.45;
const PROMO = promotion({ id: "first-order-scratch", name: "Surprise première commande", location: "scratch_card" });

export function ScratchCard() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState<StoredOffer | null>(null);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const blocked = /^\/(checkout|admin|account)/.test(path ?? "");

  // Trigger: after DELAY or SCROLL px, once per session.
  useEffect(() => {
    if (blocked) return;
    try { if (sessionStorage.getItem(OFFER_SEEN_KEY) || readOffer()) return; } catch { return; }
    let done = false;
    const show = () => {
      if (done) return; done = true;
      try { sessionStorage.setItem(OFFER_SEEN_KEY, "1"); } catch { /* private mode */ }
      setOpen(true);
      track("view_promotion", undefined, { ecommerce: PROMO });
    };
    const t = setTimeout(show, DELAY);
    const onScroll = () => { if (window.scrollY > SCROLL) show(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, [blocked]);

  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const reveal = useCallback(async () => {
    if (busy.current || revealed) return;
    busy.current = true;
    try {
      const r = await fetch("/api/offer", { method: "POST" });
      const o = await r.json();
      if (!r.ok || !o.code) throw new Error();
      const stored: StoredOffer = { code: o.code, percent: o.percent, expiresAt: o.expiresAt };
      try { localStorage.setItem(OFFER_KEY, JSON.stringify(stored)); } catch { /* shown, not saved */ }
      setRevealed(stored);
      track("select_promotion", undefined, { ecommerce: PROMO });
    } catch {
      setError("La surprise n’a pas pu être chargée. Réessayez plus tard.");
    } finally { busy.current = false; }
  }, [revealed]);

  // Scratch layer: a canvas painted over the result, erased under the finger.
  useEffect(() => {
    if (!open || revealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * dpr; canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, "#5b1a24"); g.addColorStop(1, "#2a0c11");
    ctx.fillStyle = g; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255,255,255,.9)";
    ctx.font = "500 12px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GRATTE ICI", width / 2, height / 2 + 4);
    ctx.globalCompositeOperation = "destination-out";

    let drawing = false, last: [number, number] | null = null, moves = 0;
    const at = (e: PointerEvent): [number, number] => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const stroke = (p: [number, number]) => {
      ctx.lineWidth = 34; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(...(last ?? p)); ctx.lineTo(...p); ctx.stroke();
      last = p;
    };
    const cleared = () => {
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let clear = 0, n = 0;
      for (let i = 3; i < data.length; i += 4 * 24) { n++; if (data[i] === 0) clear++; }
      return clear / n;
    };
    const down = (e: PointerEvent) => { drawing = true; last = null; canvas.setPointerCapture(e.pointerId); stroke(at(e)); };
    const move = (e: PointerEvent) => {
      if (!drawing) return;
      stroke(at(e));
      if (++moves % 8 === 0 && cleared() > REVEAL_AT) { drawing = false; void reveal(); }
    };
    const up = () => { drawing = false; last = null; if (cleared() > REVEAL_AT) void reveal(); };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, [open, revealed, reveal]);

  if (!open || blocked) return null;
  return (
    <div ref={panelRef} className={styles.sheet} role="dialog" aria-modal="false" aria-labelledby="scratch-title" tabIndex={-1}>
      <button type="button" className={styles.close} onClick={close} aria-label="Fermer"><CloseIcon size={18} /></button>
      <p className={styles.eyebrow}>BEYOND PLUS</p>
      <h2 id="scratch-title" className={styles.title}>{revealed ? "C’est à toi." : "Une surprise pour ta première commande."}</h2>
      <div className={styles.card}>
        <div className={styles.result} aria-live="polite">
          {revealed ? <p className={styles.amount}>Tu as débloqué {revealed.percent} % de remise.</p> : <p className={styles.placeholder}>BEYOND PLUS</p>}
        </div>
        {!revealed && <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />}
      </div>
      {revealed ? (
        <>
          <p className={styles.text}>Appliquée automatiquement sur ta première commande, valable 7 jours.</p>
          <button type="button" className={styles.cta} onClick={close}>Continuer mes achats</button>
        </>
      ) : (
        <>
          <p className={styles.text}>Gratte pour découvrir.</p>
          <button type="button" className={styles.alt} onClick={() => void reveal()}>Révéler sans gratter</button>
        </>
      )}
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  );
}
