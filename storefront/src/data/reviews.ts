// Real customer reviews only. Add an entry after a verified delivery, with the
// customer's consent for the first name and photo. Never invent or copy reviews.
export interface Review {
  product: string;       // product handle
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  firstName: string;
  size: string;          // size bought, e.g. "41"
  model: string;         // model bought, e.g. "adidas Samba OG"
  date: string;          // AAAA-MM-JJ
  photo?: string;        // /reviews/<file>.webp, customer's own photo
}

export const REVIEWS: Review[] = [];

export function reviewsFor(handle: string) {
  const list = REVIEWS.filter((r) => r.product === handle).sort((a, b) => b.date.localeCompare(a.date));
  const average = list.length ? list.reduce((n, r) => n + r.rating, 0) / list.length : null;
  return { list, average };
}
