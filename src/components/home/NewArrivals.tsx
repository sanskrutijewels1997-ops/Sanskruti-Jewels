import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from 'lucide-react';
import { ProductCard } from '../ProductCard';
import { newArrivals } from '../../data/products';

export function NewArrivals() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  return (
    <section className="border-y border-line bg-white py-20">
      <div className="mx-auto max-w-site px-5 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow flex items-center gap-2 text-gold">
              <SparklesIcon className="h-3.5 w-3.5" />
              Uploaded in the last 24 hours
            </p>
            <h2 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl">
              Today's New Arrivals
            </h2>
            <p className="mt-3 text-charcoal-muted">Fresh jewellery designs added today.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-gold-wash px-4 py-2 text-sm font-medium text-gold">
              127 New Designs Added Today
            </span>
            <div className="hidden gap-2 md:flex">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Scroll left"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-charcoal transition-colors duration-150 ease-luxe hover:border-gold hover:text-gold">
                
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Scroll right"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-charcoal transition-colors duration-150 ease-luxe hover:border-gold hover:text-gold">
                
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={trackRef}
          className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 lg:mx-0 lg:px-0">
          
          {newArrivals.map((p) =>
          <div key={p.id} className="w-[260px] shrink-0 snap-start sm:w-[300px]">
              <ProductCard product={p} />
            </div>
          )}
          <Link
            to="/catalogue?filter=new"
            className="flex w-[260px] shrink-0 snap-start items-center justify-center rounded-xl border border-dashed border-line text-sm font-medium text-charcoal-soft transition-colors duration-150 ease-luxe hover:border-gold hover:text-gold sm:w-[300px]">
            
            View all new arrivals →
          </Link>
        </div>
      </div>
    </section>);

}