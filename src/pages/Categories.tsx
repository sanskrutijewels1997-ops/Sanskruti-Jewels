import { Link, useNavigate } from 'react-router-dom';
import { GemIcon, SearchIcon } from 'lucide-react';
import { HeaderIconButton, PageHeader } from '../components/PageHeader';
import { useCatalogue } from '../lib/queries';

const designs = (n: number) => `${n} ${n === 1 ? 'design' : 'designs'}`;

export function Categories() {
  const { topCategories, subcategoriesOf, published, loading } = useCatalogue();
  const navigate = useNavigate();
  const countIn = (id: string) => published.filter((p) => p.categoryId === id).length;
  // A main category's count includes its sub-categories.
  const categoryCount = (id: string) => countIn(id) + subcategoriesOf(id).reduce((n, s) => n + countIn(s.id), 0);

  return (
    <div className="mx-auto max-w-site lg:px-6">
      <PageHeader
        title="Categories"
        back={false}
        large
        actions={
          <HeaderIconButton label="Search" onClick={() => navigate('/search')}>
            <SearchIcon className="h-5 w-5" />
          </HeaderIconButton>
        }
      />

      <div className="grid grid-cols-3 gap-x-3 gap-y-5 px-4 pb-6 pt-4 sm:grid-cols-4 lg:grid-cols-6 lg:px-0">
        <Link to="/catalogue" className="pressable flex flex-col items-center">
          <span className="flex aspect-square w-full items-center justify-center rounded-2xl bg-brand text-brand-on">
            <GemIcon className="h-8 w-8" />
          </span>
          <span className="mt-2 text-center text-[12.5px] font-semibold text-ink">All Jewellery</span>
          <span className="text-[11px] text-ink-3">{designs(published.length)}</span>
        </Link>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <span key={i} className="skeleton aspect-square rounded-2xl" />)
          : topCategories.map((c) => {
              const types = subcategoriesOf(c.id).length;
              return (
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
                    {types > 0 ? `${types} types · ` : ''}
                    {designs(categoryCount(c.id))}
                  </span>
                </Link>
              );
            })}
      </div>
    </div>
  );
}
