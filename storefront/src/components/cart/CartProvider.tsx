"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type { Cart, CartLine, Product, ProductVariant } from "@/lib/shopify/types";
import { addMoney, money, multiplyMoney } from "@/lib/shopify/money";

import { cartInput, cartSignature } from "@/lib/commerce/quote";
import { track } from "@/lib/commerce/track";

const STORAGE_KEY = "beyondplus.cart.v1";
const CURRENCY = "MAD";

/* ---- State ------------------------------------------------------------- */

type Action =
  | { type: "add"; product: Product; variant: ProductVariant; quantity: number }
  | { type: "remove"; lineId: string }
  | { type: "quantity"; lineId: string; quantity: number }
  | { type: "adjust"; lineId: string; delta: number }
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "clear" };

function lineId(variantId: string) {
  return `line:${variantId}`;
}

function reduceLines(lines: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case "hydrate":
      return action.lines;
    case "clear":
      return [];
    case "remove":
      return lines.filter((l) => l.id !== action.lineId);
    case "quantity":
      return lines
        .map((l) =>
          l.id === action.lineId ? { ...l, quantity: Math.min(10, Math.max(0, action.quantity)) } : l,
        )
        .filter((l) => l.quantity > 0);
    // Deltas compose, so rapid taps on +/- can't be lost to a stale render.
    case "adjust":
      return lines
        .map((l) =>
          l.id === action.lineId
            ? { ...l, quantity: Math.min(10, Math.max(0, l.quantity + action.delta)) }
            : l,
        )
        .filter((l) => l.quantity > 0);
    case "add": {
      const id = lineId(action.variant.id);
      const existing = lines.find((l) => l.id === id);
      if (existing) {
        return lines.map((l) =>
          l.id === id ? { ...l, quantity: Math.min(10, l.quantity + action.quantity) } : l,
        );
      }
      const next: CartLine = {
        id,
        quantity: action.quantity,
        merchandise: {
          id: action.variant.id,
          title: action.variant.title,
          selectedOptions: action.variant.selectedOptions,
          image: action.variant.image ?? action.product.featuredImage,
          price: action.variant.price,
          product: { handle: action.product.handle, title: action.product.title },
        },
        cost: { totalAmount: action.variant.price },
      };
      return [...lines, next];
    }
  }
}

function withCosts(lines: CartLine[]): CartLine[] {
  return lines.map((l) => ({
    ...l,
    cost: { totalAmount: multiplyMoney(l.merchandise.price, l.quantity) },
  }));
}

function reducer(lines: CartLine[], action: Action): CartLine[] {
  return withCosts(reduceLines(lines, action));
}

/* ---- Context ----------------------------------------------------------- */

interface CartContextValue {
  cart: Cart;
  isOpen: boolean;
  /** the line most recently added — drives the drawer's highlight */
  lastAddedId: string | null;
  open(): void;
  close(): void;
  addLine(product: Product, variant: ProductVariant, quantity?: number): void;
  removeLine(lineId: string): void;
  setQuantity(lineId: string, quantity: number): void;
  adjustQuantity(lineId: string, delta: number): void;
  clear(): void;
  notice: string;
  replaceLines(lines: CartLine[]): void;
  refresh(): Promise<CartLine[]>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [isOpen, setOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState("");

  // Restore on mount only — keeps SSR markup and first client paint identical.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.every(l => l?.merchandise?.product?.handle && l?.merchandise?.id && Array.isArray(l.merchandise.selectedOptions) && Number.isInteger(l.quantity) && l.quantity > 0 && l.quantity <= 10 && Number.isFinite(Number(l.merchandise.price?.amount)))) dispatch({ type: "hydrate", lines: parsed });
      }
    } catch {
      /* storage unavailable — start empty */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* quota / private mode — cart simply won't persist */
    }
  }, [lines, hydrated]);

  const refresh = useCallback(async () => {
    if (!lines.length) return [];
    const response = await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cartInput(lines)) });
    const result = await response.json();
    if (!response.ok) { setNotice(result.error); throw new Error(result.error); }
    if (cartSignature(lines) !== cartSignature(result.lines)) setNotice("Le prix de votre panier a été mis à jour. Vérifiez le total avant de continuer.");
    else setNotice("");
    dispatch({ type: "hydrate", lines: result.lines });
    return result.lines as CartLine[];
  }, [lines]);

  const cart = useMemo<Cart>(() => {
    const subtotal = lines.reduce(
      (acc, l) => addMoney(acc, l.cost.totalAmount),
      money(0, CURRENCY),
    );
    return {
      id: null,
      checkoutUrl: null, // → cart.checkoutUrl from the Storefront Cart API
      totalQuantity: lines.reduce((n, l) => n + l.quantity, 0),
      lines,
      cost: { subtotalAmount: subtotal, totalAmount: subtotal },
    };
  }, [lines]);

  const addLine = useCallback(
    (product: Product, variant: ProductVariant, quantity = 1) => {
      track("add_to_cart", product.handle, { size: variant.title, value: Number(variant.price.amount) * quantity });
      dispatch({ type: "add", product, variant, quantity });
      setLastAddedId(lineId(variant.id));
      setOpen(true);
    },
    [],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      notice,
      refresh,
      replaceLines: (next) => dispatch({ type: "hydrate", lines: next }),
      isOpen,
      lastAddedId,
      open: () => setOpen(true),
      close: () => setOpen(false),
      addLine,
      removeLine: (id) => dispatch({ type: "remove", lineId: id }),
      setQuantity: (id, quantity) => dispatch({ type: "quantity", lineId: id, quantity }),
      adjustQuantity: (id, delta) => dispatch({ type: "adjust", lineId: id, delta }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [cart, notice, refresh, isOpen, lastAddedId, addLine],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
