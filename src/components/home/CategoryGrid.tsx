import { Link } from 'react-router-dom';
import { useCatalogue } from '../../lib/queries';
import { ProductImageFallback } from '../ProductCard';

export function CategoryGrid() {
  const { categories, published, loading } = useCatalogue();
  const counts = new Map<string, number>();
  published.forEach((p) => p.categoryId && counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1));

  return (
    <section className="mx-auto max-w-site px-5 py-16 lg:px-10 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold">Shop by category</p>
          <h2 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl">Find your next favourite</h2>
        </div>
        <Link to="/catalogue" className="text-sm font-medium text-charcoal underline-offset-4 hover:text-gold hover:underline">
          View all {published.length} designs
        </Link>
      </div>

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="skeleton aspect-[4/5] rounded-xl" />
          ))}
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link
              to={`/catalogue?category=${encodeURIComponent(cat.slug)}`}
              className="group block overflow-hidden rounded-xl border border-line bg-white transition-shadow duration-200 ease-luxe hover:shadow-lift"
            >
              <div className="aspect-[4/5] overflow-hidden bg-ivory-deep">
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[400ms] ease-luxe group-hover:scale-105"
                  />
                ) : (
                  <ProductImageFallback className="h-full w-full" />
                )}
              </div>
              <div className="px-4 py-3.5">
                <p className="font-display text-lg leading-tight text-charcoal">{cat.name}</p>
                <p className="mt-0.5 text-xs text-charcoal-faint">{counts.get(cat.id) ?? 0} designs</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
