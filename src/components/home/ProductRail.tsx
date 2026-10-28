import { Link } from 'react-router-dom';
import { ChevronRightIcon } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from '../ProductCard';
import { SectionHeader } from '../ui';
import { useCatalogue } from '../../lib/queries';
import type { Product } from '../../types';

/** Swipeable row of product cards with a "See all" link. */
export function ProductRail({
  title,
  subtitle,
  products,
  viewAllTo
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllTo: string;
}) {
  const { loading, categoryName } = useCatalogue();
  if (!loading && products.length === 0) return null;

  return (
    <section className="py-6 lg:py-10">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        action={
          <Link to={viewAllTo} className="flex shrink-0 items-center text-[13px] font-semibold text-brand">
            See all <ChevronRightIcon className="h-4 w-4" />
          </Link>
        }
      />
      <div className="no-scrollbar mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 lg:gap-5 lg:px-0">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[42vw] max-w-[220px] shrink-0">
                <ProductCardSkeleton />
              </div>
            ))
          : products.map((p) => (
              <div key={p.id} className="w-[42vw] max-w-[220px] shrink-0 snap-start">
                <ProductCard product={p} categoryName={categoryName(p.categoryId)} />
              </div>
            ))}
      </div>
    </section>
  );
}
