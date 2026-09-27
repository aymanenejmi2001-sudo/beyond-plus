"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { ShopifyImage } from "@/lib/shopify/types";
import { promotion, track } from "@/lib/commerce/track";
import { useDropClock } from "./useDropClock";
import { Countdown } from "./Countdown";
import { statusAt, STATUS_LABEL, type LaunchInfo } from "./types";
import styles from "./Drop.module.css";

interface Props {
  slug: string; eyebrow: string; title: string; subtitle: string; image: ShopifyImage | null;
  launch: LaunchInfo | null; location: string; serverNow: number;
}

// One drop or edit, as a promotion tile (used on the /drops hub).
export function DropFeature({ slug, eyebrow, title, subtitle, image, launch, location, serverNow }: Props) {
  const now = useDropClock(serverNow);
  const status = statusAt(launch, now);
  const promo = promotion({ id: slug, name: `${eyebrow} ${title}`, creative: image?.url, location });
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { track("view_promotion", undefined, { ecommerce: promo }); io.disconnect(); }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);
  const cta = status === "available" ? "SHOP THE EDIT" : status === "live" ? "SHOP THE DROP" : status === "upcoming" ? "DISCOVER THE DROP" : "VOIR";
  return (
    <section ref={ref} className={styles.feature} aria-labelledby={`drop-${slug}`}>
      <div className={styles.featureMedia}>
        {image && <Image src={image.url} alt={image.altText ?? title} fill sizes="(min-width: 750px) 50vw, 100vw" className={styles.featureImage} />}
      </div>
      <div className={styles.featureCopy}>
        <p className={styles.eyebrow}>{eyebrow} · {STATUS_LABEL[status]}</p>
        <h2 id={`drop-${slug}`} className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
        {launch && status === "upcoming" && (
          <p className={styles.when}>
            <span>{launch.dateLabel}</span>
            <Countdown launchAt={launch.launchAt} now={now} className={styles.countdown} />
          </p>
        )}
        <Link href={`/drops/${slug}`} className={styles.cta} onClick={() => track("select_promotion", undefined, { ecommerce: promo })}>{cta}</Link>
      </div>
    </section>
  );
}
