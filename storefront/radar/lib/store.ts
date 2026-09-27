// Storage — Supabase (PostgREST over fetch, no SDK) when SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY are set; otherwise a local JSON file for
// development. Server-only: the service key never reaches the browser.

import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { TableName, Tables } from "./types.ts";

type Eq = Record<string, string | number | boolean | null>;
export interface ListOpts { eq?: Eq; order?: { col: string; asc?: boolean }; limit?: number }

export interface Store {
  kind: "supabase" | "file";
  list<T extends TableName>(table: T, opts?: ListOpts): Promise<Tables[T][]>;
  get<T extends TableName>(table: T, id: string): Promise<Tables[T] | null>;
  insert<T extends TableName>(table: T, rows: Partial<Tables[T]>[]): Promise<Tables[T][]>;
  update<T extends TableName>(table: T, id: string, patch: Partial<Tables[T]>): Promise<Tables[T]>;
  remove(table: TableName, id: string): Promise<void>;
}

const nowIso = () => new Date().toISOString();

// ---------------------------------------------------------------- Supabase
class SupabaseStore implements Store {
  kind = "supabase" as const;
  private url: string; private key: string;
  constructor(url: string, key: string) { this.url = url; this.key = key; }
  private async req(path: string, init: RequestInit = {}) {
    const res = await fetch(`${this.url}/rest/v1/${path}`, {
      ...init,
      cache: "no-store",
      headers: { apikey: this.key, Authorization: `Bearer ${this.key}`, "Content-Type": "application/json", Prefer: "return=representation", ...(init.headers ?? {}) },
    });
    if (!res.ok) throw new Error(`Supabase ${init.method ?? "GET"} ${path.split("?")[0]} → ${res.status} ${await res.text()}`);
    return res.status === 204 ? [] : res.json();
  }
  async list<T extends TableName>(table: T, opts: ListOpts = {}) {
    const q = new URLSearchParams({ select: "*" });
    for (const [k, v] of Object.entries(opts.eq ?? {})) q.append(k, v === null ? "is.null" : `eq.${v}`);
    if (opts.order) q.set("order", `${opts.order.col}.${opts.order.asc === false ? "desc" : "asc"}`);
    if (opts.limit) q.set("limit", String(opts.limit));
    return this.req(`${table}?${q}`) as Promise<Tables[T][]>;
  }
  async get<T extends TableName>(table: T, id: string) {
    const rows = (await this.req(`${table}?select=*&id=eq.${encodeURIComponent(id)}`)) as Tables[T][];
    return rows[0] ?? null;
  }
  async insert<T extends TableName>(table: T, rows: Partial<Tables[T]>[]) {
    if (!rows.length) return [];
    // PostgREST bulk insert needs identical keys on every row: fill gaps with null.
    const keys = [...new Set(rows.flatMap((r) => Object.keys(r)))];
    const body = rows.map((r) => Object.fromEntries(keys.map((k) => [k, (r as Record<string, unknown>)[k] ?? null])));
    return this.req(table, { method: "POST", body: JSON.stringify(body) }) as Promise<Tables[T][]>;
  }
  async update<T extends TableName>(table: T, id: string, patch: Partial<Tables[T]>) {
    const rows = (await this.req(`${table}?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(patch) })) as Tables[T][];
    if (!rows[0]) throw new Error(`${table} ${id} not found`);
    return rows[0];
  }
  async remove(table: TableName, id: string) {
    await this.req(`${table}?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
  }
}

// ---------------------------------------------------------------- JSON file
type Db = { [K in TableName]?: Tables[K][] };
class FileStore implements Store {
  kind = "file" as const;
  private queue: Promise<unknown> = Promise.resolve();
  private file: string;
  constructor(file: string) { this.file = file; }
  // Parsed once, re-read only when the file changes on disk (another process).
  private cache: { mtime: number; db: Db } | null = null;
  private async read(): Promise<Db> {
    try {
      const mtime = (await stat(this.file)).mtimeMs;
      if (this.cache && this.cache.mtime === mtime) return this.cache.db;
      const db = JSON.parse(await readFile(this.file, "utf8")) as Db;
      this.cache = { mtime, db };
      return db;
    } catch { return {}; }
  }
  private async write(db: Db) {
    await mkdir(dirname(this.file), { recursive: true });
    const tmp = this.file + ".tmp";
    await writeFile(tmp, JSON.stringify(db));
    await rename(tmp, this.file);
    this.cache = { mtime: (await stat(this.file)).mtimeMs, db };
  }
  private serial<R>(fn: () => Promise<R>): Promise<R> {
    const p = this.queue.then(fn, fn);
    this.queue = p.catch(() => undefined);
    return p;
  }
  async list<T extends TableName>(table: T, opts: ListOpts = {}) {
    let rows = [...(((await this.read())[table] ?? []) as Tables[T][])];
    for (const [k, v] of Object.entries(opts.eq ?? {})) rows = rows.filter((r) => ((r as unknown as Record<string, unknown>)[k] ?? null) === v);
    if (opts.order) {
      const { col, asc = true } = opts.order;
      rows = [...rows].sort((a, b) => {
        const x = (a as unknown as Record<string, unknown>)[col] as string | number, y = (b as unknown as Record<string, unknown>)[col] as string | number;
        return (x > y ? 1 : x < y ? -1 : 0) * (asc ? 1 : -1);
      });
    }
    return opts.limit ? rows.slice(0, opts.limit) : rows;
  }
  async get<T extends TableName>(table: T, id: string) {
    return (((await this.read())[table] ?? []) as Tables[T][]).find((r) => (r as { id: string }).id === id) ?? null;
  }
  insert<T extends TableName>(table: T, rows: Partial<Tables[T]>[]) {
    return this.serial(async () => {
      const db = await this.read();
      const created = rows.map((r) => ({ id: randomUUID(), created_at: nowIso(), ...r })) as Tables[T][];
      (db[table] as Tables[T][] | undefined) = [...((db[table] ?? []) as Tables[T][]), ...created];
      await this.write(db);
      return created;
    });
  }
  update<T extends TableName>(table: T, id: string, patch: Partial<Tables[T]>) {
    return this.serial(async () => {
      const db = await this.read();
      const rows = (db[table] ?? []) as Tables[T][];
      const i = rows.findIndex((r) => (r as { id: string }).id === id);
      if (i < 0) throw new Error(`${table} ${id} not found`);
      rows[i] = { ...rows[i], ...patch };
      await this.write(db);
      return rows[i];
    });
  }
  remove(table: TableName, id: string) {
    return this.serial(async () => {
      const db = await this.read();
      (db[table] as { id: string }[] | undefined) = ((db[table] ?? []) as { id: string }[]).filter((r) => r.id !== id) as never;
      await this.write(db);
    });
  }
}

let store: Store | null = null;
export function getStore(): Store {
  if (store) return store;
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  store = url && key
    ? new SupabaseStore(url.replace(/\/$/, ""), key)
    : new FileStore(process.env.RADAR_DATA_FILE || join(process.cwd(), ".radar", "db.json"));
  return store;
}
