import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { quoteCart, cartTotal } from "../src/lib/commerce/quote.ts";
import { findVariant, isOptionValueAvailable } from "../src/lib/shopify/variants.ts";
import type { Product } from "../src/lib/shopify/types.ts";
const catalog = JSON.parse(readFileSync(new URL("../src/data/catalog.json", import.meta.url), "utf8")) as Product[];
const product = catalog.find(p => !p.previewOnly && p.variants.some(v => v.availableForSale))!;
const variant = product.variants.find(v => v.availableForSale)!;
const input = { handle: product.handle, variantId: variant.id, quantity: 2 };
test("untrusted price is ignored and authoritative total is used", () => {
 const lines = quoteCart([{...input, price: 1}], catalog);
 assert.equal(cartTotal(lines), Number(variant.price.amount) * 2);
});
test("retired and unavailable variants cannot be ordered", () => {
 assert.throws(() => quoteCart([{ ...input, handle: "retired" }], catalog));
 const unavailable = { ...product, variants: product.variants.map(v => ({...v, availableForSale:false})) };
 assert.throws(() => quoteCart([input], [unavailable]));
});
test("invalid quantities, payloads and cumulative excess are rejected", () => {
 for(const quantity of [-1,0,1.5,11,"2",null]) assert.throws(() => quoteCart([{...input,quantity}],catalog));
 assert.throws(() => quoteCart(null,catalog));
 assert.throws(() => quoteCart([{...input,quantity:6},{...input,quantity:6}],catalog));
});
test("same variant is merged and limited by stock", () => {
 assert.equal(quoteCart([{...input,quantity:1},{...input,quantity:1}],catalog)[0].quantity,2);
 assert.throws(() => quoteCart([input],[{...product,variants:[{...variant,quantityAvailable:1}]}]));
});
test("size must be chosen explicitly while choices remain selectable", () => {
 assert.equal(findVariant(product,{}),undefined);
 const option = variant.selectedOptions[0];
 assert.equal(isOptionValueAvailable(product,{},option.name,option.value),true);
 assert.equal(findVariant(product,Object.fromEntries(variant.selectedOptions.map(o=>[o.name,o.value])))?.id,variant.id);
});
