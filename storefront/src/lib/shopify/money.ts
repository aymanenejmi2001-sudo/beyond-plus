import type { Money } from "./types";

const FORMATTERS = new Map<string, Intl.NumberFormat>();

function formatter(currencyCode: string, locale: string) {
  const key = `${locale}:${currencyCode}`;
  let f = FORMATTERS.get(key);
  if (!f) {
    f = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    FORMATTERS.set(key, f);
  }
  return f;
}

// "1 290" — grouped, no decimals. MAD is quoted in whole dirhams on this store.
const MAD_AMOUNT = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

/**
 * Renders a Shopify Money object. MAD (the store's only live currency) always
 * renders as "1 290 DH" — grouped thousands, no decimals, symbol last. Any
 * other currency code falls back to Intl's own currency formatting, which
 * only matters for the odd historical fixture and never for a real page.
 */
export function formatMoney(money: Money, locale = "fr-FR"): string {
  if (money.currencyCode === "MAD") {
    return `${MAD_AMOUNT.format(Number(money.amount))} DH`;
  }
  return formatter(money.currencyCode, locale).format(Number(money.amount));
}

export function money(amount: number, currencyCode = "MAD"): Money {
  return { amount: amount.toFixed(2), currencyCode };
}

export function addMoney(a: Money, b: Money): Money {
  return { amount: (Number(a.amount) + Number(b.amount)).toFixed(2), currencyCode: a.currencyCode };
}

export function multiplyMoney(a: Money, factor: number): Money {
  return { amount: (Number(a.amount) * factor).toFixed(2), currencyCode: a.currencyCode };
}

export function isOnSale(price: Money, compareAt: Money | null | undefined): boolean {
  return !!compareAt && Number(compareAt.amount) > Number(price.amount);
}
