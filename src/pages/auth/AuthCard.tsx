import React from 'react';
import { BRAND } from '../../data/brand';

export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-5 py-12">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-7 shadow-panel sm:p-9">
        <img src={BRAND.logo} alt="" className="mx-auto h-16 w-16 object-contain" />
        <h1 className="mt-4 text-center font-display text-3xl text-charcoal">{title}</h1>
        {subtitle && <p className="mt-2 text-center text-sm text-charcoal-muted">{subtitle}</p>}
        <div className="mt-7">{children}</div>
      </div>
    </div>
  );
}

/** Only allow in-app redirects after login, never to another origin. */
export function safeNext(next: string | null) {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/account';
}
