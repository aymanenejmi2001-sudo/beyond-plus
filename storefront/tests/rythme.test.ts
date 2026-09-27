import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
// Rythme éditorial (SEO/REGLES.md) : un guide maximum par jour, un jour sur deux.
// Le lot du 26/09/2026 (10 guides) est antérieur à la règle et toléré.
const src = readFileSync(new URL("../src/data/guides.ts", import.meta.url), "utf8");
const dates = [...src.matchAll(/published:\s*"(\d{4}-\d{2}-\d{2})"/g)].map((m) => m[1]).filter((d) => d > "2026-09-26").sort();
test("un seul guide par jour", () => {
  const dup = dates.filter((d, i) => dates.indexOf(d) !== i);
  assert.deepEqual(dup, [], `plusieurs guides le même jour : ${dup.join(", ")}`);
});
test("au moins 2 jours entre deux guides", () => {
  for (let i = 1; i < dates.length; i++) assert.ok(dates[i].endsWith("-01") || (Date.parse(dates[i]) - Date.parse(dates[i - 1])) / 864e5 >= 2, `guides trop rapprochés : ${dates[i - 1]} et ${dates[i]}`);
});
