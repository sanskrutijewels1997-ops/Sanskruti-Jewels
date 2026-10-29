import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpLeftIcon, ChevronLeftIcon, ClockIcon, SearchIcon, XIcon } from 'lucide-react';
import { useGoBack } from '../components/PageHeader';
import { ProductImageFallback } from '../components/ProductCard';
import { chipClass } from '../components/ui';
import { formatPrice } from '../lib/format';
import { matchesQuery } from '../lib/filters';
import { purityShortcuts } from '../data/options';
import { useCatalogue } from '../lib/queries';

const RECENT_KEY = 'sanskruti-recent-searches';

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

function saveRecent(list: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    // Storage blocked; recent searches just won't persist.
  }
}

/** Full-screen search, opened from the search bar on Home and the search icons. */
export function Search() {
  const [q, setQ] = useState('');
  // Purity scope: '' searches everything, otherwise one of the purity shortcuts.
  const [purity, setPurity] = useState('');
  const [recent, setRecent] = useState(readRecent);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const goBack = useGoBack('/');
  const { published, categories, categoryName } = useCatalogue();

  useEffect(() => inputRef.current?.focus(), []);

  const results = useMemo(() => {
    const term = q.trim();
    if (!term) return [];
    return published.filter((p) => (!purity || p.purity === purity) && matchesQuery(p, term, categoryName(p.categoryId)));
  }, [q, purity, published, categoryName]);

  const submit = (term: string) => {
    const t = term.trim();
    if (!t) return;
    const next = [t, ...recent.filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, 8);
    setRecent(next);
    saveRecent(next);
    const params = new URLSearchParams({ q: t });
    if (purity) params.set('purity', purity);
    navigate(`/catalogue?${params}`);
  };

  return (
    <div className="mx-auto min-h-[100dvh] max-w-3xl bg-surface lg:min-h-0 lg:bg-transparent">
      <header className="pt-safe sticky top-0 z-30 border-b border-line bg-surface lg:static lg:border-0 lg:bg-transparent lg:pt-8">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            submit(q);
          }}
          className="flex h-14 items-center gap-1 px-2"
        >
          <button type="button" onClick={goBack} aria-label="Back" className="pressable flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink">
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-3" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="search"
              enterKeyHint="search"
              placeholder="Search jewellery, SKU, stone…"
              aria-label="Search jewellery"
              className="h-11 w-full rounded-xl bg-surface-2 pl-10 pr-10 text-[15px] text-ink outline-none placeholder:text-ink-3 [&::-webkit-search-cancel-button]:hidden"
            />
            {q && (
              <button type="button" onClick={() => setQ('')} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-3">
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>
        <div role="radiogroup" aria-label="Search in" className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
          {[{ value: '', label: 'All jewellery' }, ...purityShortcuts].map((o) => (
            <button
              key={o.value || 'all'}
              type="button"
              role="radio"
              aria-checked={purity === o.value}
              onClick={() => setPurity(o.value)}
              className={chipClass(purity === o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </header>

      {!q.trim() ? (
        <div className="space-y-7 px-4 py-5">
          {recent.length > 0 && (
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-ink">Recent searches</h2>
                <button
                  type="button"
                  onClick={() => {
                    setRecent([]);
                    saveRecent([]);
                  }}
                  className="text-xs font-semibold text-brand"
                >
                  Clear
                </button>
              </div>
              <ul className="mt-2">
                {recent.map((r) => (
                  <li key={r}>
                    <button type="button" onClick={() => submit(r)} className="pressable flex w-full items-center gap-3 py-2.5 text-left text-[15px] text-ink-2">
                      <ClockIcon className="h-4 w-4 text-ink-3" />
                      <span className="flex-1 truncate">{r}</span>
                      <ArrowUpLeftIcon className="h-4 w-4 text-ink-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section>
            <h2 className="text-sm font-semibold text-ink">Popular categories</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((c) => (
                <Link key={c.id} to={`/catalogue?category=${c.slug}`} className={chipClass(false)}>
                  {c.name}
                </Link>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-ink">Try searching for</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Jhumka', 'Kundan', 'Temple', 'Solitaire', 'Mangalsutra', 'Kada'].map((t) => (
                <button key={t} type="button" onClick={() => submit(t)} className={chipClass(false)}>
                  <SearchIcon className="h-3.5 w-3.5 text-ink-3" /> {t}
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : results.length === 0 ? (
        <p className="px-6 py-16 text-center text-sm text-ink-2">
          No matches for “{q.trim()}”. Try a category, metal or stone.
        </p>
      ) : (
        <div className="pb-6">
          <ul className="divide-y divide-line">
            {results.slice(0, 12).map((p) => (
              <li key={p.id}>
                <Link to={`/product/${p.slug}`} className="pressable flex items-center gap-3 px-4 py-2.5">
                  {p.images[0] ? (
                    <img src={p.images[0].url} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <ProductImageFallback className="h-12 w-12 shrink-0 rounded-lg" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium text-ink">{p.name}</span>
                    <span className="block truncate text-xs text-ink-3">
                      {categoryName(p.categoryId)} · {formatPrice(p) ?? 'Price on request'}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-4 pt-3">
            <button
              type="button"
              onClick={() => submit(q)}
              className="pressable h-11 w-full rounded-xl border border-line text-sm font-semibold text-brand"
            >
              See all {results.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
