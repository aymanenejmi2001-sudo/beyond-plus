"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useBodyLock } from "@/lib/hooks/useBodyLock";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import { LinkButton } from "@/components/ui/Button";
import styles from "./SearchOverlay.module.css";
import { track } from "@/lib/commerce/track";

/** Lightweight index written by `npm run catalog` — fetched once, on first open. */
interface Entry { h: string; t: string; b: string; m: string; c: string; s: string; p: number; i: string | null }
let indexPromise: Promise<Entry[]> | null = null;
const loadIndex = () => (indexPromise ??= fetch("/search-index.json").then((r) => r.json()).catch(() => { indexPromise = null; return []; }));
interface Suggestion { l: string; h: string; k: string; n: number }
let suggestPromise: Promise<Suggestion[]> | null = null;
const loadSuggest = () => (suggestPromise ??= fetch("/search-suggest.json").then((r) => r.json()).catch(() => { suggestPromise = null; return []; }));
const fold = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[-\s]+/g, " ");

function search(index: Entry[], query: string, limit = 8) {
  const words = fold(query).split(" ").filter(Boolean);
  if (!words.length) return [];
  return index.filter((e) => { const hay = fold(`${e.t} ${e.b} ${e.m} ${e.c} ${e.s}`); return words.every((w) => hay.includes(w)); }).slice(0, limit);
}

interface Props {
  open: boolean;
  onClose(): void;
}

export function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useBodyLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const [index, setIndex] = useState<Entry[]>([]);
  useEffect(() => { if (open) loadIndex().then(setIndex); }, [open]);
  const results = useMemo(() => search(index, query), [index, query]);
  const [suggest, setSuggest] = useState<Suggestion[]>([]);
  useEffect(() => { if (open) loadSuggest().then(setSuggest); }, [open]);
  const suggestions = useMemo(() => {
    const words = fold(query).split(" ").filter(Boolean);
    if (!words.length) return [];
    return suggest.filter((s) => { const hay = fold(s.l); return words.every((w) => hay.includes(w)); }).slice(0, 5);
  }, [suggest, query]);
  // One "search" event per settled query, not per keystroke.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const t = setTimeout(() => track("search", undefined, { search_term: q.slice(0, 60), results: results.length }), 900);
    return () => clearTimeout(t);
  }, [query, results.length]);

  return (
    <>
      <div className={styles.overlay} data-open={open} onClick={onClose} aria-hidden="true" />
      <div
        className={styles.panel}
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Recherche"
        inert={!open}
      >
        <div className={styles.inner}>
          <div className={styles.head}>
            <label className={styles.field}>
              <span className="visually-hidden">Rechercher un produit ou une marque</span>
              <SearchIcon size={18} />
              <input
                ref={inputRef}
                type="search"
                placeholder="Samba, Gel-NYC, Kayano 14, 9060…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <button type="button" className={styles.close} onClick={onClose} aria-label="Fermer la recherche">
              <CloseIcon size={20} />
            </button>
          </div>

          {suggestions.length > 0 && (
            <ul className={styles.suggest} aria-label="Suggestions">
              {suggestions.map((s) => (
                <li key={s.h}>
                  <Link href={s.h} onClick={onClose}>
                    <span>{s.l}</span>
                    <span className={styles.suggestKind}>{s.k}{s.n ? ` · ${s.n}` : ""}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {query.trim() === "" ? (
            <p className={styles.hint}>Samba, Gel-NYC, Kayano 14, 9060, Vomero 5…</p>
          ) : results.length === 0 && suggestions.length === 0 ? (
            <p className={styles.empty}>Aucun résultat pour « {query} ».</p>
          ) : (
            <>
              <div className={styles.results}>
                {results.map((e) => (
                  <Link href={`/products/${e.h}`} className={styles.result} key={e.h} onClick={() => { track("select_item", e.h, { list: "search" }); onClose(); }}>
                    <div className={styles.resultMedia}>
                      {e.i && <Image src={e.i} alt={e.t} width={360} height={360} sizes="180px" />}
                    </div>
                    <p className={styles.resultVendor}>{e.b}</p>
                    <p className={styles.resultTitle}>{e.t.toLowerCase().startsWith(e.b.toLowerCase() + " ") ? e.t.slice(e.b.length + 1) : e.t}</p>
                    <p className={styles.resultPrice}>{e.p} DH</p>
                  </Link>
                ))}
              </div>
              <div className={styles.seeAll}>
                <LinkButton href="/collections/nouveautes" variant="outline" onClick={onClose}>
                  Voir toute la collection
                </LinkButton>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
