// Store contact — the one place to edit. WhatsApp number in international
// format, digits only (e.g. "212600000000"). Empty: WhatsApp opens and the
// customer picks the recipient.
export const STORE = {
  whatsapp: "212669866831",
  instagram: "https://www.instagram.com/beyond_plus.ma/",
};

export function whatsappUrl(text: string) {
  const to = STORE.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${to}?text=${encodeURIComponent(text)}`;
}
