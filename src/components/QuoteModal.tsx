import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, XIcon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { supplierById } from '../data/suppliers';

export function QuoteModal() {
  const { quoteProduct, setQuoteProduct, addQuote, notify } = useApp();
  const [quantity, setQuantity] = useState('1');
  const [size, setSize] = useState('');
  const [customisation, setCustomisation] = useState('No');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [sentId, setSentId] = useState<string | null>(null);

  const product = quoteProduct;
  const supplier = product ? supplierById(product.supplierId) : undefined;

  useEffect(() => {
    if (product) {
      setQuantity(String(product.moq));
      setSize(product.size);
      setCustomisation('No');
      setDate('');
      setNotes('');
      setError('');
      setSentId(null);
    }
  }, [product]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!date) {
      setError('Please select a required delivery date.');
      return;
    }
    setError('');
    const id = addQuote({
      productId: product.id,
      supplierId: product.supplierId,
      quantity: Number(quantity) || 1,
      size,
      deliveryDate: date,
      notes: customisation === 'Yes' ? `Customisation required. ${notes}` : notes
    });
    setSentId(id);
    notify('Quote request sent to supplier');
  };

  return (
    <AnimatePresence>
      {product &&
      <motion.div
        className="fixed inset-0 z-[60] flex items-end justify-center bg-charcoal/45 backdrop-blur-sm sm:items-center sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        onClick={() => setQuoteProduct(null)}
        role="dialog"
        aria-modal="true"
        aria-label="Request a B2B quote">
        
          <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-panel sm:rounded-2xl">
          
            <button
            type="button"
            onClick={() => setQuoteProduct(null)}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-charcoal-muted transition-colors duration-150 ease-luxe hover:bg-ivory hover:text-charcoal">
            
              <XIcon className="h-4 w-4" />
            </button>

            {sentId ?
          <div className="p-10 text-center">
                <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-wash">
              
                  <CheckIcon className="h-7 w-7 text-gold" />
                </motion.div>
                <h2 className="mt-6 font-display text-3xl text-charcoal">
                  Quote request sent
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">
                  Your quote request has been sent to the supplier. {supplier?.name} typically
                  responds in {supplier?.responseTime.toLowerCase()}.
                </p>
                <p className="mt-4 inline-block rounded-full bg-ivory px-4 py-2 text-xs tracking-wide text-charcoal-soft">
                  Reference {sentId}
                </p>
                <div className="mt-8 flex flex-col gap-2 sm:flex-row">
                  <Link
                to="/dashboard?tab=quotes"
                onClick={() => setQuoteProduct(null)}
                className="flex-1 rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-white transition-colors duration-150 ease-luxe hover:bg-gold">
                
                    Track this quote
                  </Link>
                  <button
                type="button"
                onClick={() => setQuoteProduct(null)}
                className="flex-1 rounded-full border border-line px-5 py-3 text-sm font-medium text-charcoal transition-colors duration-150 ease-luxe hover:border-gold">
                
                    Keep browsing
                  </button>
                </div>
              </div> :

          <form onSubmit={submit} className="p-6 sm:p-8">
                <p className="eyebrow text-gold">Request B2B Quote</p>
                <div className="mt-5 flex gap-4 rounded-xl bg-ivory p-4">
                  <img
                src={product.images[0]}
                alt={product.name}
                className="h-20 w-20 rounded-lg object-cover" />
              
                  <div className="min-w-0">
                    <p className="text-[11px] text-charcoal-faint">{product.id}</p>
                    <h2 className="font-display text-xl leading-snug text-charcoal">
                      {product.name}
                    </h2>
                    <p className="mt-1 text-xs text-charcoal-muted">
                      {supplier?.name} · {product.purity} · {product.weightMin}–
                      {product.weightMax} g
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field label="Quantity">
                    <input
                  type="number"
                  min={product.moq}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={inputCls} />
                
                  </Field>
                  <Field label="Size / Length">
                    <input
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className={inputCls} />
                
                  </Field>
                  <Field label="Customisation required?">
                    <select
                  value={customisation}
                  onChange={(e) => setCustomisation(e.target.value)}
                  className={inputCls}>
                  
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </Field>
                  <Field label="Required delivery date">
                    <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputCls} />
                
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Additional notes">
                      <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Finish, stone quality, packaging or delivery instructions…"
                    className={`${inputCls} resize-none`} />
                  
                    </Field>
                  </div>
                </div>

                {error &&
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
                    {error}
                  </p>
            }

                <button
              type="submit"
              className="mt-6 w-full rounded-full bg-charcoal px-5 py-3.5 text-sm font-medium text-white transition-colors duration-150 ease-luxe hover:bg-gold">
              
                  Send Quote Request
                </button>
                <p className="mt-3 text-center text-xs text-charcoal-faint">
                  Pricing is shared privately by the supplier. Never displayed publicly.
                </p>
              </form>
          }
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}

const inputCls =
'h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-charcoal outline-none transition-colors duration-150 ease-luxe focus:border-gold';

function Field({ label, children }: {label: string;children: React.ReactNode;}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-charcoal-muted">{label}</span>
      {children}
    </label>);

}