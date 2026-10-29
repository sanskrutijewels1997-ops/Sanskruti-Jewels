// Fixed option lists used by catalogue filters and the admin product form.
export const metals = ['Gold', 'Diamond', 'Platinum', 'Silver'];

/** Trade purity marking. Stored as-is on products and used in URLs (?purity=…). */
export const MELTING_92 = '92 Melting';
export const purities = [MELTING_92, '14K', '18K', '22K', '24K', '925', '950'];

/**
 * The two purities customers shop by most, promoted as one-tap shortcuts on Home,
 * in Search and on the product list.
 */
export const purityShortcuts = [
  { value: MELTING_92, label: '92 Melting', short: '92 Melting' },
  { value: '22K', label: '22 Carat', short: '22 Carat' }
] as const;

/** Suggestions for the Make field; admins can type anything. */
export const makes = ['Handmade', 'Machine Made', 'Casting', 'CNC', 'Kolkata', 'Rajkot', 'Turkish', 'Italian'];

export const styles = [
  'Traditional',
  'Modern',
  'Bridal',
  'Antique',
  'Temple',
  'Lightweight',
  'Daily Wear',
  'Minimal'
];
export const availabilities = ['Ready Stock', 'Made to Order'] as const;
