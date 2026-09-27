"use client";

import { HeartIcon } from "@/components/ui/icons";
import { useStoredList, WISHLIST_KEY } from "@/lib/hooks/useStoredList";
import { track } from "@/lib/commerce/track";

export function WishlistButton({ handle, title, className }: { handle: string; title: string; className?: string }) {
  const { items, add, remove } = useStoredList(WISHLIST_KEY, 60);
  const saved = items.includes(handle);
  return (
    <button
      type="button"
      className={className}
      aria-pressed={saved}
      aria-label={saved ? `Retirer ${title} de la wishlist` : `Ajouter ${title} à la wishlist`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (saved) remove(handle); else { add(handle); track("wishlist_add", handle); } }}
    >
      <HeartIcon size={16} filled={saved} />
    </button>
  );
}
