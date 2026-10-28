export const BRAND = {
  name: 'Sanskruti Jewels',
  shortName: 'Sanskruti',
  slogan: 'Heritage, handcrafted for you.',
  logo: '/brand/logo.png',
  /** Optional WhatsApp number in international format without "+", e.g. 919876543210. */
  whatsapp: (import.meta.env.VITE_WHATSAPP_NUMBER ?? ''),
  email: (import.meta.env.VITE_CONTACT_EMAIL ?? '')
};
