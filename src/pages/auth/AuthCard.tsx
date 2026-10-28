import React from 'react';
import { BRAND } from '../../data/brand';
import { PageHeader } from '../../components/PageHeader';

/** Full-screen auth layout on phones, a centred card on desktop. */
export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-surface lg:min-h-0 lg:bg-transparent">
      <div className="lg:hidden">
        <PageHeader title="" fallback="/account" />
      </div>
      <div className="mx-auto w-full max-w-md px-6 pb-10 pt-4 lg:mt-12 lg:rounded-2xl lg:border lg:border-line lg:bg-surface lg:p-9 lg:shadow-card">
        <img src={BRAND.logo} alt="" className="h-16 w-16 object-contain" />
        <h1 className="mt-5 font-display text-[32px] font-semibold leading-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-ink-2">{subtitle}</p>}
        <div className="mt-7">{children}</div>
      </div>
    </div>
  );
}

/** Only allow in-app redirects after login, never to another origin. */
export function safeNext(next: string | null) {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/account';
}
