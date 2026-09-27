// BEYOND PLUS art direction — one system, three registers:
//   Women   : cold steel studio, bordeaux sneakers (the hero's register)
//   Men     : night, chrome, industrial textures
//   Culture : black & white, one red accent
// Excluded from the site: the padel group shot (white, multicolour, not sneaker
// culture) and the Asics sky collage (saturated blue, logo-led).
type Photo = { src: string; width: number; height: number; alt: string };
const p = (file: string, width: number, height: number, alt: string): Photo => ({ src: `/images/beyond/${file}`, width, height, alt });

export const PHOTOS = {
  womenHero: p("editorial-1.jpg", 1080, 1350, "Blazer gris et sneakers bordeaux, studio acier"),
  womenCrouch: p("editorial-2.jpg", 1080, 1350, "Sneakers bordeaux, chaussettes noires, studio acier"),
  womenSquat: p("editorial-6.jpg", 1042, 1563, "Blazer gris, sneakers bordeaux"),
  womenCoat: p("women-coat.jpg", 960, 1200, "Manteau noir et sneakers chromées, studio acier"),
  womenAir: p("women-air.jpg", 1200, 1800, "Sneakers vert métal et chaussette blanche"),
  menChrome: p("men-chrome.jpg", 1000, 1340, "Sneakers noir et argent, gants chromés, lumière de nuit"),
  menChromeWide: p("men-chrome-wide.jpg", 1000, 375, ""),
  menShutter: p("men-shutter.jpg", 736, 1110, "Sneakers trail noires devant un rideau métallique"),
  menCourt: p("men-court.jpg", 736, 981, "Sneaker claire posée sur un ballon de basket"),
  menSpikes: p("men-spikes.jpg", 1200, 1800, "Chaussures à pointes, grain argentique"),
  cultureLeg: p("editorial-3.jpg", 1080, 1350, "Sneaker trois bandes, noir et blanc"),
  cultureStride: p("editorial-4.jpg", 1080, 1350, "Silhouette en pantalon trois bandes, noir et blanc"),
  cultureSpeed: p("culture-speed.jpg", 736, 488, "Sneaker daim rouge et casque, noir et blanc"),
};

export const ASSETS = {
  spotlight: { women: PHOTOS.womenCrouch, men: PHOTOS.menChrome },
  textBanner: PHOTOS.cultureLeg,
  imageWithText: PHOTOS.womenSquat,
  collectionBanner: PHOTOS.menChromeWide,
} as const;

export const LOOKBOOK: { chapter: string; photos: Photo[] }[] = [
  { chapter: "Beyond Women", photos: [PHOTOS.womenHero, PHOTOS.womenCoat, PHOTOS.womenCrouch, PHOTOS.womenSquat, PHOTOS.womenAir] },
  { chapter: "Beyond Men", photos: [PHOTOS.menChrome, PHOTOS.menShutter, PHOTOS.menCourt, PHOTOS.menSpikes] },
  { chapter: "Culture", photos: [PHOTOS.cultureLeg, PHOTOS.cultureStride, PHOTOS.cultureSpeed] },
];
