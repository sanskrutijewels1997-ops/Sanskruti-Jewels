import React from 'react';
import { Loader2Icon } from 'lucide-react';

export const inputClass =
  'h-12 w-full rounded-xl border border-line bg-surface px-3.5 text-[15px] text-ink placeholder:text-ink-3 outline-none transition-colors duration-150 focus:border-brand disabled:opacity-60';

export const primaryButton =
  'pressable inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold tracking-wide text-brand-on disabled:cursor-not-allowed disabled:opacity-50';

export const secondaryButton =
  'pressable inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-6 text-sm font-semibold tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50';

export const chipClass = (active: boolean) =>
  `pressable inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium ${
    active ? 'border-brand bg-brand-soft text-brand' : 'border-line bg-surface text-ink-2'
  }`;

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
  // The hint sits outside the <label> so it isn't read as part of the field's name.
  const hintId = React.useId();
  return (
    <div className={className}>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-ink-2">{label}</span>
        {hint && React.isValidElement<{ 'aria-describedby'?: string }>(children)
          ? React.cloneElement(children, { 'aria-describedby': hintId })
          : children}
      </label>
      {hint && (
        <span id={hintId} className="mt-1 block text-[11px] text-ink-3">
          {hint}
        </span>
      )}
    </div>
  );
}

export function Spinner({ className = 'h-4 w-4' }: { className?: string }) {
  return <Loader2Icon className={`animate-spin ${className}`} aria-hidden="true" />;
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-brand" role="status">
      <Spinner className="h-7 w-7" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  text,
  action
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  text?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      {Icon && (
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-wash text-gold">
          <Icon className="h-7 w-7" />
        </span>
      )}
      <h2 className="mt-5 font-display text-2xl font-semibold text-ink">{title}</h2>
      {text && <p className="mt-2 max-w-xs text-sm text-ink-2">{text}</p>}
      {action && <div className="mt-6 w-full max-w-xs">{action}</div>}
    </div>
  );
}

export function ErrorNotice({ error }: { error: unknown }) {
  return (
    <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
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
    <section className="rounded-2xl border border-line bg-surface p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          {hint && <p className="mt-1 text-xs text-ink-3">{hint}</p>}
        </div>
        {actions}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Section title used across app screens: small label + optional "See all". */
export function SectionHeader({
  title,
  subtitle,
  action
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 px-4 lg:px-0">
      <div className="min-w-0">
        <h2 className="font-display text-[22px] font-semibold leading-tight text-ink sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-ink-3">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
