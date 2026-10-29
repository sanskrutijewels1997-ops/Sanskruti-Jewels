import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowDownUpIcon, GemIcon, SearchIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react';
import { FilterSheet } from '../components/catalogue/FilterSheet';
import { SortSheet } from '../components/catalogue/SortSheet';
import { HeaderIconButton, PageHeader } from '../components/PageHeader';
import { ProductCard, ProductCardSkeleton, ProductGrid } from '../components/ProductCard';
import { EmptyState, ErrorNotice, chipClass } from '../components/ui';
import {
  MAX_WEIGHT,
  activeCount,
  applyFilters,
  emptyFilters,
  parseParams,
  sortProducts,
  sorts,
  toParams,
  type Filters,
  type ListFacet,
  type SortKey
} from '../lib/filters';
import { useCatalogue } from '../lib/queries';
import { purityShortcuts } from '../data/options';

const PAGE_SIZE = 24;

/** How many items were loaded, kept per history entry so Back returns to the same spot. */
function usePageLimit() {
  const { key } = useLocation();
  const storageKey = `plp-limit:${key}`;
  const [limit, setLimitState] = useState(() => {
    try {
      return Number(sessionStorage.getItem(storageKey)) || PAGE_SIZE;
    } catch {
      return PAGE_SIZE;
    }
  });
  const setLimit = (n: number) => {
    setLimitState(n);
    try {
      sessionStorage.setItem(storageKey, String(n));
    } catch {
      // Storage blocked; the list just resets to the first page on Back.
    }
  };
  return [limit, setLimit] as const;
}

export function Catalogue() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { published, categories, collections, categoryName, loading, error } = useCatalogue();
  const { filters, q, sort } = parseParams(params);
  const [sheet, setSheet] = useState<'sort' | 'filter' | null>(null);
  const [limit, setLimit] = usePageLimit();

  const lookups = useMemo(() => ({ categories, collections, categoryName }), [categories, collections, categoryName]);
  const results = useMemo(
    () => sortProducts(applyFilters(published, filters, q, lookups), sort),
    // params string captures every filter/sort/query change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [published, lookups, params.toString()]
  );

  const update = (f: Filters, nextQ = q, nextSort: SortKey = sort) => {
    setParams(toParams(f, nextQ, nextSort), { replace: true });
    setLimit(PAGE_SIZE);
    window.scrollTo({ top: 0 });
  };

  const collection = filters.collections.length === 1 ? collections.find((c) => c.slug === filters.collections[0]) : undefined;
  const category = filters.categories.length === 1 ? categories.find((c) => c.slug === filters.categories[0]) : undefined;
  const purityTitle =
    filters.purities.length === 1 ? purityShortcuts.find((s) => s.value === filters.purities[0])?.label : undefined;
  const title = q ? `“${q}”` : collection?.name ?? category?.name ?? purityTitle ?? (filters.newOnly ? 'New Arrivals' : 'All Jewellery');
  const count = activeCount(filters);

  // Removable chips for every applied filter (Baymard: show applied filters).
  const applied: { label: string; remove: () => void }[] = [];
  const listChip = (facet: ListFacet, label: (v: string) => string) =>
    filters[facet].forEach((v) =>
      applied.push({ label: label(v), remove: () => update({ ...filters, [facet]: filters[facet].filter((x) => x !== v) }) })
    );
  listChip('categories', (v) => categories.find((c) => c.slug === v)?.name ?? v);
  listChip('collections', (v) => collections.find((c) => c.slug === v)?.name ?? v);
  listChip('metals', (v) => v);
  filters.purities
    .filter((v) => !purityShortcuts.some((s) => s.value === v))
    .forEach((v) => applied.push({ label: v, remove: () => update({ ...filters, purities: filters.purities.filter((x) => x !== v) }) }));
  listChip('styles', (v) => v);
  listChip('availability', (v) => v);
  if (filters.maxWeight < MAX_WEIGHT) applied.push({ label: `Under ${filters.maxWeight} g`, remove: () => update({ ...filters, maxWeight: MAX_WEIGHT }) });
  if (q) applied.push({ label: `“${q}”`, remove: () => update(filters, '') });

  // One-tap quick filters shown when nothing is applied yet.
  const quick: { label: string; on: boolean; toggle: () => void }[] = [
    // The two purities customers shop by most come first.
    ...purityShortcuts.map((s) => ({
      label: s.label,
      on: filters.purities.includes(s.value),
      toggle: () =>
        update({
          ...filters,
          purities: filters.purities.includes(s.value) ? filters.purities.filter((x) => x !== s.value) : [...filters.purities, s.value]
        })
    })),
    { label: 'New', on: filters.newOnly, toggle: () => update({ ...filters, newOnly: !filters.newOnly }) },
    {
      label: 'Ready Stock',
      on: filters.availability.includes('Ready Stock'),
      toggle: () =>
        update({
          ...filters,
          availability: filters.availability.includes('Ready Stock') ? [] : ['Ready Stock']
        })
    },
    ...['Gold', 'Diamond', 'Silver'].map((m) => ({
      label: m,
      on: filters.metals.includes(m),
      toggle: () =>
        update({ ...filters, metals: filters.metals.includes(m) ? filters.metals.filter((x) => x !== m) : [...filters.metals, m] })
    })),
    { label: 'Under 10 g', on: filters.maxWeight === 10, toggle: () => update({ ...filters, maxWeight: filters.maxWeight === 10 ? MAX_WEIGHT : 10 }) }
  ];

  return (
    <div className="mx-auto max-w-site pb-[calc(56px+env(safe-area-inset-bottom))] lg:px-6 lg:pb-0">
      <PageHeader
        title={title}
        subtitle={loading ? 'Loading…' : `${results.length} ${results.length === 1 ? 'item' : 'items'}`}
        fallback="/categories"
        actions={
          <HeaderIconButton label="Search" onClick={() => navigate('/search')}>
            <SearchIcon className="h-5 w-5" />
          </HeaderIconButton>
        }
      />

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3 lg:px-0">
        {/* Desktop keeps sort/filter inline instead of the bottom bar */}
        <button type="button" onClick={() => setSheet('filter')} className={`${chipClass(count > 0)} hidden lg:inline-flex`}>
          <SlidersHorizontalIcon className="h-3.5 w-3.5" /> Filters{count > 0 && ` · ${count}`}
        </button>
        <button type="button" onClick={() => setSheet('sort')} className={`${chipClass(sort !== 'newest')} hidden lg:inline-flex`}>
          <ArrowDownUpIcon className="h-3.5 w-3.5" /> {sorts[sort]}
        </button>
        {/* The purity shortcuts stay in front so customers can switch between them directly */}
        {quick.slice(0, purityShortcuts.length).map((c) => (
          <button key={c.label} type="button" onClick={c.toggle} aria-pressed={c.on} className={chipClass(c.on)}>
            {c.label}
          </button>
        ))}
        {applied.length > 0 ? (
          <>
            {applied.map((a) => (
              <button key={a.label} type="button" onClick={a.remove} className={chipClass(true)} aria-label={`Remove filter ${a.label}`}>
                {a.label} <XIcon className="h-3.5 w-3.5" />
              </button>
            ))}
            <button type="button" onClick={() => update(emptyFilters, '')} className="shrink-0 px-2 text-[13px] font-semibold text-brand">
              Clear all
            </button>
          </>
        ) : (
          quick.slice(purityShortcuts.length).map((c) => (
            <button key={c.label} type="button" onClick={c.toggle} aria-pressed={c.on} className={chipClass(c.on)}>
              {c.label}
            </button>
          ))
        )}
      </div>

      {error ? (
        <div className="px-4">
          <ErrorNotice error={error} />
        </div>
      ) : loading ? (
        <ProductGrid>
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </ProductGrid>
      ) : results.length === 0 ? (
        <EmptyState
          icon={GemIcon}
          title="No designs found"
          text="Try removing a filter or searching for something else."
          action={
            <button type="button" onClick={() => update(emptyFilters, '')} className="pressable h-12 w-full rounded-xl bg-brand text-sm font-semibold text-brand-on">
              Clear filters
            </button>
          }
        />
      ) : (
        <>
          <ProductGrid>
            {results.slice(0, limit).map((p) => (
              <ProductCard key={p.id} product={p} categoryName={categoryName(p.categoryId)} />
            ))}
          </ProductGrid>
          <div className="flex flex-col items-center gap-3 px-4 py-8">
            <p className="text-xs text-ink-3">
              Showing {Math.min(limit, results.length)} of {results.length}
            </p>
            {limit < results.length && (
              <button
                type="button"
                onClick={() => setLimit(limit + PAGE_SIZE)}
                className="pressable h-11 rounded-xl border border-line bg-surface px-8 text-sm font-semibold text-ink"
              >
                Load more
              </button>
            )}
          </div>
        </>
      )}

      {/* Myntra-style split Sort | Filter bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="grid h-14 grid-cols-2 divide-x divide-line">
          <button type="button" onClick={() => setSheet('sort')} className="pressable flex flex-col items-center justify-center leading-tight">
            <span className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-ink">
              <ArrowDownUpIcon className="h-4 w-4" /> Sort
            </span>
            <span className="text-[10.5px] text-ink-3">{sorts[sort]}</span>
          </button>
          <button type="button" onClick={() => setSheet('filter')} className="pressable flex flex-col items-center justify-center leading-tight">
            <span className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-ink">
              <SlidersHorizontalIcon className="h-4 w-4" /> Filter
              {count > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] text-brand-on">{count}</span>}
            </span>
            <span className="text-[10.5px] text-ink-3">{count ? `${count} applied` : 'Refine results'}</span>
          </button>
        </div>
      </div>

      <SortSheet open={sheet === 'sort'} onClose={() => setSheet(null)} value={sort} onChange={(s) => update(filters, q, s)} />
      <FilterSheet open={sheet === 'filter'} onClose={() => setSheet(null)} value={filters} q={q} onApply={(f) => update(f)} />
    </div>
  );
}
