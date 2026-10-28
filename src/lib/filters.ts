import type { Category, Collection, Product } from '../types';

/** Catalogue filters. They live in the URL so Back restores the exact list. */
export interface Filters {
  categories: string[]; // category slugs
  collections: string[]; // collection slugs
  metals: string[];
  purities: string[];
  styles: string[];
  availability: string[];
  maxWeight: number;
  newOnly: boolean;
}

export type ListFacet = 'categories' | 'collections' | 'metals' | 'purities' | 'styles' | 'availability';

export const MAX_WEIGHT = 120;

export const emptyFilters: Filters = {
  categories: [],
  collections: [],
  metals: [],
  purities: [],
  styles: [],
  availability: [],
  maxWeight: MAX_WEIGHT,
  newOnly: false
};

const LIST_PARAMS: Record<ListFacet, string> = {
  categories: 'category',
  collections: 'collection',
  metals: 'metal',
  purities: 'purity',
  styles: 'style',
  availability: 'avail'
};

export const sorts = {
  newest: 'Newest first',
  popular: 'Popularity',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low'
} as const;
export type SortKey = keyof typeof sorts;

export function parseParams(params: URLSearchParams) {
  const list = (k: string) => params.get(k)?.split(',').filter(Boolean) ?? [];
  const filters: Filters = { ...emptyFilters };
  (Object.keys(LIST_PARAMS) as ListFacet[]).forEach((f) => (filters[f] = list(LIST_PARAMS[f])));
  const w = Number(params.get('maxw'));
  filters.maxWeight = w > 0 && w < MAX_WEIGHT ? w : MAX_WEIGHT;
  filters.newOnly = params.get('filter') === 'new';
  const s = params.get('sort') as SortKey | null;
  return { filters, q: params.get('q') ?? '', sort: (s && s in sorts ? s : 'newest') as SortKey };
}

export function toParams(filters: Filters, q: string, sort: SortKey) {
  const p = new URLSearchParams();
  if (q.trim()) p.set('q', q.trim());
  (Object.keys(LIST_PARAMS) as ListFacet[]).forEach((f) => filters[f].length && p.set(LIST_PARAMS[f], filters[f].join(',')));
  if (filters.maxWeight < MAX_WEIGHT) p.set('maxw', String(filters.maxWeight));
  if (filters.newOnly) p.set('filter', 'new');
  if (sort !== 'newest') p.set('sort', sort);
  return p;
}

export function activeCount(f: Filters) {
  return (Object.keys(LIST_PARAMS) as ListFacet[]).reduce((n, k) => n + f[k].length, 0) + (f.maxWeight < MAX_WEIGHT ? 1 : 0) + (f.newOnly ? 1 : 0);
}

interface Lookups {
  categories: Category[];
  collections: Collection[];
  categoryName: (id: string | null) => string;
}

/** The value a product has for a list facet (slug for categories/collections). */
export function facetValue(p: Product, facet: ListFacet, l: Lookups): string {
  switch (facet) {
    case 'categories':
      return l.categories.find((c) => c.id === p.categoryId)?.slug ?? '';
    case 'collections':
      return l.collections.find((c) => c.id === p.collectionId)?.slug ?? '';
    case 'metals':
      return p.metal;
    case 'purities':
      return p.purity;
    case 'styles':
      return p.style;
    case 'availability':
      return p.availability;
  }
}

/** Applies filters, optionally ignoring one facet (used to compute option counts). */
export function applyFilters(products: Product[], f: Filters, q: string, l: Lookups, ignore?: ListFacet) {
  return products.filter((p) => {
    if (f.newOnly && !p.isNew) return false;
    if (f.maxWeight < MAX_WEIGHT && (p.weightMin ?? 0) > f.maxWeight) return false;
    for (const facet of Object.keys(LIST_PARAMS) as ListFacet[]) {
      if (facet === ignore || !f[facet].length) continue;
      if (!f[facet].includes(facetValue(p, facet, l))) return false;
    }
    return !q.trim() || matchesQuery(p, q.trim(), l.categoryName(p.categoryId));
  });
}

export function sortProducts(list: Product[], sort: SortKey) {
  const priceOf = (p: Product) => (p.showPrice && p.price !== null ? p.price : null);
  const byPrice = (dir: 1 | -1) => (a: Product, b: Product) => {
    const pa = priceOf(a);
    const pb = priceOf(b);
    if (pa === null && pb === null) return 0;
    if (pa === null) return 1; // "price on request" always last
    if (pb === null) return -1;
    return (pa - pb) * dir;
  };
  const out = [...list];
  if (sort === 'newest') out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (sort === 'popular') out.sort((a, b) => b.views - a.views);
  if (sort === 'price-asc') out.sort(byPrice(1));
  if (sort === 'price-desc') out.sort(byPrice(-1));
  return out;
}

/** Every word of the query must appear somewhere in the product's text. */
export function matchesQuery(p: Product, q: string, categoryName: string) {
  const hay = [p.name, p.sku, p.style, p.metal, p.purity, p.stone, p.description, categoryName].join(' ').toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w));
}
