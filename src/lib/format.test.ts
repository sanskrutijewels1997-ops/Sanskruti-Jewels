import { describe, expect, it } from 'vitest';
import { formatDate, formatPrice, formatWeight, friendlyError, slugify } from './format';

describe('formatPrice', () => {
  it('formats rupees with Indian grouping only when the price is shown', () => {
    expect(formatPrice({ price: 1234567, showPrice: true })).toBe('₹12,34,567');
    expect(formatPrice({ price: 1234567, showPrice: false })).toBeNull();
    expect(formatPrice({ price: null, showPrice: true })).toBeNull();
  });
});

describe('formatWeight', () => {
  it('handles ranges, single values and missing weights', () => {
    expect(formatWeight({ weightMin: 3, weightMax: 5 })).toBe('3–5 g');
    expect(formatWeight({ weightMin: 4, weightMax: 4 })).toBe('4 g');
    expect(formatWeight({ weightMin: null, weightMax: 7 })).toBe('7 g');
    expect(formatWeight({ weightMin: null, weightMax: null })).toBe('');
  });
});

describe('slugify', () => {
  it('makes URL-safe slugs', () => {
    expect(slugify("  Men's Gold Kada — 22K!  ")).toBe('mens-gold-kada-22k');
  });
});

describe('formatDate', () => {
  it('uses Indian day-month-year order', () => {
    expect(formatDate('2026-10-28T10:00:00Z')).toMatch(/28 Oct 2026/);
  });
});

describe('friendlyError', () => {
  it.each([
    ['Invalid login credentials', 'Incorrect email or password.'],
    ['User already registered', 'An account with this email already exists. Try signing in.'],
    ['Email not confirmed', 'Please confirm your email address first — check your inbox.'],
    ['duplicate key value violates unique constraint', 'That SKU or URL slug is already used by another item.'],
    ['Failed to fetch', 'Network problem — check your connection and try again.']
  ])('maps "%s"', (raw, friendly) => {
    expect(friendlyError(new Error(raw))).toBe(friendly);
  });

  it('passes other messages through, including non-Error values', () => {
    expect(friendlyError(new Error('Something odd'))).toBe('Something odd');
    expect(friendlyError('plain string')).toBe('plain string');
  });
});
