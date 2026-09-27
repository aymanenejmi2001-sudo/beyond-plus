"use client";

import Image from "next/image";
import Link from "next/link";
import type { MenuItem } from "@/lib/shopify/types";
import styles from "./MegaMenu.module.css";

interface Props {
  item: MenuItem;
  open: boolean;
  onNavigate(): void;
}

export function MegaMenu({ item, open, onNavigate }: Props) {
  if (item.type === "dropdown") {
    return (
      <div className={styles.dropdown} data-open={open}>
        <div className={styles.columnList}>
          {item.columns?.[0]?.items.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.columnLink}
              onClick={onNavigate}
            >
              {link.title}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel} data-open={open}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          {item.columns?.map((column) => (
            <div key={column.title}>
              <p className={styles.columnTitle}>{column.title}</p>
              <div className={styles.columnList}>
                {column.items.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${styles.columnLink} link-line`}
                    onClick={onNavigate}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {item.cards && item.cards.length > 0 && (
          <div className={styles.cards}>
            {item.cards.map((card) => (
              <Link
                key={card.href + card.title}
                href={card.href}
                className={styles.card}
                onClick={onNavigate}
              >
                <div className={styles.cardMedia}>
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={340}
                    height={425}
                    sizes="170px"
                  />
                </div>
                <p className={styles.cardTitle}>{card.title}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
