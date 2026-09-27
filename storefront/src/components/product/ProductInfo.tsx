"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/shopify/types";
import { formatMoney, isOnSale } from "@/lib/shopify/money";
import { findVariant, type OptionSelection } from "@/lib/shopify/variants";
import { ProductGallery } from "./ProductGallery";
import { SizeSelector } from "./SizeSelector";
import { AddToCart } from "./AddToCart";
import { Accordion } from "./Accordion";
import styles from "./ProductInfo.module.css";
import { ecommerce, productItem, track } from "@/lib/commerce/track";
import { COMMERCE } from "@/data/commerce";
import { useCart } from "@/components/cart/CartProvider";
import { useStoredList, RECENT_KEY } from "@/lib/hooks/useStoredList";
import { WishlistButton } from "./WishlistButton";
import { SizeGuide } from "./SizeGuide";
import { StickyBuyBar } from "./StickyBuyBar";
import { NotifyMe } from "./NotifyMe";
import { reviewsFor } from "@/data/reviews";
import { useOffer } from "@/lib/hooks/useOffer";
import { discountFor } from "@/lib/commerce/offer-shared";

const SERVICES: string[] = [];

export function ProductInfo({ product, trail = [] }: { product: Product; trail?: { title: string; href: string }[] }) {
  const { add: remember } = useStoredList(RECENT_KEY, 8);
  const viewed = useRef<string | null>(null);
  useEffect(() => {
    remember(product.handle);
    if (viewed.current === product.handle) return; // once per product shown
    viewed.current = product.handle;
    track("view_product", product.handle);
    track("view_item", product.handle, { ecommerce: ecommerce([productItem(product)]) });
  }, [product, remember]);
  const { addLine } = useCart();
  const [guideOpen, setGuideOpen] = useState(false);
  const purchaseRef = useRef<HTMLDivElement>(null);
  const reviews = reviewsFor(product.handle);
  const offer = useOffer();
  const inStockSizes = product.variants.filter((v) => v.availableForSale).map((v) => v.title);
  const [selection, setSelection] = useState<OptionSelection>({});
  const [sizeHint, setSizeHint] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  const variant = useMemo(() => findVariant(product, selection), [product, selection]);
  const price = variant?.price ?? product.priceRange.minVariantPrice;
  const compareAt = variant?.compareAtPrice ?? null;
  const onSale = isOnSale(price, compareAt);

  const select = (optionName: string, value: string) => {
    if (optionName === "Size") track("select_size", product.handle, { size: value, list: "pdp" });
    setSelection((current) => ({ ...current, [optionName]: value }));
  };

  // Bring the size row into view above the mobile buy bar and put focus on
  // the first size still in stock.
  const chooseSize = () => {
    const box = optionsRef.current;
    if (!box) return;
    setSizeHint(true);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollIntoView({ block: "center", behavior: still ? "auto" : "smooth" });
    box.querySelector<HTMLInputElement>("input:not(:disabled):not([data-unavailable])")?.focus({ preventScroll: true });
  };

  const m = product.merch;
  const STYLE: Record<string, string> = {
    "low-profile": "Low Profile", "retro-runner": "Retro Runner", "y2k-runner": "Y2K Runner", skate: "Skate",
    "basketball-retro": "Basketball", terrace: "Terrace", racing: "Racing", technical: "Technical", icon: "Icon",
  };
  const accordionItems = [
    {
      id: "details",
      title: "Détails",
      content: (
        <ul>
          <li>Marque : {m?.brand ?? product.vendor}</li>
          {m && <li>Modèle : {m.model}</li>}
          {m && <li>Coloris : {m.colorway === "Original" ? m.color : m.colorway}</li>}
          {m && <li>Style : {STYLE[m.style] ?? m.style}</li>}
        </ul>
      ),
    },
    {
      id: "quality",
      title: "Qualité",
      content: (
        <>
          <p>Réplique qualité Master Copy Premium 1:1, telle que déclarée par notre fournisseur. BEYOND PLUS ne présente pas ce modèle comme un produit authentique de la marque, et n’est pas affilié à la marque. <Link href="/qualite-transparence" style={{ textDecoration: "underline" }}>En savoir plus</Link>.</p>
          <p>Entretien : brosse douce et chiffon humide, séchage à l’air libre, loin d’une source de chaleur.</p>
        </>
      ),
    },
    {
      id: "shipping",
      title: "Livraison & retours",
      content: (
        <>
          <p>{COMMERCE.shipping}</p>
          <p>{COMMERCE.returns} <Link href="/policies/refund">Livraison et retours</Link></p>
        </>
      ),
    },
    {
      id: "care",
      title: "Assistance",
      content: (
        <p>
          Une question sur une pointure ou un modèle ? <a href="/contact" style={{ textDecoration: "underline" }}>Écrivez-nous</a>, on répond sur WhatsApp.
        </p>
      ),
    },
  ];

  return (
    <div className={styles.layout}>
      <div className={styles.gallery}>
        <ProductGallery images={product.images} title={product.title} />
      </div>

      <div className={styles.column}>
        <div className={styles.info}>
          <div className={styles.inner}>
            <nav className={styles.vendor} aria-label="Fil d'ariane">
              {trail.map((c, i) => (
                <span key={c.href}>{i > 0 && " / "}<Link href={c.href}>{c.title}</Link></span>
              ))}
            </nav>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{product.title}</h1>
              <WishlistButton handle={product.handle} title={product.title} className={styles.wish} />
            </div>

            <p className={styles.nature}>{COMMERCE.nature} · <Link href="/qualite-transparence">En savoir plus</Link></p>
            <div className={styles.price}>
              <span>{formatMoney(price)}</span>
              {onSale && compareAt && (
                <>
                  <span className={styles.compare}>{formatMoney(compareAt)}</span>
                  <span className={styles.saving}>
                    −{Math.round((1 - Number(price.amount) / Number(compareAt.amount)) * 100)} %
                  </span>
                </>
              )}
            </div>
            {offer && !product.previewOnly && (
              <p className={styles.offerPrice}>
                {formatMoney({ amount: String(Number(price.amount) - discountFor(Number(price.amount), offer.percent)), currencyCode: price.currencyCode })} avec ta remise première commande (−{offer.percent} %)
              </p>
            )}

            {reviews.average !== null && (
              <a href="#reviews-title" className={styles.rating}>{reviews.average.toFixed(1)} / 5 · {reviews.list.length} avis</a>
            )}

            <div className={styles.options} ref={optionsRef} data-hint={sizeHint && !variant ? "" : undefined}>
              {product.options.map((option) => (
                <SizeSelector
                  key={option.id}
                  product={product}
                  optionName={option.name}
                  values={option.values}
                  selection={selection}
                  onSelect={(value) => select(option.name, value)}
                  onOpenGuide={() => setGuideOpen(true)}
                />
              ))}
            </div>

            <div className={styles.purchase} ref={purchaseRef}><AddToCart product={product} variant={variant} onChooseSize={chooseSize} /></div>
            {variant && !variant.availableForSale && !product.previewOnly && <NotifyMe handle={product.handle} size={variant.title} />}

            <ul className={styles.reassure}>
              <li>Livraison gratuite au Maroc</li>
              <li>12 à 48 h après confirmation</li>
              <li><Link href="/policies/refund">Échange de pointure sous 3 jours</Link></li>
            </ul>

            {product.description && (
              <p className={styles.description}>{product.description}</p>
            )}

            {product.metafields.fit && (
              <p className={styles.fit}>
                <span className={styles.fitTitle}>{product.metafields.fit}</span>
                {product.metafields.modelNote && (
                  <>
                    <br />
                    <span className={styles.fitNote}>{product.metafields.modelNote}</span>
                  </>
                )}
              </p>
            )}



            <div className={styles.accordion}>
              <Accordion items={accordionItems} />
            </div>

            <ul className={styles.services}>
              {SERVICES.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>

            <div className={styles.meta}>
              <span>{product.vendor}</span>
              <span>{product.productType}</span>
              {variant?.sku && <span>Réf. {variant.sku}</span>}
            </div>
          </div>
        </div>
      </div>
      <SizeGuide open={guideOpen} onClose={() => setGuideOpen(false)} sizes={inStockSizes} />
      <StickyBuyBar product={product} variant={variant} target={purchaseRef} onAdd={() => variant && addLine(product, variant)} onChooseSize={chooseSize} />
    </div>
  );
}
