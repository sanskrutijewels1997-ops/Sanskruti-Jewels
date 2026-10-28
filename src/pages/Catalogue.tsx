import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';
import { FilterPanel, emptyFilters, type Filters } from '../components/catalogue/FilterPanel';
import { products } from '../data/products';

const sorts = ['Newest', 'Most Popular', 'Most Saved', 'Trending'] as const;

function normalizeCategory(value: string) {
  const base = value.replace(/ Jewellery$/, '');
  return base.endsWith("'s") ? base : base.replace(/s$/, '');
}

export function Catalogue() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [sort, setSort] = useState<(typeof sorts)[number]>('Newest');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    ...emptyFilters,
    newOnly: params.get('filter') === 'new',
    categories: params.get('category') ?
    [normalizeCategory(String(params.get('category')))] :
    []
  });

  const collectionParam = params.get('collection');

  useEffect(() => {
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(t);
  }, [filters, query, sort]);

  const results = useMemo(() => {
    let list = products.filter((p) => {
      if (collectionParam && p.collection !== collectionParam) return false;
      if (filters.newOnly && !p.isNew) return false;
      if (
      filters.categories.length &&
      !filters.categories.some(
        (c) => p.category.includes(c) || p.style === c || p.metal === c
      ))

      return false;
      if (filters.materials.length && !filters.materials.includes(p.metal)) return false;
      if (filters.purities.length && !filters.purities.includes(p.purity)) return false;
      if (filters.styles.length && !filters.styles.includes(p.style)) return false;
      if (filters.suppliers.length && !filters.suppliers.includes(p.supplierId)) return false;
      if (filters.availability.length && !filters.availability.includes(p.availability))
      return false;
      if (p.weightMin > filters.maxWeight) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
        !p.name.toLowerCase().includes(q) &&
        !p.id.toLowerCase().includes(q) &&
        !p.category.toLowerCase().includes(q) &&
        !p.style.toLowerCase().includes(q))

        return false;
      }
      return true;
    });

    list = [...list];
    if (sort === 'Most Popular') list.sort((a, b) => b.views - a.views);
    if (sort === 'Most Saved') list.sort((a, b) => b.saves - a.saves);
    if (sort === 'Trending') list.sort((a, b) => Number(b.trending) - Number(a.trending));
    if (sort === 'Newest') list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    return list;
  }, [filters, query, sort, collectionParam]);

  const displayCount = useMemo(() => {
    const scale = results.length / products.length;
    return Math.max(results.length, Math.round(12482 * scale));
  }, [results.length]);

  const reset = () => {
    setFilters(emptyFilters);
    setQuery('');
  };

  return (
    <div className="bg-ivory">
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-site px-5 py-12 lg:px-10 lg:py-16">
          <p className="eyebrow text-gold">
            {collectionParam ? collectionParam : 'The full catalogue'}
          </p>
          <h1 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl lg:text-6xl">
            Explore Jewellery Designs
          </h1>
          <p className="mt-4 max-w-2xl text-charcoal-muted">
            Browse thousands of jewellery designs from verified suppliers.
          </p>

          <div className="relative mt-8 max-w-3xl">
            <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by design, product ID, jewellery type…"
              aria-label="Search catalogue"
              className="h-14 w-full rounded-full border border-line bg-ivory pl-14 pr-5 text-sm text-charcoal outline-none transition-colors duration-150 ease-luxe focus:border-gold" />
            
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-site gap-10 px-5 py-10 lg:px-10">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-[140px] max-h-[calc(100vh-170px)] overflow-y-auto thin-scrollbar pr-2">
            <FilterPanel filters={filters} onChange={setFilters} onReset={reset} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <p className="text-sm text-charcoal-soft">
              <strong className="font-medium text-charcoal">
                {displayCount.toLocaleString('en-IN')}
              </strong>{' '}
              Designs Found
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm text-charcoal lg:hidden">
                
                <SlidersHorizontalIcon className="h-4 w-4" />
                Filters
              </button>
              <label className="flex items-center gap-2 text-sm text-charcoal-muted">
                <span className="hidden sm:inline">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as (typeof sorts)[number])}
                  className="h-10 rounded-full border border-line bg-white px-4 text-sm text-charcoal outline-none focus:border-gold">
                  
                  {sorts.map((s) =>
                  <option key={s}>{s}</option>
                  )}
                </select>
              </label>
            </div>
          </div>

          {loading ?
          <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) =>
            <ProductCardSkeleton key={i} />
            )}
            </div> :
          results.length === 0 ?
          <div className="mt-16 rounded-2xl border border-dashed border-line bg-white px-8 py-20 text-center">
              <h2 className="font-display text-3xl text-charcoal">No designs match these filters</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-charcoal-muted">
                Try widening the weight range, removing a purity filter, or searching a different
                product ID.
              </p>
              <button
              type="button"
              onClick={reset}
              className="mt-7 rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white transition-colors duration-150 ease-luxe hover:bg-gold">
              
                Clear all filters
              </button>
            </div> :

          <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
              {results.map((p) =>
            <ProductCard key={p.id} product={p} />
            )}
            </div>
          }

          {!loading && results.length > 0 &&
          <div className="mt-14 flex flex-col items-center gap-3 border-t border-line pt-10">
              <p className="text-xs text-charcoal-faint">
                Showing {results.length} of {displayCount.toLocaleString('en-IN')} designs
              </p>
              <button
              type="button"
              className="rounded-full border border-charcoal px-8 py-3 text-sm font-medium text-charcoal transition-colors duration-150 ease-luxe hover:bg-charcoal hover:text-white">
              
                Load more designs
              </button>
            </div>
          }
        </div>
      </div>

      <AnimatePresence>
        {drawerOpen &&
        <motion.div
          className="fixed inset-0 z-50 flex bg-charcoal/45 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          onClick={() => setDrawerOpen(false)}>
          
            <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="h-full w-[85%] max-w-sm overflow-y-auto bg-white p-5"
            role="dialog"
            aria-modal="true"
            aria-label="Filters">
            
              <div className="mb-2 flex justify-end">
                <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close filters"
                className="rounded-full p-2 text-charcoal-muted hover:bg-ivory">
                
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <FilterPanel filters={filters} onChange={setFilters} onReset={reset} />
              <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="sticky bottom-0 mt-6 w-full rounded-full bg-charcoal px-5 py-3.5 text-sm font-medium text-white">
              
                Show {results.length} designs
              </button>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}