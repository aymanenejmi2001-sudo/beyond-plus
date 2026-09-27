import type { Product, ProductVariant, SelectedOption } from "./types";

export type OptionSelection = Record<string, string>;

export function variantMatches(variant: ProductVariant, selection: OptionSelection): boolean {
  return variant.selectedOptions.every((o) => selection[o.name] === o.value);
}

export function findVariant(
  product: Product,
  selection: OptionSelection,
): ProductVariant | undefined {
  return product.variants.find((v) => variantMatches(v, selection));
}

/** First in-stock variant, else the first variant — matches Shopify's default. */
export function defaultVariant(product: Product): ProductVariant {
  return product.variants.find((v) => v.availableForSale) ?? product.variants[0];
}

export function defaultSelection(product: Product): OptionSelection {
  return toSelection(defaultVariant(product).selectedOptions);
}

export function toSelection(options: SelectedOption[]): OptionSelection {
  return Object.fromEntries(options.map((o) => [o.name, o.value]));
}

/**
 * Is `value` for `optionName` reachable, holding every *other* current choice?
 * Drives the struck-through / disabled size chips on the PDP.
 */
export function isOptionValueAvailable(
  product: Product,
  selection: OptionSelection,
  optionName: string,
  value: string,
): boolean {
  const probe = { ...selection, [optionName]: value };
  return product.variants.some((v) => v.selectedOptions.every((o) => !probe[o.name] || probe[o.name] === o.value) && v.availableForSale);
}

export function optionValueExists(
  product: Product,
  selection: OptionSelection,
  optionName: string,
  value: string,
): boolean {
  const probe = { ...selection, [optionName]: value };
  return product.variants.some((v) => v.selectedOptions.every((o) => !probe[o.name] || probe[o.name] === o.value));
}
