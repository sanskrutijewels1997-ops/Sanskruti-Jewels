import { api } from '../lib/api';
import { DEMO_ACCOUNTS, resetDemoData } from '../lib/api/demo';

/** Shown on the Profile tab when the app runs without Supabase. */
export function DemoNotice() {
  if (api.mode !== 'demo') return null;
  return (
    <div className="rounded-2xl border border-gold-pale bg-gold-wash p-4 text-xs leading-relaxed text-ink-2">
      <p className="font-semibold text-ink">Demo mode</p>
      <p className="mt-1">Data is stored only in this browser.</p>
      <p className="mt-1">
        Admin: {DEMO_ACCOUNTS.admin.email} / {DEMO_ACCOUNTS.admin.password}
        <br />
        Customer: {DEMO_ACCOUNTS.customer.email} / {DEMO_ACCOUNTS.customer.password}
      </p>
      <button
        type="button"
        className="mt-2 font-semibold text-brand underline underline-offset-2"
        onClick={() => {
          resetDemoData();
          window.location.reload();
        }}
      >
        Reset demo data
      </button>
    </div>
  );
}
