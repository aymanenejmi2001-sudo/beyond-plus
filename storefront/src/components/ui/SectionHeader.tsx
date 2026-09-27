"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";
import styles from "./SectionHeader.module.css";

export interface Tab { id: string; label: string }

interface Props {
  title: string;
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?(id: string): void;
  link?: { href: string; label: string };
  onPrev?(): void;
  onNext?(): void;
  canPrev?: boolean;
  canNext?: boolean;
  rule?: boolean | "top";
  children?: ReactNode;
}

export function SectionHeader({
  title,
  tabs,
  activeTab,
  onTabChange,
  link,
  onPrev,
  onNext,
  canPrev = true,
  canNext = true,
  rule = true,
  children,
}: Props) {
  return (
    <div className={`${styles.group} container`} data-rule={rule === true ? "true" : rule}>
      <div className={styles.left}>
        <h2 className={styles.title}>{title}</h2>
        {tabs && tabs.length > 0 && (
          <div className={styles.tabs} role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                className={styles.tab}
                data-active={activeTab === tab.id}
                aria-selected={activeTab === tab.id}
                onClick={() => onTabChange?.(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
        {children}
      </div>

      <div className={styles.actions}>
        {link && (
          <Link href={link.href} className={styles.link}>
            {link.label}
          </Link>
        )}
        {(onPrev || onNext) && (
          <div className={styles.nav}>
            <button
              type="button"
              className={styles.navButton}
              onClick={onPrev}
              disabled={!canPrev}
              aria-label="Précédent"
            >
              <ArrowLeftIcon size={18} />
            </button>
            <button
              type="button"
              className={styles.navButton}
              onClick={onNext}
              disabled={!canNext}
              aria-label="Suivant"
            >
              <ArrowRightIcon size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
