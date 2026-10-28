import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';
import {
  FilterPanel,
  MAX_WEIGHT,
  activeFilterCount,
  emptyFilters,
  type Filters
} from '../components/catalogue/FilterPanel';
import { ErrorNotice } from '../components/ui';
import { useCatalogue } from '../lib/queries';

const sorts = {
  newest: 'Newest',
  popular: 'Most Popular',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low'
} as const;
type SortKey = keyof typeof sorts;

const PAGE_SIZE = 24;

function filtersFromParams(params: URLSearchParams): Filters {
  const list = (k: string) => params.get(k)?.split(',').filter(Boolean) ?? [];
  return {
    ...emptyFilters,
    newOnly: params.get('filter') === 'new',
    categories: list('category'),
    collections: list('collection')
  };
}

export function Catalogue() {
  const [params] = useSearchParams();
  const { published, categories, collections, categoryName, loading, error } = useCatalogue();

  const [query, setQuery] = useState(params.get('q') ?? '');
  const [sort, setSort] = useState<SortKey>((params.get('sort') as SortKey) in sorts ? (params.get('sort') as SortKey) : 'newest');
  const [filters, setFilters] = useState<Filters>(() => filtersFromParams(params));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [limit, setLimit] = useState(PAGE_SIZE);

  // Header search / nav links change the URL while this page stays mounted.
  const paramKey = params.toString();
  useEffect(() => {
    setQuery(params.get('q') ?? '');
    setFilters(filtersFromParams(params));
    const s = params.get('sort') as SortKey;
    if (s in sorts) setSort(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramKey]);

  useEffect(() => setLimit(PAGE_SIZE), [filters, query, sort]);

  const results = useMemo(() => {
    const catIds = new Set(categories.filter((c) => filters.categories.includes(c.slug)).map((c) => c.id));
    const colIds = new Set(collections.filter((c) => filters.collections.includes(c.slug)).map((c) => c.id));
    const q = query.trim().toLowerCase();

    const list = published.filter((p) => {
      if (filters.newOnly && !p.isNew) return false;
      if (catIds.size && !(p.categoryId && catIds.has(p.categoryId))) return false;
      if (colIds.size && !(p.collectionId && colIds.has(p.collectionId))) return false;
      if (filters.metals.length && !filters.metals.includes(p.metal)) return false;
      if (filters.purities.length && !filters.purities.includes(p.purity)) return false;
      if (filters.styles.length && !filters.styles.includes(p.style)) return false;
      if (filters.availability.length && !filters.availability.includes(p.availability)) return false;
      if (filters.maxWeight < MAX_WEIGHT && (p.weightMin ?? 0) > filters.maxWeight) return false;
      if (q) {
        const hay = [p.name, p.sku, p.style, p.metal, p.stone, p.description, categoryName(p.categoryId)]
          .join(' ')
          .toLowerCase();
        if (!q.split(/\s+/).every((word) => hay.includes(word))) return false;
      }
      return true;
    });

    const priceOf = (p: (typeof list)[number]) => (p.showPrice && p.price !== null ? p.price : null);
    const byPrice = (dir: 1 | -1) => (a: (typeof list)[number], b: (typeof list)[number]) => {
      const pa = priceOf(a);
      const pb = priceOf(b);
      if (pa === null && pb === null) return 0;
      if (pa === null) return 1; // "price on request" always last
      if (pb === null) return -1;
      return (pa - pb) * dir;
    };

    const sorted = [...list];
    if (sort === 'newest') sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sort === 'popular') sorted.sort((a, b) => b.views - a.views);
    if (sort === 'price-asc') sorted.sort(byPrice(1));
    if (sort === 'price-desc') sorted.sort(byPrice(-1));
    return sorted;
  }, [published, categories, collections, filters, query, sort, categoryName]);

  const reset = () => {
    setFilters(emptyFilters);
    setQuery('');
  };

  const heading =
    filters.collections.length === 1
      ? collections.find((c) => c.slug === filters.collections[0])
      : undefined;
  const headingCategory =
    !heading && filters.categories.length === 1
      ? categories.find((c) => c.slug === filters.categories[0])
      : undefined;
  const count = activeFilterCount(filters);

  return (
    <div className="bg-ivory">
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-site px-5 py-10 lg:px-10 lg:py-14">
          <p className="eyebrow text-gold">{heading ? 'Collection' : 'The full collection'}</p>
          <h1 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl lg:text-6xl">
            {heading?.name ?? headingCategory?.name ?? 'Explore Jewellery'}
          </h1>
          <p className="mt-4 max-w-2xl text-charcoal-muted">
            {heading?.tagline || 'Browse our designs, save the ones you love and enquire for today’s price.'}
          </p>

          <div className="relative mt-8 max-w-3xl">
            <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, SKU, stone, style…"
              aria-label="Search catalogue"
              className="h-14 w-full rounded-full border border-line bg-ivory pl-14 pr-5 text-sm text-charcoal outline-none transition-colors duration-150 ease-luxe focus:border-gold"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-site gap-10 px-4 py-8 sm:px-5 lg:px-10 lg:py-10">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-[140px] max-h-[calc(100vh-170px)] overflow-y-auto thin-scrollbar pr-2">
            <FilterPanel filters={filters} onChange={setFilters} onReset={reset} categories={categories} collections={collections} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <p className="text-sm text-charcoal-soft">
              <strong className="font-medium text-charcoal">{results.length}</strong>{' '}
              {results.length === 1 ? 'design' : 'designs'}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm text-charcoal lg:hidden"
              >
                <SlidersHorizontalIcon className="h-4 w-4" />
                Filters{count > 0 && ` (${count})`}
              </button>
              <label className="flex items-center gap-2 text-sm text-charcoal-muted">
                <span className="hidden sm:inline">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-10 rounded-full border border-line bg-white px-4 text-sm text-charcoal outline-none focus:border-gold"
                >
                  {Object.entries(sorts).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {error ? (
            <div className="mt-6">
              <ErrorNotice error={error} />
            </div>
          ) : loading ? (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="mt-16 rounded-2xl border border-dashed border-line bg-white px-8 py-20 text-center">
              <h2 className="font-display text-3xl text-charcoal">No designs match</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-charcoal-muted">
                Try removing a filter or searching for something else.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-7 rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white transition-colors duration-150 ease-luxe hover:bg-gold"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                {results.slice(0, limit).map((p) => (
                  <ProductCard key={p.id} product={p} categoryName={categoryName(p.categoryId)} />
                ))}
              </div>
              <div className="mt-14 flex flex-col items-center gap-3 border-t border-line pt-10">
                <p className="text-xs text-charcoal-faint">
                  Showing {Math.min(limit, results.length)} of {results.length} designs
                </p>
                {limit < results.length && (
                  <button
                    type="button"
                    onClick={() => setLimit((l) => l + PAGE_SIZE)}
                    className="rounded-full border border-charcoal px-8 py-3 text-sm font-medium text-charcoal transition-colors duration-150 ease-luxe hover:bg-charcoal hover:text-white"
                  >
                    Load more designs
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex bg-charcoal/45 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            onClick={() => setDrawerOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="h-full w-[85%] max-w-sm overflow-y-auto bg-white p-5 pt-[max(1.25rem,env(safe-area-inset-top))]"
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
            >
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close filters"
                  className="rounded-full p-2 text-charcoal-muted hover:bg-ivory"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <FilterPanel filters={filters} onChange={setFilters} onReset={reset} categories={categories} collections={collections} />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="sticky bottom-0 mt-6 w-full rounded-full bg-charcoal px-5 py-3.5 text-sm font-medium text-white"
              >
                Show {results.length} designs
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
