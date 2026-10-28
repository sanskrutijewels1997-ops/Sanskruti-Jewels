import React, { useMemo, useState } from 'react';
import { ProductCard } from '../ProductCard';
import { products } from '../../data/products';

const tabs = [
'Most Viewed',
'Most Saved',
'Trending This Week',
'Bridal Trending',
'Lightweight Trending'] as
const;

type Tab = (typeof tabs)[number];

export function Trending() {
  const [tab, setTab] = useState<Tab>('Most Viewed');

  const list = useMemo(() => {
    const base = [...products];
    switch (tab) {
      case 'Most Viewed':
        return base.sort((a, b) => b.views - a.views).slice(0, 8);
      case 'Most Saved':
        return base.sort((a, b) => b.saves - a.saves).slice(0, 8);
      case 'Trending This Week':
        return base.filter((p) => p.trending).slice(0, 8);
      case 'Bridal Trending':
        return base.filter((p) => p.style === 'Bridal' || p.category === 'Bridal').slice(0, 8);
      case 'Lightweight Trending':
        return base.
        filter((p) => p.style === 'Lightweight' || p.style === 'Minimal').
        slice(0, 8);
      default:
        return base.slice(0, 8);
    }
  }, [tab]);

  return (
    <section className="mx-auto max-w-site px-5 py-20 lg:px-10">
      <p className="eyebrow text-gold">What retailers are sourcing</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-display text-4xl text-charcoal sm:text-5xl">Trending Designs</h2>
        <div
          className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0"
          role="tablist"
          aria-label="Trending filters">
          
          {tabs.map((t) =>
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium tracking-wide transition-colors duration-150 ease-luxe ${
            tab === t ?
            'border-charcoal bg-charcoal text-white' :
            'border-line bg-white text-charcoal-soft hover:border-gold hover:text-charcoal'}`
            }>
            
              {t}
            </button>
          )}
        </div>
      </div>

      {list.length === 0 ?
      <p className="mt-12 rounded-xl border border-dashed border-line bg-white p-12 text-center text-sm text-charcoal-muted">
          No designs in this view yet.
        </p> :

      <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {list.map((p) =>
        <ProductCard key={p.id} product={p} />
        )}
        </div>
      }
    </section>);

}