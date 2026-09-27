"use client";
import { useCallback, useEffect, useState } from "react";

// A small list of product handles kept in localStorage (wishlist, recently viewed),
// synced between components and tabs. Always renders fine without storage.
const EVENT = "beyond:list";

function read(key: string): string[] {
  try { const v = JSON.parse(localStorage.getItem(key) ?? "[]"); return Array.isArray(v) ? v.filter((x) => typeof x === "string") : []; } catch { return []; }
}

export function useStoredList(key: string, max: number) {
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setItems(read(key));
    sync();
    const onList = (e: Event) => { if ((e as CustomEvent).detail === key) sync(); };
    const onStorage = (e: StorageEvent) => { if (e.key === key) sync(); };
    window.addEventListener(EVENT, onList);
    window.addEventListener("storage", onStorage);
    return () => { window.removeEventListener(EVENT, onList); window.removeEventListener("storage", onStorage); };
  }, [key]);
  const write = useCallback((next: string[]) => {
    const list = next.slice(0, max);
    setItems(list);
    try { localStorage.setItem(key, JSON.stringify(list)); } catch { /* private mode */ }
    window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
  }, [key, max]);
  const add = useCallback((h: string) => write([h, ...read(key).filter((x) => x !== h)]), [key, write]);
  const remove = useCallback((h: string) => write(read(key).filter((x) => x !== h)), [key, write]);
  return { items, add, remove };
}

export { WISHLIST_KEY, RECENT_KEY } from "@/lib/storage-keys";
