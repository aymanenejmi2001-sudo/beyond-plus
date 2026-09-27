// Emails SEO/rapports/<date>.md to the shop inbox. Usage: npm run send-report [-- AAAA-MM-JJ]
import { readFileSync } from "node:fs";
const env = readFileSync(".env.local", "utf8");
const token = env.match(/^REPORT_TOKEN=(.+)$/m)?.[1]?.trim();
const date = process.argv[2] ?? new Date().toLocaleDateString("sv-SE");
const markdown = readFileSync(`../SEO/rapports/${date}.md`, "utf8");
const res = await fetch("https://beyondplusmaroc.com/api/daily-report", {
  method: "POST",
  headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
  body: JSON.stringify({ subject: `Rapport BEYOND PLUS du ${date.split("-").reverse().join("/")}`, markdown }),
});
console.log(res.status, await res.text());
