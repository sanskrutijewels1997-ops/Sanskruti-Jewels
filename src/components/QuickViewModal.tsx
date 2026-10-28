import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheckIcon, HeartIcon, XIcon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { supplierById } from '../data/suppliers';

export function QuickViewModal() {
  const { quickView, setQuickView, isSaved, toggleSave, setQuoteProduct } = useApp();
  const [active, setActive] = useState(0);
  const product = quickView;
  const supplier = product ? supplierById(product.supplierId) : undefined;

  return (
    <AnimatePresence>
      {product &&
      <motion.div
        className="fixed inset-0 z-[60] flex items-end justify-center bg-charcoal/45 p-0 backdrop-blur-sm sm:items-center sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        onClick={() => setQuickView(null)}
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${product.name}`}>
        
          <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-2xl bg-white shadow-panel sm:rounded-2xl">
          
            <button
            type="button"
            onClick={() => setQuickView(null)}
            aria-label="Close quick view"
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-card transition-colors duration-150 ease-luxe hover:bg-ivory">
            
              <XIcon className="h-4 w-4" />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="bg-ivory-deep p-5">
                <div className="overflow-hidden rounded-xl bg-white">
                  <img
                  src={product.images[active]}
                  alt={product.name}
                  className="aspect-square w-full object-cover" />
                
                </div>
                <div className="mt-3 flex gap-2">
                  {product.images.map((img, i) =>
                <button
                  key={img + i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border transition-colors duration-150 ease-luxe ${
                  active === i ? 'border-gold' : 'border-line hover:border-gold-light'}`
                  }
                  aria-label={`View image ${i + 1}`}>
                  
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                )}
                </div>
              </div>

              <div className="flex flex-col p-6 sm:p-8">
                <p className="text-xs tracking-wide text-charcoal-faint">{product.id}</p>
                <h2 className="mt-1 font-display text-3xl leading-tight text-charcoal">
                  {product.name}
                </h2>
                {supplier &&
              <p className="mt-2 flex items-center gap-1.5 text-sm text-charcoal-muted">
                    {supplier.verified && <BadgeCheckIcon className="h-4 w-4 text-gold" />}
                    {supplier.name} · {supplier.city}
                  </p>
              }

                <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-line py-5 text-sm">
                  {[
                ['Category', product.category],
                ['Metal', product.metal],
                ['Purity', product.purity],
                ['Approx. Weight', `${product.weightMin}–${product.weightMax} g`],
                ['Availability', product.availability],
                ['MOQ', `${product.moq} pc`]].
                map(([k, v]) =>
                <div key={k}>
                      <dt className="text-xs text-charcoal-faint">{k}</dt>
                      <dd className="mt-0.5 text-charcoal">{v}</dd>
                    </div>
                )}
                </dl>

                <div className="mt-5 rounded-xl bg-gold-wash p-4">
                  <p className="eyebrow text-gold">B2B Pricing</p>
                  <p className="mt-1.5 text-sm text-charcoal-soft">
                    Login or request a quotation to view supplier pricing.
                  </p>
                </div>

                <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row">
                  <button
                  type="button"
                  onClick={() => {
                    setQuoteProduct(product);
                    setQuickView(null);
                  }}
                  className="flex-1 rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-white transition-colors duration-150 ease-luxe hover:bg-gold">
                  
                    Request B2B Quote
                  </button>
                  <button
                  type="button"
                  onClick={() => toggleSave(product.id)}
                  className="flex items-center justify-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium text-charcoal transition-colors duration-150 ease-luxe hover:border-gold">
                  
                    <HeartIcon
                    className={`h-4 w-4 ${isSaved(product.id) ? 'fill-gold text-gold' : ''}`} />
                  
                    Save
                  </button>
                </div>
                <Link
                to={`/product/${product.id}`}
                onClick={() => setQuickView(null)}
                className="mt-3 text-center text-xs font-medium tracking-wide text-charcoal-muted underline-offset-4 hover:text-gold hover:underline">
                
                  View full product details
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}