import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, PlusIcon, XIcon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function CollectionPickerModal() {
  const {
    collectionPicker,
    setCollectionPicker,
    collections,
    addToCollection,
    createCollection
  } = useApp();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [customer, setCustomer] = useState('');

  const product = collectionPicker;

  const close = () => {
    setCollectionPicker(null);
    setCreating(false);
    setName('');
    setCustomer('');
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
        onClick={close}
        role="dialog"
        aria-modal="true"
        aria-label="Add to customer collection">
        
          <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-panel sm:rounded-2xl">
          
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-gold">Add to collection</p>
                <h2 className="mt-1 font-display text-2xl text-charcoal">{product.name}</h2>
              </div>
              <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="rounded-full p-1.5 text-charcoal-muted hover:bg-ivory hover:text-charcoal">
              
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <ul className="mt-5 max-h-72 space-y-2 overflow-y-auto thin-scrollbar">
              {collections.map((c) => {
              const has = c.productIds.includes(product.id);
              return (
                <li key={c.id}>
                    <button
                    type="button"
                    disabled={has}
                    onClick={() => {
                      addToCollection(c.id, product.id);
                      close();
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-left transition-colors duration-150 ease-luxe hover:border-gold disabled:opacity-60">
                    
                      <span>
                        <span className="block text-sm font-medium text-charcoal">{c.name}</span>
                        <span className="block text-xs text-charcoal-muted">
                          {c.customer} · {c.productIds.length} designs
                        </span>
                      </span>
                      {has ?
                    <CheckIcon className="h-4 w-4 shrink-0 text-gold" /> :

                    <PlusIcon className="h-4 w-4 shrink-0 text-charcoal-faint" />
                    }
                    </button>
                  </li>);

            })}
            </ul>

            {creating ?
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return;
              createCollection(name, customer || 'New customer', 'Shortlist');
              close();
            }}
            className="mt-4 space-y-3 rounded-xl bg-ivory p-4">
            
                <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Collection name"
              aria-label="Collection name"
              className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-gold" />
            
                <input
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Customer name"
              aria-label="Customer name"
              className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-gold" />
            
                <button
              type="submit"
              className="w-full rounded-full bg-charcoal px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 ease-luxe hover:bg-gold">
              
                  Create & add
                </button>
              </form> :

          <button
            type="button"
            onClick={() => setCreating(true)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-line px-4 py-3 text-sm font-medium text-charcoal-soft transition-colors duration-150 ease-luxe hover:border-gold hover:text-charcoal">
            
                <PlusIcon className="h-4 w-4" />
                New customer collection
              </button>
          }
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}