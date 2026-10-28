import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircleIcon, CheckCircle2Icon, InfoIcon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { TAB_ROOTS } from './BottomTabBar';

/** Snackbar that sits above the tab bar (or the screen's bottom action bar). */
export function Toaster() {
  const { toasts, dismissToast } = useApp();
  const { pathname } = useLocation();
  const raised = TAB_ROOTS.includes(pathname) || pathname === '/catalogue' || pathname.startsWith('/product/');

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 z-[70] flex justify-center px-4 lg:bottom-6 lg:justify-end lg:px-6 ${
        raised ? 'bottom-[calc(76px+env(safe-area-inset-bottom))]' : 'bottom-[calc(16px+env(safe-area-inset-bottom))]'
      }`}
      role="status"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl bg-ink px-4 py-3 text-bg shadow-lift"
            onClick={() => dismissToast(t.id)}
          >
            {t.tone === 'error' ? (
              <AlertCircleIcon className="h-5 w-5 shrink-0 text-danger" />
            ) : t.tone === 'info' ? (
              <InfoIcon className="h-5 w-5 shrink-0 opacity-70" />
            ) : (
              <CheckCircle2Icon className="h-5 w-5 shrink-0 text-gold-pale" />
            )}
            <p className="flex-1 text-sm font-medium leading-snug">{t.message}</p>
            {t.action && (
              <Link to={t.action.to} className="shrink-0 text-sm font-bold uppercase tracking-wide text-gold-pale">
                {t.action.label}
              </Link>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
