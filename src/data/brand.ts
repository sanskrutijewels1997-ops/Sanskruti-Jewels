export const BRAND = {
  name: 'Sanskruti Jewels',
  shortName: 'Sanskruti',
  slogan: 'Sell More. Stock Less.',
  since: 1977,
  logo: '/brand/logo.png',
  /** Home page introduction. Edit the words here; the layout picks them up. */
  intro: {
    title: 'Quality you can trust. Delivery you can count on.',
    paragraphs: [
      'Since 1977, Sanskruti Jewels has been built on two promises: uncompromising quality and punctuality. Every piece is crafted with care, checked for purity and weight, and delivered on the date we commit to, because your customers’ trust depends on ours.',
      'We don’t just take orders, we build relationships. Once your order is placed with us, you can be completely tension-free: from making and hallmarking to dispatch, we take care of every step and keep you informed along the way.'
    ],
    pillars: [
      { title: 'Quality', text: 'Hallmarked purity, accurate weights and a flawless finish.' },
      { title: 'Punctuality', text: 'Committed delivery dates, kept every time.' },
      { title: 'Trust', text: 'Relationships built order after order since 1977.' },
      { title: 'Tension-free', text: 'Place your order and relax. We handle the rest.' }
    ]
  },
  /** Optional WhatsApp number in international format without "+", e.g. 919876543210. */
  whatsapp: (import.meta.env.VITE_WHATSAPP_NUMBER ?? ''),
  email: (import.meta.env.VITE_CONTACT_EMAIL ?? '')
};
