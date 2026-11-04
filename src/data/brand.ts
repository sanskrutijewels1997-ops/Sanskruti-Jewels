export const BRAND = {
  name: 'Sanskruti Jewels',
  shortName: 'Sanskruti',
  slogan: 'Sell More. Stock Less.',
  since: 1997,
  logo: '/brand/logo.png',
  /** Home page introduction. Edit the words here; the layout picks them up. */
  intro: {
    title: 'A Legacy of Trust Since 1997.',
    paragraphs: [
      'At Sanskruti Jewels, we stand by two unwavering promises: uncompromising quality and absolute punctuality. Every creation is meticulously crafted, assayed for purity and precision, and delivered right on schedule.',
      'From ready stock to bespoke creations, we oversee every detail with utmost care, keeping you informed at every step.',
      'More than jewellery, we build lasting relationships founded on trust, quality and commitment.'
    ],
    pillars: [
      { title: 'Quality', text: 'Hallmarked purity, accurate weights and a flawless finish.' },
      { title: 'Punctuality', text: 'Committed delivery dates, kept every time.' },
      { title: 'Trust', text: 'Relationships built order after order since 1997.' },
      { title: 'Tension-free', text: 'Place your order and relax. We handle the rest.' }
    ]
  },
  /** Optional WhatsApp number in international format without "+", e.g. 919876543210. */
  whatsapp: (import.meta.env.VITE_WHATSAPP_NUMBER ?? ''),
  email: (import.meta.env.VITE_CONTACT_EMAIL ?? ''),
  /** Public website address, used for shared links (the native apps have no web address of their own). */
  siteUrl: (import.meta.env.VITE_SITE_URL ?? '').replace(/\/$/, '')
};

/** Public link to a product, for sharing and messages. */
export function productUrl(slug: string) {
  return `${BRAND.siteUrl || window.location.origin}/product/${slug}`;
}
