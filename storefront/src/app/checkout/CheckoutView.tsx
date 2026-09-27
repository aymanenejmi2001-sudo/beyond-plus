"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { formatMoney } from "@/lib/shopify/money";
import { Button, LinkButton } from "@/components/ui/Button";
import { whatsappUrl } from "@/data/store";
import { COMMERCE, optionLabel } from "@/data/commerce";
import { cartInput, cartSignature } from "@/lib/commerce/quote";
import { ecommerce, lineItem, track } from "@/lib/commerce/track";
import styles from "./page.module.css";

type Placed = { id: string; phone: string; notified: boolean; recorded: boolean; text: string };
const PLACED_KEY = "beyond.order.placed";
const PHONE = /^\+?[0-9 ().-]{9,20}$/;
export function CheckoutView() {
  const { cart, notice, refresh, replaceLines, open, clear } = useCart();
  const [form, setForm] = useState({ firstName: "", phone: "", email: "", city: "", address: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState<Placed | null>(null);
  const started = useRef(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  useEffect(() => {
    try { const saved = JSON.parse(sessionStorage.getItem(PLACED_KEY) ?? "null"); if (saved?.id) setPlaced(saved); } catch { /* nothing saved */ }
  }, []);
  useEffect(() => {
    if (!cart.lines.length || started.current) return;
    started.current = true;
    void refresh().catch(() => setError("Le panier sera revérifié avant l’envoi de votre commande."));
  }, [cart.lines.length, refresh]);
  const signature = cartSignature(cart.lines);

  async function submit(e: FormEvent) {
    e.preventDefault(); setError("");
    if (!PHONE.test(form.phone.trim())) { setError("Vérifiez votre numéro de téléphone (ex. 06 12 34 56 78)."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: crypto.randomUUID(), lines: cartInput(cart.lines), signature, firstName: form.firstName.trim(), phone: form.phone.trim(), city: form.city.trim(), address: form.address.trim(), email: form.email.trim() }) });
      const result = await response.json();
      if (!response.ok) { if (result.lines) replaceLines(result.lines); throw new Error(result.error); }
      // Fallback text, used only if the shop could not be notified by e-mail.
      const text = [
        `Commande BEYOND PLUS ${result.id}`, COMMERCE.nature,
        ...result.lines.map((l: typeof cart.lines[number]) => `• ${l.merchandise.product.title}, ${l.merchandise.selectedOptions.map(o => `${optionLabel(o.name)} ${o.value}`).join(", ")} × ${l.quantity} : ${formatMoney(l.cost.totalAmount)}`),
        `Total : ${result.total} DH (livraison gratuite)`,
        `${form.firstName.trim()}, ${form.phone.trim()}`, `${form.address.trim()}, ${form.city.trim()}`,
      ].join("\n");
      const next: Placed = { id: result.id, phone: form.phone.trim(), notified: Boolean(result.notified), recorded: Boolean(result.recorded), text };
      setPlaced(next);
      track("purchase", undefined, { ecommerce: ecommerce((result.lines as typeof cart.lines).map(lineItem), { transaction_id: String(result.id), value: Number(result.total), shipping: 0 }) });
      if (next.notified || next.recorded) clear();
      try { sessionStorage.setItem(PLACED_KEY, JSON.stringify(next)); } catch { /* shown in memory */ }
    } catch (e) { setError(e instanceof Error ? e.message : "Impossible d’envoyer la commande. Votre panier est conservé, réessayez."); }
    finally { setBusy(false); }
  }

  if (placed) return <div className={styles.confirmed}>
    <p className={styles.orderNumber}>Commande BP-{placed.id.replace(/-/g, "").slice(0, 6).toUpperCase()}</p>
    <h2 className={styles.confirmedTitle}>{placed.notified ? "Commande reçue, merci." : "Encore une étape."}</h2>
    {placed.notified ? <p className={styles.confirmedBody}>Nous vous appelons au {placed.phone} pour confirmer votre pointure et la livraison avant l’envoi. {COMMERCE.shipping}</p>
      : <><p className={styles.confirmedBody}>Nous n’avons pas pu transmettre votre commande automatiquement. Envoyez-la en un clic sur WhatsApp : elle est déjà rédigée.</p>
        <LinkButton href={whatsappUrl(placed.text)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click")} variant="primary">Envoyer sur WhatsApp</LinkButton></>}
    <p><Link href="/contact">Une question ? Écrivez-nous</Link></p>
    <Button variant="text" onClick={() => { setPlaced(null); try { sessionStorage.removeItem(PLACED_KEY); } catch {} }}>Passer une autre commande</Button>
  </div>;
  if (!cart.lines.length) return <div className={styles.empty}><p>Votre panier est vide.</p><LinkButton href="/collections/nouveautes">Découvrir la sélection</LinkButton></div>;
  return <div className={styles.grid}>
    <div>
      <p className={styles.paymentNote}>{COMMERCE.nature}. {COMMERCE.shipping}</p>
      <form onSubmit={submit} className={styles.form} style={{marginTop:"2.4rem"}}>
        <div className={styles.field}><label htmlFor="co-first">Prénom</label><input id="co-first" autoComplete="given-name" required maxLength={60} value={form.firstName} onChange={set("firstName")} pattern=".*\S.*" /></div>
        <div className={styles.field}><label htmlFor="co-phone">Téléphone</label><input id="co-phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={20} placeholder="06 12 34 56 78" value={form.phone} onChange={set("phone")} /></div>
        <div className={styles.field}><label htmlFor="co-email">E-mail <span style={{ color: "rgb(var(--c-fg-2))" }}>(facultatif, pour recevoir la confirmation)</span></label><input id="co-email" type="email" inputMode="email" autoComplete="email" maxLength={120} value={form.email} onChange={set("email")} /></div>
        <div className={styles.field}><label htmlFor="co-city">Ville</label><input id="co-city" autoComplete="address-level2" required maxLength={80} value={form.city} onChange={set("city")} pattern=".*\S.*" /></div>
        <div className={styles.field}><label htmlFor="co-address">Adresse de livraison</label><input id="co-address" autoComplete="street-address" required maxLength={200} value={form.address} onChange={set("address")} pattern=".*\S.*" /></div>
        <p>{COMMERCE.payment}</p>
        <p><Link href="/policies/refund">Livraison et retours</Link> · <Link href="/policies/terms">Conditions de vente</Link> · <Link href="/policies/privacy">Confidentialité</Link></p>
        {notice && <p role="status">{notice}</p>}
        {error && <p role="alert">{error}</p>}
        <Button type="submit" disabled={busy} variant="editorial">{busy ? "Envoi de la commande…" : `Confirmer la commande · ${formatMoney(cart.cost.totalAmount)}`}</Button>
        <p style={{ color: "rgb(var(--c-fg-2))" }}>Nous vous appelons pour confirmer avant l’envoi. Rien n’est expédié sans votre accord.</p>
      </form>
    </div>
    <div className={styles.summary}>
      {cart.lines.map(line => <div className={styles.summaryLine} key={line.id}>
        <div className={styles.summaryThumb}>{line.merchandise.image && <Image src={line.merchandise.image.url} alt={line.merchandise.product.title} width={128} height={128} sizes="64px" />}</div>
        <div><p className={styles.summaryTitle}><Link href={`/products/${line.merchandise.product.handle}`}>{line.merchandise.product.title}</Link></p><p className={styles.summaryVariant}>{line.merchandise.selectedOptions.map(o => `${optionLabel(o.name)} : ${o.value}`).join(" · ")}</p><p className={styles.summaryQty}>Quantité {line.quantity}</p></div>
        <span className={styles.summaryPrice}>{formatMoney(line.cost.totalAmount)}</span>
      </div>)}
      <div className={styles.totals}><div className={styles.totalRow}><span>Livraison sous 12 à 48 h après confirmation</span><span>Gratuite</span></div><div className={`${styles.totalRow} ${styles.grandTotal}`}><span>Total</span><span>{formatMoney(cart.cost.totalAmount)}</span></div></div>
      <Button variant="text" onClick={open}>Modifier le panier</Button>
    </div>
  </div>;
}
