import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  BadgeCheckIcon,
  ClockIcon,
  FolderPlusIcon,
  HeartIcon,
  MapPinIcon,
  ShieldCheckIcon,
  StarIcon } from
'lucide-react';
import { useApp } from '../contexts/AppContext';
import { productById, products } from '../data/products';
import { supplierById } from '../data/suppliers';
import { ProductCard } from '../components/ProductCard';

export function ProductDetail() {
  const { id } = useParams();
  const product = productById(id ?? '');
  const {
    isSaved,
    toggleSave,
    setQuoteProduct,
    setCollectionPicker,
    markViewed,
    recentlyViewed
  } = useApp();

  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState({ x: 50, y: 50, on: false });
  const [qty, setQty] = useState('1');
  const [size, setSize] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (product) {
      setActive(0);
      setSize(product.size);
      setQty(String(product.moq));
      markViewed(product.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!product) {
    return (
      <div className="mx-auto max-w-site px-5 py-32 text-center lg:px-10">
        <h1 className="font-display text-4xl text-charcoal">Design not found</h1>
        <p className="mt-3 text-charcoal-muted">
          This product ID is no longer live in the catalogue.
        </p>
        <Link
          to="/catalogue"
          className="mt-8 inline-block rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white hover:bg-gold">
          
          Back to catalogue
        </Link>
      </div>);

  }

  const supplier = supplierById(product.supplierId);
  const similar = products.
  filter((p) => p.id !== product.id && (p.category === product.category || p.style === product.style)).
  slice(0, 4);
  const recent = recentlyViewed.
  filter((r) => r !== product.id).
  map((r) => productById(r)).
  filter(Boolean).
  slice(0, 4);

  const viewLabels = ['Front view', 'Side view', 'Close-up detail', 'Lifestyle'];

  return (
    <div className="bg-ivory">
      <nav className="mx-auto max-w-site px-5 pt-6 text-xs text-charcoal-faint lg:px-10" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-charcoal">Home</Link>
        <span className="px-2">/</span>
        <Link to="/catalogue" className="hover:text-charcoal">Catalogue</Link>
        <span className="px-2">/</span>
        <span className="text-charcoal-soft">{product.category}</span>
      </nav>

      <div className="mx-auto grid max-w-site gap-10 px-5 py-8 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:py-12">
        <div>
          <div
            className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-white"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({
                x: (e.clientX - r.left) / r.width * 100,
                y: (e.clientY - r.top) / r.height * 100,
                on: true
              });
            }}
            onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}>
            
            <img
              src={product.images[active]}
              alt={`${product.name} — ${viewLabels[active] ?? 'view'}`}
              style={{
                transformOrigin: `${zoom.x}% ${zoom.y}%`,
                transform: zoom.on ? 'scale(1.9)' : 'scale(1)'
              }}
              className="h-full w-full object-cover transition-transform duration-300 ease-luxe" />
            
            <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] text-charcoal-soft">
              Hover to zoom
            </span>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.images.map((img, i) =>
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={viewLabels[i] ?? `View ${i + 1}`}
              aria-pressed={active === i}
              className={`overflow-hidden rounded-xl border bg-white transition-colors duration-150 ease-luxe ${
              active === i ? 'border-gold' : 'border-line hover:border-gold-light'}`
              }>
              
                <img src={img} alt="" className="aspect-square w-full object-cover" />
              </button>
            )}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            {supplier?.verified &&
            <span className="eyebrow flex items-center gap-1 rounded-full bg-gold-wash px-3 py-1.5 text-[10px] text-gold">
                <BadgeCheckIcon className="h-3.5 w-3.5" /> Verified Supplier
              </span>
            }
            {product.isNew &&
            <span className="eyebrow rounded-full bg-charcoal px-3 py-1.5 text-[10px] text-white">
                New Arrival
              </span>
            }
            <span className="eyebrow rounded-full border border-line bg-white px-3 py-1.5 text-[10px] text-charcoal-soft">
              {product.availability}
            </span>
          </div>

          <p className="mt-5 text-xs tracking-wide text-charcoal-faint">
            Product ID · {product.id}
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-charcoal sm:text-5xl">
            {product.name}
          </h1>

          <dl className="mt-7 grid grid-cols-2 gap-x-8 gap-y-5 border-y border-line py-6 text-sm sm:grid-cols-3">
            {[
            ['Category', product.category],
            ['Metal', product.metal],
            ['Purity', product.purity],
            ['Approx. Weight', `${product.weightMin}–${product.weightMax} g`],
            ['Size / Length', product.size],
            ['MOQ', `${product.moq} piece${product.moq > 1 ? 's' : ''}`]].
            map(([k, v]) =>
            <div key={k}>
                <dt className="text-xs text-charcoal-faint">{k}</dt>
                <dd className="mt-1 text-charcoal">{v}</dd>
              </div>
            )}
            <div className="col-span-2 sm:col-span-3">
              <dt className="text-xs text-charcoal-faint">Stone Details</dt>
              <dd className="mt-1 text-charcoal">{product.stone}</dd>
            </div>
          </dl>

          <div className="mt-7 rounded-2xl border border-gold-pale bg-gold-wash p-6">
            <h2 className="font-display text-2xl text-charcoal">B2B Pricing</h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">
              Login or request a quotation to view supplier pricing. Rates are shared privately
              and never displayed publicly on 25Carat.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setQuoteProduct(product)}
              className="flex-1 rounded-full bg-charcoal px-6 py-4 text-sm font-medium text-white transition-colors duration-150 ease-luxe hover:bg-gold">
              
              Request B2B Quote
            </button>
            <button
              type="button"
              onClick={() => toggleSave(product.id)}
              className="flex items-center justify-center gap-2 rounded-full border border-line bg-white px-6 py-4 text-sm font-medium text-charcoal transition-colors duration-150 ease-luxe hover:border-gold">
              
              <HeartIcon className={`h-4 w-4 ${isSaved(product.id) ? 'fill-gold text-gold' : ''}`} />
              Save Design
            </button>
            <button
              type="button"
              onClick={() => setCollectionPicker(product)}
              className="flex items-center justify-center gap-2 rounded-full border border-line bg-white px-6 py-4 text-sm font-medium text-charcoal transition-colors duration-150 ease-luxe hover:border-gold">
              
              <FolderPlusIcon className="h-4 w-4" />
              Add to Collection
            </button>
          </div>

          <section className="mt-8 rounded-2xl border border-line bg-white p-6">
            <h2 className="font-display text-2xl text-charcoal">Customisation</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-charcoal-muted">Size</span>
                <input
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="h-11 w-full rounded-lg border border-line px-3 text-sm outline-none focus:border-gold" />
                
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-charcoal-muted">Quantity</span>
                <input
                  type="number"
                  min={product.moq}
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="h-11 w-full rounded-lg border border-line px-3 text-sm outline-none focus:border-gold" />
                
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-charcoal-muted">
                  Required delivery date
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-11 w-full rounded-lg border border-line px-3 text-sm outline-none focus:border-gold" />
                
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-medium text-charcoal-muted">
                  Custom notes
                </span>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Finish, stone grade, plating or packaging preferences…"
                  className="w-full resize-none rounded-lg border border-line p-3 text-sm outline-none focus:border-gold" />
                
              </label>
            </div>
          </section>
        </div>
      </div>

      <div className="mx-auto max-w-site px-5 pb-6 lg:px-10">
        <div className="grid gap-8 rounded-2xl border border-line bg-white p-7 lg:grid-cols-3 lg:p-10">
          <section>
            <h2 className="font-display text-2xl text-charcoal">Product Description</h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal-muted">
              {product.description}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-charcoal-muted">
              Weight and finish may vary marginally between production batches. Final gross weight
              is confirmed on the supplier quotation.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-charcoal">Specifications</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[
              ['Collection', product.collection],
              ['Style', product.style],
              ['Metal & purity', `${product.metal} · ${product.purity}`],
              ['Gross weight range', `${product.weightMin}–${product.weightMax} g`],
              ['Stones', product.stone],
              ['Hallmarking', 'BIS hallmarked on dispatch']].
              map(([k, v]) =>
              <div key={k} className="flex justify-between gap-6 border-b border-line pb-2.5">
                  <dt className="text-charcoal-faint">{k}</dt>
                  <dd className="text-right text-charcoal">{v}</dd>
                </div>
              )}
            </dl>
          </section>

          {supplier &&
          <section>
              <h2 className="font-display text-2xl text-charcoal">Supplier Information</h2>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-wash font-display text-lg font-semibold text-gold">
                  {supplier.logo}
                </span>
                <div>
                  <p className="flex items-center gap-1.5 font-medium text-charcoal">
                    {supplier.name}
                    {supplier.verified && <BadgeCheckIcon className="h-4 w-4 text-gold" />}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-charcoal-muted">
                    <MapPinIcon className="h-3 w-3" />
                    {supplier.city}, {supplier.state}
                  </p>
                </div>
              </div>
              <ul className="mt-5 space-y-2.5 text-sm text-charcoal-muted">
                <li className="flex items-center gap-2">
                  <StarIcon className="h-4 w-4 fill-gold text-gold" /> {supplier.rating} retailer rating
                </li>
                <li className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-gold" /> Responds {supplier.responseTime.toLowerCase()}
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-4 w-4 text-gold" /> Verified since {supplier.since}
                </li>
              </ul>
              <Link
              to={`/supplier/${supplier.id}`}
              className="mt-6 inline-block rounded-full border border-charcoal px-5 py-2.5 text-xs font-semibold text-charcoal transition-colors duration-150 ease-luxe hover:bg-charcoal hover:text-white">
              
                View supplier catalogue
              </Link>
            </section>
          }
        </div>
      </div>

      <section className="mx-auto max-w-site px-5 py-12 lg:px-10">
        <h2 className="font-display text-3xl text-charcoal">Similar Designs</h2>
        <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {similar.map((p) =>
          <ProductCard key={p.id} product={p} />
          )}
        </div>
      </section>

      {recent.length > 0 &&
      <section className="mx-auto max-w-site px-5 pb-20 lg:px-10">
          <h2 className="font-display text-3xl text-charcoal">Recently Viewed</h2>
          <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {recent.map((p) => p && <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      }

      <div className="sticky bottom-0 z-30 border-t border-line bg-white/95 px-5 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => toggleSave(product.id)}
            aria-label="Save design"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line">
            
            <HeartIcon className={`h-5 w-5 ${isSaved(product.id) ? 'fill-gold text-gold' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setQuoteProduct(product)}
            className="flex-1 rounded-full bg-charcoal px-5 py-3.5 text-sm font-medium text-white">
            
            Request B2B Quote
          </button>
        </div>
      </div>
    </div>);

}