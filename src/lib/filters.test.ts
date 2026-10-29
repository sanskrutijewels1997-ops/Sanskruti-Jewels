import { describe, expect, it } from 'vitest';
import {
  MAX_WEIGHT,
  activeCount,
  applyFilters,
  emptyFilters,
  matchesQuery,
  parseParams,
  sortProducts,
  toParams
} from './filters';
import type { Category, Collection, Product } from '../types';

const categories: Category[] = [
  { id: 'c-ring', slug: 'rings', name: 'Rings', imageUrl: null, sortOrder: 0 },
  { id: 'c-neck', slug: 'necklaces', name: 'Necklaces', imageUrl: null, sortOrder: 1 }
];
const collections: Collection[] = [{ id: 'k-bridal', slug: 'bridal', name: 'Bridal', tagline: '', imageUrl: null, sortOrder: 0 }];
const lookups = {
  categories,
  collections,
  categoryName: (id: string | null) => categories.find((c) => c.id === id)?.name ?? ''
};

function product(over: Partial<Product>): Product {
  return {
    id: over.sku ?? 'p',
    sku: 'SJ-1',
    slug: 'p',
    name: 'Piece',
    description: '',
    categoryId: null,
    collectionId: null,
    style: 'Modern',
    metal: 'Gold',
    purity: '22K',
    weightMin: 5,
    weightMax: 6,
    make: 'Handmade',
    grossWeight: null,
    stoneWeight: null,
    netWeight: null,
    quantity: 1,
    stone: '',
    size: '',
    availability: 'Ready Stock',
    price: null,
    showPrice: false,
    specifications: [],
    isNew: false,
    isFeatured: false,
    isPublished: true,
    views: 0,
    images: [],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...over
  };
}

const ring = product({ sku: 'R1', name: 'Solitaire Ring', categoryId: 'c-ring', metal: 'Diamond', purity: '18K', weightMin: 3, price: 50000, showPrice: true, views: 10, createdAt: '2026-03-01T00:00:00Z' });
const choker = product({ sku: 'N1', name: 'Kundan Bridal Choker', categoryId: 'c-neck', collectionId: 'k-bridal', weightMin: 60, isNew: true, availability: 'Made to Order', views: 99, createdAt: '2026-02-01T00:00:00Z' });
const chain = product({ sku: 'N2', name: 'Rope Chain', categoryId: 'c-neck', weightMin: 9, price: 20000, showPrice: true, views: 5, createdAt: '2026-01-01T00:00:00Z' });
const hidden = product({ sku: 'N3', name: 'Hidden Price Chain', categoryId: 'c-neck', price: 1000, showPrice: false, createdAt: '2025-12-01T00:00:00Z' });
const all = [ring, choker, chain, hidden];

describe('URL params', () => {
  it('round-trips every filter, the query and the sort', () => {
    const f = {
      ...emptyFilters,
      categories: ['rings', 'necklaces'],
      collections: ['bridal'],
      metals: ['Gold'],
      purities: ['22K'],
      styles: ['Temple'],
      availability: ['Ready Stock'],
      maxWeight: 20,
      newOnly: true
    };
    const params = toParams(f, ' kundan ', 'price-asc');
    expect(params.get('q')).toBe('kundan');
    expect(parseParams(params)).toEqual({ filters: f, q: 'kundan', sort: 'price-asc' });
  });

  it('omits defaults so plain URLs stay clean', () => {
    expect(toParams(emptyFilters, '', 'newest').toString()).toBe('');
  });

  it('ignores invalid sort and weight values', () => {
    const { filters, sort } = parseParams(new URLSearchParams('sort=bogus&maxw=-3'));
    expect(sort).toBe('newest');
    expect(filters.maxWeight).toBe(MAX_WEIGHT);
  });

  it('counts active filters', () => {
    expect(activeCount(emptyFilters)).toBe(0);
    expect(activeCount({ ...emptyFilters, metals: ['Gold', 'Silver'], maxWeight: 10, newOnly: true })).toBe(4);
  });
});

describe('applyFilters', () => {
  const run = (over: Partial<typeof emptyFilters>, q = '') =>
    applyFilters(all, { ...emptyFilters, ...over }, q, lookups).map((p) => p.sku);

  it('filters by category and collection slug', () => {
    expect(run({ categories: ['rings'] })).toEqual(['R1']);
    expect(run({ collections: ['bridal'] })).toEqual(['N1']);
  });

  it('combines values within a facet with OR and across facets with AND', () => {
    expect(run({ metals: ['Gold', 'Diamond'] })).toHaveLength(4);
    expect(run({ categories: ['necklaces'], availability: ['Made to Order'] })).toEqual(['N1']);
  });

  it('applies weight, new-only and text search', () => {
    expect(run({ maxWeight: 10 })).toEqual(['R1', 'N2', 'N3']);
    // Gross weight, when set, is what the weight filter uses
    const heavy = { ...ring, grossWeight: 40 };
    expect(applyFilters([heavy], { ...emptyFilters, maxWeight: 10 }, '', lookups)).toEqual([]);
    expect(run({ newOnly: true })).toEqual(['N1']);
    expect(run({}, 'chain rope')).toEqual(['N2']);
    expect(run({}, 'necklaces')).toEqual(['N1', 'N2', 'N3']); // matches category name
  });

  it('can ignore one facet (used for option counts)', () => {
    const f = { ...emptyFilters, categories: ['rings'], metals: ['Gold'] };
    expect(applyFilters(all, f, '', lookups).map((p) => p.sku)).toEqual([]);
    expect(applyFilters(all, f, '', lookups, 'metals').map((p) => p.sku)).toEqual(['R1']);
  });
});

describe('sortProducts', () => {
  it('sorts newest first by default and by popularity', () => {
    expect(sortProducts(all, 'newest').map((p) => p.sku)).toEqual(['R1', 'N1', 'N2', 'N3']);
    expect(sortProducts(all, 'popular').map((p) => p.sku)).toEqual(['N1', 'R1', 'N2', 'N3']);
  });

  it('sorts by visible price and always puts "price on request" last', () => {
    expect(sortProducts(all, 'price-asc').map((p) => p.sku).slice(0, 2)).toEqual(['N2', 'R1']);
    expect(sortProducts(all, 'price-desc').map((p) => p.sku).slice(0, 2)).toEqual(['R1', 'N2']);
    // N3 has a price but it's hidden, so it ranks with the "on request" items.
    expect(sortProducts(all, 'price-asc').slice(2).map((p) => p.sku).sort()).toEqual(['N1', 'N3']);
  });

  it('does not mutate the input', () => {
    const copy = [...all];
    sortProducts(all, 'popular');
    expect(all).toEqual(copy);
  });
});

describe('matchesQuery', () => {
  it('requires every word, case-insensitively, across name/sku/stone/category', () => {
    expect(matchesQuery(ring, 'SOLITAIRE r1', 'Rings')).toBe(true);
    expect(matchesQuery(ring, 'solitaire gold', 'Rings')).toBe(false);
    expect(matchesQuery(ring, 'rings', 'Rings')).toBe(true);
  });
});
