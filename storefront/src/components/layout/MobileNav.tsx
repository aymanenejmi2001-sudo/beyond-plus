"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MenuItem } from "@/lib/shopify/types";
import { SALE_HREF } from "@/data/navigation";
import { useBodyLock } from "@/lib/hooks/useBodyLock";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@/components/ui/icons";
import styles from "./MobileNav.module.css";

interface Props {
  open: boolean;
  menu: MenuItem[];
  onClose(): void;
}

export function MobileNav({ open, menu, onClose }: Props) {
  const [active, setActive] = useState<MenuItem | null>(null);

  useBodyLock(open);

  useEffect(() => {
    if (!open) {
      // reset to the root level once the close transition has finished
      const t = setTimeout(() => setActive(null), 400);
      return () => clearTimeout(t);
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div className={styles.overlay} data-open={open} onClick={onClose} aria-hidden="true" />
      <nav
        className={styles.drawer}
        data-open={open}
        aria-label="Navigation principale"
        inert={!open}
      >
        <div className={styles.top}>
          <span className={styles.brandMark}>Beyond Plus</span>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Fermer le menu">
            <CloseIcon size={18} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.level} data-state={active ? "behind" : "front"}>
            {menu.map((item) =>
              item.type === "link" ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={styles.row}
                  data-sale={item.href === SALE_HREF || undefined}
                  onClick={onClose}
                >
                  {item.title}
                </Link>
              ) : (
                <button
                  key={item.title}
                  type="button"
                  className={styles.row}
                  onClick={() => setActive(item)}
                >
                  {item.title}
                  <ArrowRightIcon size={14} />
                </button>
              ),
            )}
          </div>

          <div className={styles.level} data-state={active ? "front" : "ahead"}>
            {active && (
              <>
                <button type="button" className={styles.back} onClick={() => setActive(null)}>
                  <ArrowLeftIcon size={12} />
                  {active.title}
                </button>
                {active.columns?.map((column) => (
                  <div className={styles.subGroup} key={column.title}>
                    <p className={styles.subGroupTitle}>{column.title}</p>
                    {column.items.map((link) => (
                      <Link key={link.href} href={link.href} className={styles.sub} onClick={onClose}>
                        {link.title}
                      </Link>
                    ))}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <Link href="/account" onClick={onClose}>Compte</Link>
          <Link href="/contact" onClick={onClose}>Contact</Link>
          <span className="muted">DH / FR</span>
        </div>
      </nav>
    </>
  );
}
