// Delivery approved by the merchant on 26 September 2026.
export const COMMERCE = {
  shipping: "Livraison gratuite partout au Maroc sous 12 à 48 heures après confirmation de la commande.",
  returns: "Échange de pointure sous 3 jours après la livraison : paire non portée, dans sa boîte d’origine, frais de retour à votre charge.",
  payment: "Aucun paiement en ligne. Le mode de paiement est convenu lors de notre appel de confirmation.",
  nature: "High copy · Réplique non originale",
  fit: "Les tailles peuvent varier selon la paire fournie. Mesurez votre pied en centimètres et gardez la mesure sous la main : on confirme la pointure avec vous par téléphone avant l’envoi. Les conseils de taille du modèle original ne garantissent pas ceux de cette réplique.",
};
export const optionLabel = (name: string) => name === "Size" ? "Pointure" : name === "Color" ? "Couleur" : name;
