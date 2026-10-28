import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{className?: string;}>;
}

interface Props {
  title: string;
  eyebrow: string;
  subtitle?: string;
  nav: NavItem[];
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardShell({ title, eyebrow, subtitle, nav, actions, children }: Props) {
  const { pathname, search } = useLocation();
  const current = pathname + search;

  return (
    <div className="mx-auto flex max-w-site gap-8 px-5 py-8 lg:px-10">
      <aside className="hidden w-60 shrink-0 lg:block">
        <nav className="sticky top-[140px] space-y-1" aria-label="Dashboard">
          {nav.map((item) => {
            const active =
            current === item.to || item.to !== '/catalogue' && current.startsWith(item.to) && item.to.length > 10;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-colors duration-150 ease-luxe ${
                active ?
                'bg-white font-medium text-charcoal shadow-card' :
                'text-charcoal-muted hover:bg-white/60 hover:text-charcoal'}`
                }>
                
                <item.icon className={`h-4 w-4 ${active ? 'text-gold' : ''}`} />
                {item.label}
              </Link>);

          })}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <div>
            <p className="eyebrow text-gold">{eyebrow}</p>
            <h1 className="mt-2 font-display text-4xl text-charcoal sm:text-5xl">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-charcoal-muted">{subtitle}</p>}
          </div>
          {actions}
        </div>

        <nav className="no-scrollbar -mx-5 mt-5 flex gap-2 overflow-x-auto px-5 lg:hidden" aria-label="Dashboard sections">
          {nav.map((item) =>
          <Link
            key={item.label}
            to={item.to}
            className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs text-charcoal-soft">
            
              <item.icon className="h-3.5 w-3.5 text-gold" />
              {item.label}
            </Link>
          )}
        </nav>

        <div className="mt-8">{children}</div>
      </div>
    </div>);

}

export function StatCard({
  label,
  value,
  meta,
  emphasis = false





}: {label: string;value: string;meta?: string;emphasis?: boolean;}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
      emphasis ? 'border-charcoal bg-charcoal text-white' : 'border-line bg-white'}`
      }>
      
      <p className={`text-xs ${emphasis ? 'text-white/70' : 'text-charcoal-faint'}`}>{label}</p>
      <p className="mt-2 font-display text-4xl leading-none">{value}</p>
      {meta &&
      <p className={`mt-2 text-xs ${emphasis ? 'text-gold-light' : 'text-charcoal-muted'}`}>
          {meta}
        </p>
      }
    </div>);

}