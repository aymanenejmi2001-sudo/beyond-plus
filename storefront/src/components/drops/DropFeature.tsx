"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { DropStatus } from "@/data/drops";
import type { ShopifyImage } from "@/lib/shopify/types";
import { promotion, track } from "@/lib/commerce/track";
import { useDropClock } from "./useDropClock";
import { Countdown } from "./Countdown";
import styles from "./Drop.module.css";

interface Props {
  slug: string; eyebrow: string; title: string; subtitle: string; launchAt: string; dateLabel: string;
  fixedStatus: DropStatus | null; image: ShopifyImage | null; serverNow: number;
}

// Homepage block for the featured drop (data/merchandising.ts → featuredDrop).
export function DropFeature({ slug, eyebrow, title, subtitle, launchAt, dateLabel, fixedStatus, image, serverNow }: Props) {
  const now = useDropClock(serverNow);
  const status = fixedStatus ?? (now >= Date.parse(launchAt) ? "live" : "upcoming");
  const promo = promotion({ id: slug, name: `${eyebrow} ${title}`, creative: image?.url, location: "home_featured_drop" });
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
  if (status === "archived") return null;
  return (
    <section ref={ref} className={styles.feature} aria-labelledby={`drop-${slug}`}>
      <div className={styles.featureMedia}>
        {image && <Image src={image.url} alt={image.altText ?? title} fill sizes="(min-width: 990px) 50vw, 100vw" className={styles.featureImage} />}
      </div>
      <div className={styles.featureCopy}>
        <p className={styles.eyebrow}>{eyebrow} · {status === "live" ? "LIVE" : "COMING SOON"}</p>
        <h2 id={`drop-${slug}`} className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
        {status === "upcoming" && (
          <p className={styles.when}>
            <span>{dateLabel}</span>
            <Countdown launchAt={launchAt} now={now} className={styles.countdown} />
          </p>
        )}
        <Link href={`/drops/${slug}`} className={styles.cta} onClick={() => track("select_promotion", undefined, { ecommerce: promo })}>
          {status === "live" ? "SHOP THE DROP" : "DISCOVER THE DROP"}
        </Link>
      </div>
    </section>
  );
}
