import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircleIcon, CheckIcon, InfoIcon, XIcon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function Toaster() {
  const { toasts, dismissToast } = useApp();

  return (
    <div
      className="pointer-events-none fixed bottom-6 right-6 z-[70] flex w-[min(360px,calc(100vw-3rem))] flex-col gap-2"
      role="status"
      aria-live="polite">
      
      <AnimatePresence initial={false}>
        {toasts.map((t) =>
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="pointer-events-auto flex items-start gap-3 rounded-xl border border-line bg-white p-4 shadow-panel">
          
            <span
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
            t.tone === 'error' ?
            'bg-red-100 text-red-700' :
            t.tone === 'info' ?
            'bg-ivory-dark text-charcoal-soft' :
            'bg-gold-wash text-gold'}`
            }>
            
              {t.tone === 'error' ?
            <AlertCircleIcon className="h-3.5 w-3.5" /> :
            t.tone === 'info' ?
            <InfoIcon className="h-3.5 w-3.5" /> :

            <CheckIcon className="h-3.5 w-3.5" />
            }
            </span>
            <p className="flex-1 text-sm leading-snug text-charcoal">{t.message}</p>
            <button
            type="button"
            onClick={() => dismissToast(t.id)}
            className="text-charcoal-faint transition-colors duration-150 ease-luxe hover:text-charcoal"
            aria-label="Dismiss notification">
            
              <XIcon className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>);

}