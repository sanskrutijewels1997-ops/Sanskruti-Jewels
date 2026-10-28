import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { BadgeCheckIcon, ClockIcon, MapPinIcon, ShieldCheckIcon, StarIcon } from 'lucide-react';
import { supplierById } from '../data/suppliers';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../contexts/AppContext';

export function SupplierProfile() {
  const { id } = useParams();
  const supplier = supplierById(id ?? '');
  const { setQuoteProduct, notify } = useApp();

  if (!supplier) {
    return (
      <div className="mx-auto max-w-site px-5 py-32 text-center lg:px-10">
        <h1 className="font-display text-4xl text-charcoal">Supplier not found</h1>
        <Link
          to="/suppliers"
          className="mt-8 inline-block rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white hover:bg-gold">
          
          Back to directory
        </Link>
      </div>);

  }

  const catalogue = products.filter((p) => p.supplierId === supplier.id);

  return (
    <div className="bg-ivory">
      <div className="relative h-64 overflow-hidden sm:h-80">
        <img src={supplier.cover} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-charcoal/45" aria-hidden="true" />
      </div>

      <div className="mx-auto -mt-20 max-w-site px-5 lg:px-10">
        <div className="rounded-2xl border border-line bg-white p-7 shadow-panel lg:p-9">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gold-wash font-display text-3xl font-semibold text-gold">
                {supplier.logo}
              </span>
              <div>
                <h1 className="flex items-center gap-2 font-display text-4xl text-charcoal">
                  {supplier.name}
                  {supplier.verified && <BadgeCheckIcon className="h-6 w-6 text-gold" />}
                </h1>
                <p className="mt-2 flex flex-wrap items-center gap-4 text-sm text-charcoal-muted">
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4" />
                    {supplier.city}, {supplier.state}
                  </span>
                  <span className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 fill-gold text-gold" />
                    {supplier.rating} retailer rating
                  </span>
                  <span className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    Responds {supplier.responseTime.toLowerCase()}
                  </span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
              catalogue[0] ?
              setQuoteProduct(catalogue[0]) :
              notify('This supplier has no live designs', 'info')
              }
              className="rounded-full bg-charcoal px-7 py-3.5 text-sm font-medium text-white transition-colors duration-150 ease-luxe hover:bg-gold">
              
              Request Quote
            </button>
          </div>

          <div className="mt-8 grid gap-8 border-t border-line pt-7 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <h2 className="eyebrow text-charcoal-faint">About</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal-muted">
                {supplier.about}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {supplier.categories.map((c) =>
                <li key={c} className="rounded-full bg-ivory px-3 py-1.5 text-xs text-charcoal-soft">
                    {c}
                  </li>
                )}
              </ul>
            </div>
            <dl className="grid grid-cols-2 gap-5">
              {[
              ['Live designs', supplier.designs.toLocaleString('en-IN')],
              ['Operating since', String(supplier.since)],
              ['Verification', supplier.verified ? 'Trade verified' : 'Under review'],
              ['Response time', supplier.responseTime]].
              map(([k, v]) =>
              <div key={k} className="rounded-xl bg-ivory p-4">
                  <dt className="text-xs text-charcoal-faint">{k}</dt>
                  <dd className="mt-1 font-display text-xl text-charcoal">{v}</dd>
                </div>
              )}
            </dl>
          </div>

          {supplier.verified &&
          <p className="mt-7 flex items-center gap-2 rounded-xl bg-gold-wash px-4 py-3 text-sm text-charcoal-soft">
              <ShieldCheckIcon className="h-4 w-4 shrink-0 text-gold" />
              GST, BIS hallmarking licence and three retailer references verified by 25Carat.
            </p>
          }
        </div>
      </div>

      <section className="mx-auto max-w-site px-5 py-14 lg:px-10">
        <h2 className="font-display text-3xl text-charcoal">
          Catalogue <span className="text-charcoal-faint">({catalogue.length} live designs)</span>
        </h2>
        {catalogue.length === 0 ?
        <p className="mt-6 rounded-2xl border border-dashed border-line bg-white p-16 text-center text-sm text-charcoal-muted">
            This supplier has not published designs yet.
          </p> :

        <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
            {catalogue.map((p) =>
          <ProductCard key={p.id} product={p} />
          )}
          </div>
        }
      </section>
    </div>);

}