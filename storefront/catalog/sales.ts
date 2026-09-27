// Read-only sales report for the curator: order requests per product over N days.
// Usage: npm run sales -- 30   (needs BLOB_READ_WRITE_TOKEN in .env.local)
import { list, get } from "@vercel/blob";
import { readFileSync } from "node:fs";

for (const l of readFileSync(".env.local", "utf8").split("\n")) {
  const m = l.match(/^(BLOB_READ_WRITE_TOKEN)=["']?([^"'\n]+)/);
  if (m) process.env[m[1]] = m[2];
}
const days = Number(process.argv[2] ?? 30);
const since = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
const counts = new Map<string, { pairs: number; orders: number }>();
let orders = 0, cursor: string | undefined;
do {
  const page = await list({ prefix: "commerce/request_prepared/", limit: 1000, cursor });
  for (const b of page.blobs) {
    if ((b.pathname.split("/")[2] ?? "") < since) continue;
    const res = await get(b.pathname, { access: "private", useCache: false });
    if (!res) continue;
    const row = JSON.parse(await new Response(res.stream).text());
    orders++;
    for (const l of row.payload?.lines ?? []) {
      const h = l.merchandise.product.handle;
      const c = counts.get(h) ?? { pairs: 0, orders: 0 };
      c.pairs += l.quantity; c.orders++; counts.set(h, c);
    }
  }
  cursor = page.hasMore ? page.cursor : undefined;
} while (cursor);
console.log(`Demandes de commande depuis ${since} (${days} j) : ${orders}`);
for (const [h, c] of [...counts].sort((a, b) => b[1].pairs - a[1].pairs)) console.log(`${c.pairs}\t${c.orders} commande(s)\t${h}`);
if (!counts.size) console.log("Aucune vente sur la période : décider sur l'originalité et les photos.");
