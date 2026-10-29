import type { Product } from '../types';

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

export function formatPrice(p: Pick<Product, 'price' | 'showPrice'>) {
  return p.showPrice && p.price !== null ? inr.format(p.price) : null;
}

/** Gross weight when known, otherwise the optional min–max range. */
export function formatWeight(p: Pick<Product, 'weightMin' | 'weightMax'> & Partial<Pick<Product, 'grossWeight'>>) {
  if (p.grossWeight !== null && p.grossWeight !== undefined) return `${p.grossWeight} g`;
  const { weightMin: a, weightMax: b } = p;
  if (a === null && b === null) return '';
  if (a === null || b === null || a === b) return `${a ?? b} g`;
  return `${a}–${b} g`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Turns backend error messages into something a shopper can act on. */
export function friendlyError(e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  if (/invalid login credentials/i.test(msg)) return 'Incorrect email or password.';
  if (/already registered/i.test(msg)) return 'An account with this email already exists. Try signing in.';
  if (/email not confirmed/i.test(msg)) return 'Please confirm your email address first — check your inbox.';
  if (/duplicate key/i.test(msg)) return 'That SKU or URL slug is already used by another item.';
  if (/failed to fetch|network/i.test(msg)) return 'Network problem — check your connection and try again.';
  return msg;
}
