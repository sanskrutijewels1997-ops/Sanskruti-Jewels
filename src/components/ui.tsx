import React from 'react';
import { Loader2Icon } from 'lucide-react';

export const inputClass =
  'h-11 w-full rounded-lg border border-line bg-ivory px-3 text-sm text-charcoal placeholder:text-charcoal-faint outline-none transition-colors duration-150 ease-luxe focus:border-gold disabled:opacity-60';

export const primaryButton =
  'inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white transition-colors duration-150 ease-luxe hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60';

export const secondaryButton =
  'inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-6 py-3 text-sm font-medium text-charcoal transition-colors duration-150 ease-luxe hover:border-gold disabled:cursor-not-allowed disabled:opacity-60';

export function Field({
  label,
  hint,
  children,
  className = ''
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium text-charcoal-muted">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-charcoal-faint">{hint}</span>}
    </label>
  );
}

export function Spinner({ className = 'h-4 w-4' }: { className?: string }) {
  return <Loader2Icon className={`animate-spin ${className}`} aria-hidden="true" />;
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-gold" role="status">
      <Spinner className="h-7 w-7" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function EmptyState({
  title,
  text,
  action
}: {
  title: string;
  text?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white px-8 py-16 text-center">
      <h2 className="font-display text-3xl text-charcoal">{title}</h2>
      {text && <p className="mx-auto mt-3 max-w-md text-sm text-charcoal-muted">{text}</p>}
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}

export function ErrorNotice({ error }: { error: unknown }) {
  return (
    <p className="rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-200" role="alert">
      {error instanceof Error ? error.message : String(error)}
    </p>
  );
}

export function Panel({
  title,
  hint,
  children,
  actions
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-charcoal">{title}</h2>
          {hint && <p className="mt-1 text-xs text-charcoal-muted">{hint}</p>}
        </div>
        {actions}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
