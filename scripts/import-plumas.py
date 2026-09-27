"""Build a research-only catalog and draft Shopify CSV from the snapshot."""
import json,csv,html
from pathlib import Path
r=Path(__file__).resolve().parents[1];snap=json.loads((r/'research/plumas/selection.json').read_text());catalog=[];csvrows=[]
for index,item in enumerate(snap['selected']):
 p=item['product'];vs=[v for v in p['variants'] if v['available']];title=p['title'];brand=next((b for b in ['New Balance','Adidas','Nike','Asics','ASICS','Converse','Vans','On','Puma','Hoka','HOKA'] if title.lower().startswith(b.lower())), 'Jordan' if 'Jordan' in title else 'Nike')
 images=[{'url':i['src'],'altText':title+' — visuel du fournisseur','width':i['width'],'height':i['height']} for i in p['images']]
 options=[{'id':str(o.get('id',index)),'name':'Size' if o['name'].lower() in ['taille','size','pointure'] else o['name'],'values':list(dict.fromkeys(str(v.get('option'+str(o['position']))) for v in vs))} for o in p['options']]
 tags=['selection-2026',item['signal'],'replica']
 sizes=[float(v['option1']) for v in vs if str(v.get('option1','')).replace('.','',1).isdigit()]
 if any(35<=n<=40 for n in sizes):tags+=['femme']
 if any(40<=n<=47 for n in sizes):tags+=['homme']
 description='Réplique qualité Master Copy Premium 1:1. Chaque commande est confirmée avec vous sur WhatsApp : pointure, délai et livraison.'
 variants=[]
 for v in vs:
  selected=[{'name':o['name'],'value':str(v['option'+str(i+1)])} for i,o in enumerate(options)]
  variants.append({'id':'plumas-reference-'+str(v['id']),'title':v['title'],'availableForSale':True,'quantityAvailable':None,'selectedOptions':selected,'price':{'amount':v['price'],'currencyCode':'MAD'},'compareAtPrice':None,'image':images[0],'sku':v.get('sku')})
 amounts=[float(v['price']) for v in vs];priceRange={'minVariantPrice':{'amount':str(min(amounts)),'currencyCode':'MAD'},'maxVariantPrice':{'amount':str(max(amounts)),'currencyCode':'MAD'}}
 catalog.append({'id':'beyond-reference-'+str(p['id']),'handle':p['handle'],'title':title,'description':description,'descriptionHtml':'<p>'+html.escape(description)+'</p>','vendor':brand,'productType':'Sneakers','tags':tags,'availableForSale':True,'previewOnly':False,'featuredImage':images[0],'images':images,'options':options,'variants':variants,'priceRange':priceRange,'compareAtPriceRange':None,'metafields':{'originalUrl':item['source_url'],'originalPriceLabel':str(min(amounts))+' MAD — prix Plumas Kicks, relevé '+snap['captured_at'][:10],'details':'Réplique qualité Master Copy Premium 1:1. Pointures disponibles à la date de mise en ligne, confirmées à la commande.'}})
 for i in range(max(len(vs),len(images))):
  row={'Handle':p['handle']}
  if i==0:row.update({'Title':title+' — Réplique','Body (HTML)':'<p>'+html.escape(description)+'</p>','Vendor':'BEYOND PLUS','Type':'Sneakers','Tags':', '.join(tags),'Published':'FALSE','Status':'draft'})
  if i<len(vs):
   v=vs[i];row.update({'Option1 Name':'Pointure','Option1 Value':v['option1'],'Variant Price':v['price'],'Variant Inventory Tracker':'shopify','Variant Inventory Qty':0,'Variant Inventory Policy':'deny','Variant Fulfillment Service':'manual','Variant Requires Shipping':'TRUE','Variant Taxable':'TRUE'})
  if i<len(images):row.update({'Image Src':images[i]['url'],'Image Position':i+1,'Image Alt Text':title+' — Réplique'})
  csvrows.append(row)
(r/'storefront/src/data/catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2))
(r/'storefront/src/data/catalog.ts').write_text('import type { Product } from "@/lib/shopify/types";\nimport data from "./catalog.json";\nexport const CATALOG: Product[] = data;\nexport const PRODUCT_BY_HANDLE = new Map(CATALOG.map(p => [p.handle,p]));\n')
fields=list(dict.fromkeys(k for row in csvrows for k in row))
with (r/'shopify-import/produits-beyond-plus-brouillon.csv').open('w',newline='') as f:
 w=csv.DictWriter(f,fieldnames=fields);w.writeheader();w.writerows(csvrows)
with (r/'research/plumas/exclusions.csv').open('w',newline='') as f:
 w=csv.DictWriter(f,fieldnames=['handle','title','reason']);w.writeheader();w.writerows(snap['excluded'])
lines=['# Présélection BEYOND PLUS — '+snap['captured_at'][:10],'',f"Catalogue : {snap['total']} produits. {snap['available']} disponibles avec photo, {len(snap['excluded'])} exclus. {len(catalog)} retenus.",'','Sélection : 12 produits de la collection Best Sellers actuelle, puis 12 nouveautés publiées sur le site en 2026, dédoublonnés et disponibles. Aucun chiffre de ventes annuel public ; publication Shopify ne signifie pas sortie du modèle en 2026. Les produits hors sélection ne sont pas qualifiés de mauvaises ventes.','', 'Nature déclarée par le site : Master Copy Premium 1:1, répliques. Les photos et prix sont ceux du fournisseur. Pas de stock BEYOND PLUS vérifié. CSV non publié, stock zéro, statut brouillon. Les univers Women et Men reposent uniquement sur les plages de pointures (35–40 / 40–47), et non une classification fabricant.','','| Produit | Signal | Prix source MAD | Pointures source |','|---|---|---:|---|']
for item,p in zip(snap['selected'],catalog):lines.append(f"| [{p['title']}]({item['source_url']}) | {item['signal']} | {p['priceRange']['minVariantPrice']['amount']} | {', '.join(v['title'] for v in p['variants'])} |")
(r/'research/plumas/SELECTION.md').write_text('\n'.join(lines)+'\n')
print('Generated',len(catalog),'products;',len(csvrows),'CSV rows')
