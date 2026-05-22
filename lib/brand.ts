// Source unique de vérité pour l'identité de marque.
// Un renommage futur ne touche que ce fichier (le reste lit BRAND ou le token {brand}).
export const BRAND = {
  name: 'Mizan',
  nameArabic: 'ميزان',
  legal: 'Mizan SARL',
  // Domaine et contacts : conservés tant que la migration DNS n'est pas faite.
  domain: 'novaxis.ma',
  url: 'https://novaxis.ma',
  email: 'contact@novaxis.ma',
  linkedin: 'https://linkedin.com/company/novaxis',
  city: 'Rabat Agdal',
  country: 'MA'
} as const;

export type Brand = typeof BRAND;
