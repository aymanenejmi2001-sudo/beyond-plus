"use client";

import Image from "next/image";
import Link from "next/link";
import { optionLabel } from "@/data/commerce";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/shopify/types";
import { ecommerce, lineItem, track } from "@/lib/commerce/track";
import { discountFor, readOffer, type StoredOffer } from "@/lib/commerce/offer-shared";
import { useCart } from "./CartProvider";
import { useBodyLock } from "@/lib/hooks/useBodyLock";
import { formatMoney } from "@/lib/shopify/money";
import { LinkButton } from "@/components/ui/Button";
import { CloseIcon, ReturnIcon, SecureIcon, ShippingIcon } from "@/components/ui/icons";
import styles from "./CartDrawer.module.css";

export function CartDrawer() {
  const { cart, isOpen, close, removeLine, adjustQuantity, lastAddedId, notice, refresh } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  useBodyLock(isOpen);

  // Escape to close + focus the panel so the drawer is keyboard-reachable.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const refreshRef = useRef(refresh);
  useEffect(() => { refreshRef.current = refresh; }, [refresh]);
  const cartRef = useRef(cart);
  useEffect(() => { cartRef.current = cart; }, [cart]);
  useEffect(() => {
    if (!isOpen) return;
    const c = cartRef.current;
    track("view_cart", undefined, { ecommerce: ecommerce(c.lines.map(lineItem), { value: Number(c.cost.totalAmount.amount) }), items_count: c.totalQuantity });
    void refreshRef.current().catch(() => undefined);
  }, [isOpen]);

  // "Vous aimerez aussi": 3 in-stock pairs close to the last one added.
  const anchor = (cart.lines.find((l) => l.id === lastAddedId) ?? cart.lines[cart.lines.length - 1])?.merchandise.product.handle;
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  useEffect(() => {
    if (!isOpen || !anchor) return;
    let live = true;
    fetch(`/api/cards?related=${encodeURIComponent(anchor)}&limit=6`).then((r) => r.json()).then((p: Product[]) => { if (live) setSuggestions(p); }).catch(() => undefined);
    return () => { live = false; };
  }, [isOpen, anchor]);
  const inCart = new Set(cart.lines.map((l) => l.merchandise.product.handle));
  const picks = suggestions.filter((p) => !inCart.has(p.handle)).slice(0, 3);

  const empty = cart.lines.length === 0;
  // First-order offer revealed by the scratch card: shown here as an estimate,
  // the server applies it when the order is placed.
  const [offer, setOffer] = useState<StoredOffer | null>(null);
  useEffect(() => { if (isOpen) setOffer(readOffer()); }, [isOpen]);
  const subtotal = Number(cart.cost.subtotalAmount.amount);
  const discount = offer ? discountFor(subtotal, offer.percent) : 0;

  return (
    <>
      <div
        className={styles.overlay}
        data-open={isOpen}
        onClick={close}
        aria-hidden="true"
      />
      <aside
        ref={panelRef}
        className={styles.drawer}
        data-open={isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
        tabIndex={-1}
        inert={!isOpen}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>
            Votre panier <span className={styles.count}>({cart.totalQuantity})</span>
          </h2>
          <button type="button" className={styles.close} onClick={close} aria-label="Fermer le panier">
            <CloseIcon />
          </button>
        </header>

        <div className={styles.body}>
          {notice && <p role="status">{notice}</p>}
          {empty ? (
            <div className={styles.empty}>
              <p className="prose muted">Votre panier est vide.</p>
              <LinkButton href="/collections/nouveautes" variant="primary" onClick={close}>
                Découvrir la collection
              </LinkButton>
            </div>
          ) : (
            <ul className={styles.lines}>
              {cart.lines.map((line) => (
                <li
                  key={line.id}
                  className={styles.line}
                  data-flash={line.id === lastAddedId}
                >
                  <Link
                    href={`/products/${line.merchandise.product.handle}`}
                    className={styles.thumb}
                    onClick={close}
                  >
                    {line.merchandise.image && (
                      <Image
                        src={line.merchandise.image.url}
                        alt={line.merchandise.image.altText ?? line.merchandise.product.title}
                        width={176}
                        height={235}
                        sizes="88px"
                      />
                    )}
                  </Link>

                  <div className={styles.lineBody}>
                    <div className={styles.lineTop}>
                      <div>
                        <h3 className={styles.lineTitle}>
                          <Link
                            href={`/products/${line.merchandise.product.handle}`}
                            onClick={close}
                          >
                            {line.merchandise.product.title}
                          </Link>
                        </h3>
                        <p className={styles.lineVariant}>
                          {line.merchandise.selectedOptions
                            .map((o) => `${optionLabel(o.name)} : ${o.value}`)
                            .join(" · ")}
                        </p>
                      </div>
                      <span className={styles.linePrice}>
                        {formatMoney(line.cost.totalAmount)}
                      </span>
                    </div>

                    <div className={styles.lineBottom}>
                      <div className={styles.stepper}>
                        <button
                          type="button"
                          onClick={() => adjustQuantity(line.id, -1)}
                          aria-label="Diminuer la quantité"
                        >
                          −
                        </button>
                        <span className={styles.qty} aria-live="polite">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => adjustQuantity(line.id, 1)}
                          aria-label="Augmenter la quantité"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className={styles.remove}
                        onClick={() => { track("remove_from_cart", line.merchandise.product.handle, { ecommerce: ecommerce([lineItem(line)]) }); removeLine(line.id); }}
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {!empty && picks.length > 0 && (
            <section className={styles.picks} aria-labelledby="cart-picks">
              <h3 id="cart-picks" className={styles.picksTitle}>Vous aimerez aussi</h3>
              <ul className={styles.picksList}>
                {picks.map((p) => (
                  <li key={p.id}>
                    <Link href={`/products/${p.handle}`} className={styles.pick} onClick={() => { track("select_item", p.handle, { list: "cart" }); close(); }}>
                      {p.featuredImage && <Image src={p.featuredImage.url} alt={p.featuredImage.altText ?? p.title} width={160} height={160} sizes="80px" />}
                      <span className={styles.pickName}>{p.title}</span>
                      <span className={styles.pickPrice}>{formatMoney(p.priceRange.minVariantPrice)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {!empty && (
          <footer className={styles.footer}>
            <div className={styles.subtotal}>
              <span className={styles.subtotalLabel}>Sous-total</span>
              <span>{formatMoney(cart.cost.subtotalAmount)}</span>
            </div>
            {discount > 0 && (
              <div className={styles.shipping}>
                <span>Remise première commande ({offer!.percent} %)</span>
                <span>−{formatMoney({ amount: String(discount), currencyCode: "MAD" })}</span>
              </div>
            )}
            <div className={styles.shipping}>
              <span>Livraison</span>
              <span>Offerte</span>
            </div>
            {discount > 0 && (
              <div className={styles.subtotal}>
                <span className={styles.subtotalLabel}>Total</span>
                <span>{formatMoney({ amount: String(subtotal - discount), currencyCode: "MAD" })}</span>
              </div>
            )}
            {/* Answers the doubts that stop people at "Commander": no card
                form, a call first, free delivery, size exchange. */}
            <ul className={styles.assurance} aria-label="Avant de commander">
              <li><SecureIcon size={16} /><span><strong>Aucun paiement en ligne.</strong> On vous appelle pour confirmer avant l’envoi.</span></li>
              <li><ShippingIcon size={16} /><span>Livraison gratuite partout au Maroc, 12 à 48 h après confirmation.</span></li>
              <li><ReturnIcon size={16} /><span>Échange de pointure sous 3 jours après la livraison.</span></li>
            </ul>
            {/* → window.location.href = cart.checkoutUrl (Storefront Cart API)
                at go-live. Until then, /checkout reviews the same lines and
                confirms the order locally. */}
            <LinkButton href="/checkout" variant="editorial" block onClick={() => { track("begin_checkout", undefined, { ecommerce: ecommerce(cart.lines.map(lineItem), { value: Number(cart.cost.totalAmount.amount) }) }); close(); }}>
              Commander
            </LinkButton>
          </footer>
        )}
      </aside>
    </>
  );
}
