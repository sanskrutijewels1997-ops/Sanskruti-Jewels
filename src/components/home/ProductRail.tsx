import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from '../ProductCard';
import { useCatalogue } from '../../lib/queries';
import type { Product } from '../../types';

/** Horizontally scrolling row of product cards with a "view all" tile at the end. */
export function ProductRail({
  eyebrow,
  title,
  text,
  products,
  viewAllTo,
  viewAllLabel,
  tone = 'surface'
}: {
  eyebrow: React.ReactNode;
  title: string;
  text?: string;
  products: Product[];
  viewAllTo: string;
  viewAllLabel: string;
  tone?: 'surface' | 'page';
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { loading, categoryName } = useCatalogue();
  const scrollBy = (dir: number) => trackRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' });

  if (!loading && products.length === 0) return null;

  return (
    <section className={`border-y border-line py-16 lg:py-20 ${tone === 'surface' ? 'bg-white' : 'bg-ivory'}`}>
      <div className="mx-auto max-w-site px-5 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow flex items-center gap-2 text-gold">{eyebrow}</p>
            <h2 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl">{title}</h2>
            {text && <p className="mt-3 text-charcoal-muted">{text}</p>}
          </div>
          <div className="hidden gap-2 md:flex">
            {[-1, 1].map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => scrollBy(dir)}
                aria-label={dir < 0 ? 'Scroll left' : 'Scroll right'}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-charcoal transition-colors duration-150 ease-luxe hover:border-gold hover:text-gold"
              >
                {dir < 0 ? <ChevronLeftIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={trackRef}
          className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:gap-5 lg:mx-0 lg:px-0"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[220px] shrink-0 sm:w-[280px]">
                  <ProductCardSkeleton />
                </div>
              ))
            : products.map((p) => (
                <div key={p.id} className="w-[220px] shrink-0 snap-start sm:w-[280px]">
                  <ProductCard product={p} categoryName={categoryName(p.categoryId)} />
                </div>
              ))}
          <Link
            to={viewAllTo}
            className="flex w-[220px] shrink-0 snap-start items-center justify-center rounded-xl border border-dashed border-line text-sm font-medium text-charcoal-soft transition-colors duration-150 ease-luxe hover:border-gold hover:text-gold sm:w-[280px]"
          >
            {viewAllLabel} →
          </Link>
        </div>
      </div>
    </section>
  );
}
