import React, { useMemo, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { SupplierCard } from '../components/home/FeaturedSuppliers';
import { suppliers } from '../data/suppliers';

const cities = ['All cities', ...Array.from(new Set(suppliers.map((s) => s.city)))];
const cats = ['All categories', ...Array.from(new Set(suppliers.flatMap((s) => s.categories)))];

export function Suppliers() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('All cities');
  const [cat, setCat] = useState('All categories');

  const list = useMemo(
    () =>
    suppliers.filter((s) => {
      if (city !== 'All cities' && s.city !== city) return false;
      if (cat !== 'All categories' && !s.categories.includes(cat)) return false;
      if (query && !`${s.name} ${s.city} ${s.categories.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
      return false;
      return true;
    }),
    [query, city, cat]
  );

  return (
    <div className="bg-ivory">
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-site px-5 py-12 lg:px-10 lg:py-16">
          <p className="eyebrow text-gold">340 verified manufacturers</p>
          <h1 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl lg:text-6xl">
            Supplier Directory
          </h1>
          <p className="mt-4 max-w-2xl text-charcoal-muted">
            Every supplier on 25Carat is trade-verified with documented hallmarking, GST
            registration and retailer references.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search supplier name, city or jewellery type…"
                aria-label="Search suppliers"
                className="h-12 w-full rounded-full border border-line bg-ivory pl-12 pr-4 text-sm outline-none focus:border-gold" />
              
            </div>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              aria-label="Filter by city"
              className="h-12 rounded-full border border-line bg-white px-5 text-sm text-charcoal outline-none focus:border-gold">
              
              {cities.map((c) =>
              <option key={c}>{c}</option>
              )}
            </select>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              aria-label="Filter by category"
              className="h-12 rounded-full border border-line bg-white px-5 text-sm text-charcoal outline-none focus:border-gold">
              
              {cats.map((c) =>
              <option key={c}>{c}</option>
              )}
            </select>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-site px-5 py-10 lg:px-10">
        <p className="text-sm text-charcoal-soft">
          <strong className="font-medium text-charcoal">{list.length}</strong> suppliers match
        </p>
        {list.length === 0 ?
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-white px-8 py-20 text-center">
            <h2 className="font-display text-3xl text-charcoal">No suppliers found</h2>
            <p className="mt-3 text-sm text-charcoal-muted">
              Try a different city or clear the category filter.
            </p>
          </div> :

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((s) =>
          <SupplierCard key={s.id} supplier={s} />
          )}
          </div>
        }
      </div>
    </div>);

}