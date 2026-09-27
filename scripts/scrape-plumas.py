"""Public Shopify catalogue snapshot. No credentials, no customer data."""
import json,urllib.request,time
from pathlib import Path
from datetime import datetime,timezone
base='https://www.plumaskicks.com'
out=Path(__file__).resolve().parents[1]/'research/plumas';out.mkdir(parents=True,exist_ok=True)
def fetch(path):
 req=urllib.request.Request(base+path,headers={'User-Agent':'BeyondPlus-CatalogResearch/1.0'})
 with urllib.request.urlopen(req,timeout=45) as response:return json.load(response)
allproducts=[]
for page in range(1,15):
 d=fetch(f'/products.json?limit=250&page={page}');(out/f'products-page-{page}.json').write_text(json.dumps(d,ensure_ascii=False,indent=2));items=d['products'];allproducts+=items
 print('Catalogue page',page,':',len(items),flush=True)
 if len(items)<250:break
 time.sleep(.5)
else:raise RuntimeError('Pagination limit reached; snapshot incomplete')
collections={}
for name in ['best-sellers','nouveaux-arrivages']:
 items=[]
 for page in range(1,15):
  d=fetch(f'/collections/{name}/products.json?limit=250&page={page}');items+=d['products']
  if len(d['products'])<250:break
  time.sleep(.5)
 collections[name]=items
 (out/f'{name}.json').write_text(json.dumps(items,ensure_ascii=False,indent=2))
 print(name,len(items),flush=True)
unique={p['handle']:p for p in allproducts}
available={h:p for h,p in unique.items() if any(v.get('available') for v in p['variants']) and p['images']}
excluded=[{'handle':h,'title':p['title'],'reason':'unavailable' if not any(v.get('available') for v in p['variants']) else 'no_image'} for h,p in unique.items() if h not in available]
# Current best-seller collection is a merchandising signal, not annual unit sales.
selected=[];seen=set()
for signal,items,limit in [('best-sellers',collections['best-sellers'],12),('nouveaux-arrivages',sorted(collections['nouveaux-arrivages'],key=lambda p:p['published_at'],reverse=True),12)]:
 n=0
 for p in items:
  h=p['handle']
  if h not in available or h in seen:continue
  if signal=='nouveaux-arrivages' and not p['published_at'].startswith('2026'):continue
  selected.append({'product':available[h],'signal':signal,'source_url':base+'/products/'+h});seen.add(h);n+=1
  if n>=limit:break
snapshot={'captured_at':datetime.now(timezone.utc).isoformat(),'source':base,'source_nature':'Master Copy Premium 1:1 — replica, as disclosed by source','selection_method':'Up to 12 available current Best Sellers then 12 available new arrivals published by source in 2026. Not an annual sales ranking. Source publication date is not manufacturer release date.','total':len(unique),'available':len(available),'excluded':excluded,'selected':selected}
(out/'selection.json').write_text(json.dumps(snapshot,ensure_ascii=False,indent=2))
print('RESULT',len(unique),'available',len(available),'excluded',len(excluded),'selected',len(selected),flush=True)
