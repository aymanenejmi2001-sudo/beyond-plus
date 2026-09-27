"use client";

import type { Product } from "@/lib/shopify/types";
import { isOptionValueAvailable, optionValueExists, type OptionSelection } from "@/lib/shopify/variants";
import { swatchColor } from "@/lib/swatches";
import styles from "./SizeSelector.module.css";

interface Props {
  product: Product;
  optionName: string;
  values: string[];
  selection: OptionSelection;
  onSelect(value: string): void;
  onOpenGuide?(): void;
}

export function SizeSelector({
  product,
  optionName,
  values,
  selection,
  onSelect,
  onOpenGuide,
}: Props) {
  const isColor = optionName === "Color";
  const label = isColor ? "Couleur" : optionName === "Size" ? "Pointure" : optionName;

  return (
    <fieldset className={styles.group}>
      <div className={styles.head}>
        <legend className={styles.label}>
          {label}
          {selection[optionName] && (
            <span className={styles.labelValue}>, {selection[optionName]}</span>
          )}
        </legend>
        {!isColor && onOpenGuide && (
          <button type="button" className={styles.guide} onClick={onOpenGuide}>
            Guide des tailles
          </button>
        )}
      </div>

      <div className={styles.options}>
        {values.map((value) => {
          const exists = optionValueExists(product, selection, optionName, value);
          const available = exists && (product.previewOnly || isOptionValueAvailable(product, selection, optionName, value));
          const checked = selection[optionName] === value;

          return (
            <label className={styles.option} key={value}>
              <input
                type="radio"
                name={`${product.id}-${optionName}`}
                value={value}
                checked={checked}
                disabled={!exists}
                data-unavailable={exists && !available ? "" : undefined}
                onChange={() => onSelect(value)}
              />
              {isColor ? (
                <span
                  className={styles.swatch}
                  title={value}
                  style={{ ["--swatch" as string]: swatchColor(value) }}
                >
                  <span className="visually-hidden">{value}</span>
                </span>
              ) : (
                <span className={styles.chip} title={exists && !available ? "Indisponible : prévenez-moi" : undefined}>{value}</span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
