import React from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheckIcon, MapPinIcon, StarIcon } from 'lucide-react';
import { suppliers } from '../../data/suppliers';
import type { Supplier } from '../../types';

export function SupplierCard({ supplier }: {supplier: Supplier;}) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-line bg-white p-6 transition-shadow duration-200 ease-luxe hover:shadow-lift">
      <div className="flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold-wash font-display text-xl font-semibold text-gold">
          {supplier.logo}
        </span>
        <div className="min-w-0">
          <h3 className="flex items-center gap-1.5 font-display text-xl leading-tight text-charcoal">
            <span className="truncate">{supplier.name}</span>
            {supplier.verified &&
            <BadgeCheckIcon className="h-4 w-4 shrink-0 text-gold" aria-label="Verified" />
            }
          </h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-charcoal-muted">
            <MapPinIcon className="h-3.5 w-3.5" />
            {supplier.city}, {supplier.state}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-5 border-y border-line py-4 text-sm">
        <div>
          <p className="font-medium text-charcoal">{supplier.designs.toLocaleString('en-IN')}</p>
          <p className="text-xs text-charcoal-faint">Designs</p>
        </div>
        <div>
          <p className="flex items-center gap-1 font-medium text-charcoal">
            <StarIcon className="h-3.5 w-3.5 fill-gold text-gold" />
            {supplier.rating}
          </p>
          <p className="text-xs text-charcoal-faint">Rating</p>
        </div>
        <div>
          <p className="font-medium text-charcoal">Since {supplier.since}</p>
          <p className="text-xs text-charcoal-faint">On record</p>
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {supplier.categories.map((c) =>
        <li
          key={c}
          className="rounded-full bg-ivory px-2.5 py-1 text-[11px] text-charcoal-soft">
          
            {c}
          </li>
        )}
      </ul>

      <div className="mt-auto pt-6">
        <Link
          to={`/supplier/${supplier.id}`}
          className="block w-full rounded-full border border-charcoal px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-charcoal transition-colors duration-150 ease-luxe hover:bg-charcoal hover:text-white">
          
          View Catalogue
        </Link>
      </div>
    </article>);

}

export function FeaturedSuppliers() {
  return (
    <section className="mx-auto max-w-site px-5 py-20 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold">Verified manufacturing partners</p>
          <h2 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl">
            Featured Verified Suppliers
          </h2>
        </div>
        <Link
          to="/suppliers"
          className="text-sm font-medium text-charcoal underline-offset-4 hover:text-gold hover:underline">
          
          Browse all 340 suppliers
        </Link>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {suppliers.slice(0, 4).map((s) =>
        <SupplierCard key={s.id} supplier={s} />
        )}
      </div>
    </section>);

}