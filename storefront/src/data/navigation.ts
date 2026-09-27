import type { MenuItem } from "@/lib/shopify/types";
export const SALE_HREF = "/collections/sale";
export const MAIN_MENU: MenuItem[] = [
 { title:"Sneakers", href:"/collections/nouveautes", type:"dropdown", columns:[{ title:"Sneakers", items:[
   {title:"Toutes les sneakers",href:"/collections/nouveautes"},
   {title:"Marques",href:"/marques"},
   {title:"Trending Now",href:"/collections/trending-now"},
   {title:"Basketball",href:"/collections/basketball"},
   {title:"Retro Runners",href:"/collections/retro-runners"},
   {title:"Low Profile",href:"/collections/low-profile"},
   {title:"Tech Runners",href:"/collections/tech-runners"},
   {title:"Skate",href:"/collections/skate"},
   {title:"Icons",href:"/collections/icons"} ] }] },
 { title:"Femme", href:"/collections/femme", type:"link" },
 { title:"Homme", href:"/collections/homme", type:"link" },
 { title:"Drops", href:"/drops", type:"link" },
 { title:"L’univers", href:"/about", type:"link" }
];
export const FOOTER_MENUS = [
 {title:"Explorer",items:[{title:"Sneakers",href:"/collections/nouveautes"},{title:"Marques",href:"/marques"},{title:"Beyond Women",href:"/collections/femme"},{title:"Beyond Men",href:"/collections/homme"}]},
 {title:"Sélections",items:[{title:"Trending Now",href:"/collections/trending-now"},{title:"Low Profile",href:"/collections/low-profile"},{title:"Retro Runners",href:"/collections/retro-runners"},{title:"Basketball",href:"/collections/basketball"},{title:"Tech Runners",href:"/collections/tech-runners"},{title:"Skate",href:"/collections/skate"},{title:"Icons",href:"/collections/icons"},{title:"Moins de 600 DH",href:"/collections/sneakers-moins-de-600-dh"},{title:"Moins de 700 DH",href:"/collections/sneakers-moins-de-700-dh"}]},
 {title:"BEYOND PLUS",items:[{title:"Notre univers",href:"/about"},{title:"L’éditorial",href:"/lookbook"},{title:"Guides",href:"/guides"},{title:"Qualité & transparence",href:"/qualite-transparence"},{title:"Contact",href:"/contact"}]}
];
