// Fixed option lists used by catalogue filters and the admin product form.

/** Trade purity marking. Stored as-is on products and used in URLs (?purity=…). */
export const CARAT_92 = '92 Carat';
export const purities = [CARAT_92, '14K', '18K', '22K', '24K'];

/**
 * The two purities customers shop by most, promoted as one-tap shortcuts on Home,
 * in Search and on the product list.
 */
export const purityShortcuts = [
  { value: CARAT_92, label: '92 Carat', short: '92 Carat' },
  { value: '22K', label: '22 Carat', short: '22 Carat' }
] as const;

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
