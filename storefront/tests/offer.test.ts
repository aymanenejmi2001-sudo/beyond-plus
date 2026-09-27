import test from "node:test";
import assert from "node:assert/strict";
import { issueOffer, verifyOffer, offerDiscount, OFFER } from "../src/lib/commerce/offer.ts";

const SECRET = "test-secret-not-used-in-production";

test("an issued offer code verifies and returns its id", () => {
  const { code } = issueOffer(SECRET);
  assert.match(code, /^BP15\./);
  assert.ok(verifyOffer(code, SECRET));
});
test("forged, altered or foreign codes are rejected", () => {
  const { code } = issueOffer(SECRET);
  assert.equal(verifyOffer(code, "another-secret"), null);
  assert.equal(verifyOffer(code.replace(/.$/, (c) => (c === "A" ? "B" : "A")), SECRET), null);
  assert.equal(verifyOffer(code.replace("BP15", "BP50"), SECRET), null);
  assert.equal(verifyOffer("BP15.whatever", SECRET), null);
  assert.equal(verifyOffer(undefined, SECRET), null);
});
test("expired codes are rejected", () => {
  const { code } = issueOffer(SECRET, Date.now() - (OFFER.days + 1) * 86400_000);
  assert.equal(verifyOffer(code, SECRET), null);
});
test("discount is 15 % of the items total, in whole dirhams", () => {
  assert.equal(offerDiscount(700), 105);
  assert.equal(offerDiscount(680), 102);
  assert.equal(offerDiscount(1360), 204);
  assert.equal(offerDiscount(0), 0);
});
