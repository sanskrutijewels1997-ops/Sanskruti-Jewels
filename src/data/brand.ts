export const BRAND = {
  name: 'Sanskruti Jewels',
  shortName: 'Sanskruti',
  slogan: 'Sell More. Stock Less.',
  since: 1977,
  logo: '/brand/logo.png',
  /** Optional WhatsApp number in international format without "+", e.g. 919876543210. */
  whatsapp: (import.meta.env.VITE_WHATSAPP_NUMBER ?? ''),
  email: (import.meta.env.VITE_CONTACT_EMAIL ?? '')
};
