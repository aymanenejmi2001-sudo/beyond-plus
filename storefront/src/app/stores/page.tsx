import Link from "next/link";
export const metadata = {title:"Nos points de rencontre", robots:{index:false,follow:true}};
export default function Page(){return <section className="beyond-page"><p className="eyebrow">BEYOND PLUS</p><h1>Nos points de rencontre</h1><h2>À suivre.</h2><p>Les informations sur nos points de vente seront annoncées ici.</p><Link href="/lookbook" className="beyond-link">Explorer l’éditorial ↗</Link></section>}
