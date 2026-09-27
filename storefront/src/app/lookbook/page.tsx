import Image from "next/image";
import { LOOKBOOK } from "@/data/assets";

export const metadata = { title: "Lookbook sneakers", description: "Le lookbook BEYOND PLUS : comment porter les sneakers du moment, en trois univers, Women, Men et Culture.", alternates: { canonical: "/lookbook" } };

export default function Lookbook() {
  return (
    <>
      <section className="beyond-page">
        <p className="eyebrow">Lookbook</p>
        <h1>Sneaker culture.</h1>
        <p>Des lignes sportives. Des silhouettes libres. Une autre façon de porter la sneaker.</p>
      </section>
      {LOOKBOOK.map((chapter, c) => (
        <section className="beyond-chapter" key={chapter.chapter} data-register={c}>
          <header>
            <h2>{chapter.chapter}</h2>
          </header>
          <div className="beyond-editorial">
            {chapter.photos.map((photo) => {
              return (
                <figure key={photo.src}>
                  <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(min-width:990px) 33vw, (min-width:750px) 50vw, 100vw" />
                </figure>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
