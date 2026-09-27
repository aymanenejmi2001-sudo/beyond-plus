"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";
import styles from "./Facets.module.css";

export interface FacetGroup {
  id: string;
  label: string;
  options: { value: string; count: number }[];
}

export type FacetState = Record<string, string[]>;

export type SortKey = "featured" | "price-asc" | "price-desc" | "title";

export const SORTS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Sélection" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "title", label: "A à Z" },
];

/** Grid density icons — 4-up (large) and 6-up (small), as on the reference. */
const DensityIcon = ({ dense }: { dense: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden focusable={false}>
    {dense
      ? [0, 5.5, 11].map((x) =>
          [0, 5.5, 11].map((y) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" fill="currentColor" />
          )),
        )
      : [0, 9].map((x) =>
          [0, 9].map((y) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="7" height="7" fill="currentColor" />
          )),
        )}
  </svg>
);

interface Props {
  groups: FacetGroup[];
  value: FacetState;
  onChange(next: FacetState): void;
  sort: SortKey;
  onSortChange(next: SortKey): void;
  dense: boolean;
  onDensityChange(dense: boolean): void;
  resultCount: number;
}

export function Facets({
  groups,
  value,
  onChange,
  sort,
  onSortChange,
  dense,
  onDensityChange,
  resultCount,
}: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleOption = (groupId: string, option: string) => {
    const current = value[groupId] ?? [];
    onChange({
      ...value,
      [groupId]: current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option],
    });
  };

  const activeCount = Object.values(value).reduce((n, v) => n + v.length, 0);
  const openGroup = groups.find((g) => g.id === openId);

  return (
    <div className={styles.bar}>
      <div className={styles.tabs} role="tablist" aria-label="Filtres">
        {groups.map((group) => {
          const n = (value[group.id] ?? []).length;
          return (
            <button
              key={group.id}
              type="button"
              role="tab"
              className={styles.summary}
              aria-selected={openId === group.id}
              aria-controls="facet-panel"
              data-open={openId === group.id}
              onClick={() => setOpenId((id) => (id === group.id ? null : group.id))}
            >
              {group.label}
              {n > 0 && <span className={styles.badge}>{n}</span>}
              <ChevronDownIcon size={10} />
            </button>
          );
        })}
      </div>

      {openGroup && (
        <div className={styles.list} id="facet-panel" role="group" aria-label={openGroup.label}>
          {openGroup.options.map((option) => {
            const selected = (value[openGroup.id] ?? []).includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                className={styles.chip}
                data-selected={selected}
                aria-pressed={selected}
                onClick={() => toggleOption(openGroup.id, option.value)}
              >
                {option.value}
                <span className={styles.count}>{option.count}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className={styles.toolbar}>
        <span className={styles.resultCount}>
          {resultCount} {resultCount > 1 ? "pièces" : "pièce"}
        </span>

        {activeCount > 0 && (
          <button type="button" className={styles.reset} onClick={() => onChange({})}>
            Effacer ({activeCount})
          </button>
        )}

        <div className={styles.density} role="group" aria-label="Densité de la grille">
          <button
            type="button"
            className={styles.densityButton}
            data-active={!dense}
            aria-label="Grande grille"
            aria-pressed={!dense}
            onClick={() => onDensityChange(false)}
          >
            <DensityIcon dense={false} />
          </button>
          <button
            type="button"
            className={styles.densityButton}
            data-active={dense}
            aria-label="Grille dense"
            aria-pressed={dense}
            onClick={() => onDensityChange(true)}
          >
            <DensityIcon dense />
          </button>
        </div>

        <label className={styles.sort}>
          Trier
          <span className={styles.sortField}>
            <select value={sort} onChange={(e) => onSortChange(e.target.value as SortKey)}>
              {SORTS.map((s) => (
                <option value={s.value} key={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon size={10} />
          </span>
        </label>
      </div>
    </div>
  );
}
