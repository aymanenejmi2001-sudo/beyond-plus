#!/usr/bin/env python3
"""Foot Locker FR — product list from the PUBLIC sitemaps only.

Allowed by https://www.footlocker.fr/robots.txt (sitemaps are published for
crawlers). Product pages are NOT fetched (they are behind an anti-bot CAPTCHA,
which we never try to bypass) and no image is downloaded or reused.
Output: research/footlocker/footlocker_fr.csv — one row per Foot Locker model
(brand, model name from the URL, product id, url). Used by Radar as a MARKET
demand signal: "a big retailer carries this model, in N versions".

    python3 scripts/scrape_footlocker.py
"""
import csv, gzip, io, os, re, sys, time, urllib.request, urllib.robotparser
from datetime import datetime, timezone

BASE = "https://www.footlocker.fr"
UA = "BeyondPlus-Catalogue/1.0 (+https://beyondplusmaroc.com)"
DELAY = 1.5  # seconds between requests
OUT = os.path.join(os.path.dirname(__file__), "..", "research", "footlocker", "footlocker_fr.csv")

robots = urllib.robotparser.RobotFileParser(BASE + "/robots.txt"); robots.read()

def get(url):
    if not robots.can_fetch(UA, url):
        print("robots.txt interdit :", url); return None
    time.sleep(DELAY)
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "gzip"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            data = r.read()
    except Exception as e:  # 403/429/challenge: log and move on, never retry around a block
        print("échec", url, e); return None
    if data[:2] == b"\x1f\x8b": data = gzip.decompress(data)
    return data.decode("utf-8", "replace")

index = get(BASE + "/sitemap.xml") or ""
maps = [u for u in re.findall(r"<loc>([^<]+)</loc>", index) if "products-sitemap" in u]
print(len(maps), "sitemaps produits")

BRANDS = ["new balance", "on running", "the north face", "ugg", "birkenstock", "nike", "jordan", "adidas", "puma", "asics", "vans", "converse",
          "reebok", "salomon", "saucony", "hoka", "timberland", "crocs", "fila", "lacoste", "dr martens", "mizuno", "karhu", "veja", "on"]
rows, seen = [], set()
for m in maps:
    xml = get(m)
    if not xml: continue
    for url in re.findall(r"<loc>([^<]+/product/[^<]+)</loc>", xml):
        if "/fr/" not in url: continue
        g = re.search(r"/product/(?:[^/]+/)*?([^/]+)/(\d+)\.html", url)
        if not g or g.group(2) in seen: continue
        seen.add(g.group(2))
        slug = g.group(1).replace("-", " ").strip()
        brand = next((b for b in BRANDS if slug == b or slug.startswith(b + " ")), slug.split(" ")[0])
        name = slug[len(brand):].strip() if slug.startswith(brand) else slug
        rows.append({"brand": brand.title() if brand not in ("adidas",) else brand, "name": name.title(), "product_id": g.group(2), "url": url})
    print(m.rsplit("/", 1)[-1], "→", len(rows), "produits")

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["brand", "name", "product_id", "url"]); w.writeheader(); w.writerows(rows)
print(f"✓ {len(rows)} produits → {os.path.relpath(OUT)} ({datetime.now(timezone.utc):%Y-%m-%d %H:%M} UTC)")
