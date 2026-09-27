"use client";

/* ============================================================================
   Account, mock authentication
   ----------------------------------------------------------------------------
   There is no backend yet, so this stands in for Shopify's Customer Accounts:
   same shape (see `Customer` in lib/shopify/types.ts), same place a real
   integration would slot in (marked below). State is local, a browser tab
   "signs in" a customer purely client-side and remembers it in localStorage,
   the same pattern CartProvider already uses for the cart itself.

   At go-live this whole file is replaced by Shopify's Customer Account API
   (or classic customer login), the account page and header link don't
   change, only what sits behind `signIn` / `register` / `signOut`.
   ========================================================================= */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Customer } from "@/lib/shopify/types";

const STORAGE_KEY = "beyondplus.customer.v1";

interface AccountContextValue {
  customer: Customer | null;
  hydrated: boolean;
  signIn(email: string, firstName?: string): void;
  signOut(): void;
}

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setCustomer(JSON.parse(raw) as Customer);
    } catch {
      /* storage unavailable — start signed out */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (customer) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customer));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* quota / private mode — session simply won't persist */
    }
  }, [customer, hydrated]);

  const value = useMemo<AccountContextValue>(
    () => ({
      customer,
      hydrated,
      // → Shopify `customerAccessTokenCreate` (sign in) or
      //   `customerCreate` (register); both resolve to the same customer
      //   shape, so the form only needs to know which mode it's in.
      signIn: (email, firstName) => {
        const [local] = email.split("@");
        setCustomer({
          id: `gid://shopify/Customer/${Date.now()}`,
          email,
          firstName: firstName?.trim() || (local ? local[0].toUpperCase() + local.slice(1) : "Cliente"),
          lastName: "",
          createdAt: new Date().toISOString(),
        });
      },
      signOut: () => setCustomer(null),
    }),
    [customer, hydrated],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount(): AccountContextValue {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used inside <AccountProvider>");
  return ctx;
}
