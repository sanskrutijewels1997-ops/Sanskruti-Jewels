import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRightIcon, GemIcon, SearchIcon } from 'lucide-react';
import { HeaderIconButton, PageHeader } from '../components/PageHeader';
import { useCatalogue } from '../lib/queries';

type Tab = 'categories' | 'collections';

export function Categories({ initialTab = 'categories' }: { initialTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const { topCategories, subcategoriesOf, collections, published, loading } = useCatalogue();
  const navigate = useNavigate();
  const countBy = (key: 'categoryId' | 'collectionId', id: string) => published.filter((p) => p[key] === id).length;
  // A main category's count includes its sub-categories.
  const categoryCount = (id: string) =>
    countBy('categoryId', id) + subcategoriesOf(id).reduce((n, s) => n + countBy('categoryId', s.id), 0);

  return (
    <div className="mx-auto max-w-site lg:px-6">
      <PageHeader
        title="Shop"
        back={false}
        large
        actions={
          <HeaderIconButton label="Search" onClick={() => navigate('/search')}>
            <SearchIcon className="h-5 w-5" />
          </HeaderIconButton>
        }
      />

      <div className="sticky top-[calc(56px+env(safe-area-inset-top))] z-20 bg-bg px-4 py-3 lg:static lg:px-0">
        <div role="tablist" className="grid grid-cols-2 rounded-xl bg-surface-2 p-1 lg:max-w-sm">
          {(['categories', 'collections'] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`h-9 rounded-lg text-sm font-semibold capitalize transition-colors ${
                tab === t ? 'bg-surface text-ink shadow-card' : 'text-ink-3'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === 'categories' ? (
        <div className="grid grid-cols-3 gap-x-3 gap-y-5 px-4 pb-6 pt-1 sm:grid-cols-4 lg:grid-cols-6 lg:px-0">
          <Link to="/catalogue" className="pressable flex flex-col items-center">
            <span className="flex aspect-square w-full items-center justify-center rounded-2xl bg-brand text-brand-on">
              <GemIcon className="h-8 w-8" />
            </span>
            <span className="mt-2 text-center text-[12.5px] font-semibold text-ink">All Jewellery</span>
            <span className="text-[11px] text-ink-3">{published.length} {published.length === 1 ? 'design' : 'designs'}</span>
          </Link>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <span key={i} className="skeleton aspect-square rounded-2xl" />)
            : topCategories.map((c) => (
                <Link key={c.id} to={`/catalogue?category=${c.slug}`} className="pressable flex flex-col items-center">
                  <span className="block aspect-square w-full overflow-hidden rounded-2xl bg-surface-2">
                    {c.imageUrl ? (
                      <img src={c.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <GemIcon className="m-auto mt-[35%] h-8 w-8 text-ink-3" />
                    )}
                  </span>
                  <span className="mt-2 line-clamp-1 text-center text-[12.5px] font-semibold text-ink">{c.name}</span>
                  <span className="text-[11px] text-ink-3">
                    {subcategoriesOf(c.id).length > 0 ? `${subcategoriesOf(c.id).length} types · ` : ''}
                    {categoryCount(c.id)} {categoryCount(c.id) === 1 ? 'design' : 'designs'}
                  </span>
                </Link>
              ))}
        </div>
      ) : (
        <ul className="space-y-3 px-4 pb-6 pt-1 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0 lg:px-0">
          {collections.map((c) => (
            <li key={c.id}>
              <Link
                to={`/catalogue?collection=${c.slug}`}
                className="pressable relative flex h-36 items-end overflow-hidden rounded-2xl bg-surface-2 lg:h-56"
              >
                {c.imageUrl && <img src={c.imageUrl} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
                <span className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" aria-hidden="true" />
                <span className="relative flex w-full items-end justify-between gap-3 p-4 text-white">
                  <span>
                    <span className="block font-display text-2xl font-semibold leading-tight">{c.name}</span>
                    {c.tagline && <span className="mt-0.5 line-clamp-1 block text-xs opacity-80">{c.tagline}</span>}
                    <span className="mt-1 block text-[11px] font-semibold text-[#f1d89a]">
                      {countBy('collectionId', c.id)} designs
                    </span>
                  </span>
                  <ChevronRightIcon className="h-5 w-5 shrink-0" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
