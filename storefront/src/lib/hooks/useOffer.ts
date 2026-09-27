"use client";
import { useEffect, useState } from "react";
import { OFFER_EVENT, readOffer, type StoredOffer } from "@/lib/commerce/offer-shared";

/** The first-order offer once revealed by the scratch card (null before). */
export function useOffer() {
  const [offer, setOffer] = useState<StoredOffer | null>(null);
  useEffect(() => {
    const sync = () => setOffer(readOffer());
    sync();
    window.addEventListener(OFFER_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(OFFER_EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);
  return offer;
}
