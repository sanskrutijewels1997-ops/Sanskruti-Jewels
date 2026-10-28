import { useState } from 'react';
import { XIcon } from 'lucide-react';
import { api } from '../lib/api';
import { DEMO_ACCOUNTS, resetDemoData } from '../lib/api/demo';

/** Shown only when the app runs without Supabase, so nobody mistakes it for live data. */
export function DemoBanner() {
  const [hidden, setHidden] = useState(() => {
    try {
      return sessionStorage.getItem('demo-banner') === 'hidden';
    } catch {
      return false;
    }
  });
  if (api.mode !== 'demo' || hidden) return null;
  return (
    <div className="relative border-b border-gold-pale bg-gold-wash px-10 py-2 text-center text-xs leading-relaxed text-gold-light">
      <strong className="font-semibold">Demo mode</strong> — data is stored only in this browser.
      Admin: {DEMO_ACCOUNTS.admin.email} / {DEMO_ACCOUNTS.admin.password} · Customer:{' '}
      {DEMO_ACCOUNTS.customer.email} / {DEMO_ACCOUNTS.customer.password} ·{' '}
      <button
        type="button"
        className="underline underline-offset-2 hover:text-charcoal"
        onClick={() => {
          resetDemoData();
          window.location.reload();
        }}
      >
        Reset demo data
      </button>
      <button
        type="button"
        aria-label="Hide demo banner"
        onClick={() => {
          try {
            sessionStorage.setItem('demo-banner', 'hidden');
          } catch {
            // Storage blocked: hide for this page view only.
          }
          setHidden(true);
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gold-pale"
      >
        <XIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
