import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  MessageSquareIcon,
  PackageIcon,
  TagsIcon,
  UsersIcon
} from 'lucide-react';
import { PageHeader } from './PageHeader';

export interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const adminNav: NavItem[] = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboardIcon },
  { label: 'Products', to: '/admin/products', icon: PackageIcon },
  { label: 'Categories', to: '/admin/categories', icon: TagsIcon },
  { label: 'Enquiries', to: '/admin/enquiries', icon: MessageSquareIcon },
  { label: 'Customers', to: '/admin/customers', icon: UsersIcon }
];

interface Props {
  title: string;
  eyebrow: string;
  subtitle?: string;
  nav: NavItem[];
  actions?: React.ReactNode;
  /** Where Back goes when the screen was opened directly. */
  fallback?: string;
  children: React.ReactNode;
}

/** Admin layout: app bar + section chips on phones, sidebar on desktop. */
export function DashboardShell({ title, eyebrow, subtitle, nav, actions, fallback = '/account', children }: Props) {
  const { pathname } = useLocation();
  // The first entry is the section root; it only matches exactly.
  const isActive = (to: string, i: number) => pathname === to || (i > 0 && pathname.startsWith(`${to}/`));

  return (
    <div className="mx-auto flex max-w-site gap-8 lg:px-6 lg:py-8">
      <aside className="hidden w-52 shrink-0 lg:block">
        <p className="eyebrow mb-3 px-3.5 text-gold">Admin console</p>
        <nav className="sticky top-24 space-y-1" aria-label="Admin sections">
          {nav.map((item, i) => {
            const active = isActive(item.to, i);
            return (
              <Link
                key={item.label}
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm ${
                  active ? 'bg-surface font-semibold text-ink shadow-card' : 'text-ink-2 hover:bg-surface hover:text-ink'
                }`}
              >
                <item.icon className={`h-4 w-4 ${active ? 'text-brand' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="lg:hidden">
          <PageHeader title={title} subtitle={subtitle ?? eyebrow} fallback={fallback} />
          <nav className="no-scrollbar flex gap-2 overflow-x-auto border-b border-line bg-surface px-4 py-2.5" aria-label="Admin sections">
            {nav.map((item, i) => {
              const active = isActive(item.to, i);
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  replace
                  aria-current={active ? 'page' : undefined}
                  className={`pressable flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-semibold ${
                    active ? 'bg-brand text-brand-on' : 'bg-surface-2 text-ink-2'
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden items-end justify-between gap-4 border-b border-line pb-5 lg:flex">
          <div className="min-w-0">
            <p className="eyebrow text-gold">{eyebrow}</p>
            <h1 className="mt-1.5 font-display text-4xl font-semibold text-ink">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-ink-3">{subtitle}</p>}
          </div>
          {actions}
        </div>
        {actions && <div className="flex flex-wrap gap-2 px-4 pt-4 lg:hidden [&>*]:flex-1">{actions}</div>}

        <div className="px-4 py-5 lg:px-0 lg:py-6">{children}</div>
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  meta,
  emphasis = false
}: {
  label: string;
  value: string;
  meta?: string;
  emphasis?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-4 ${emphasis ? 'bg-brand text-brand-on' : 'border border-line bg-surface'}`}>
      <p className={`text-xs font-medium ${emphasis ? 'opacity-80' : 'text-ink-3'}`}>{label}</p>
      <p className="mt-1.5 font-display text-4xl font-semibold leading-none">{value}</p>
      {meta && <p className={`mt-1.5 text-xs ${emphasis ? 'opacity-80' : 'text-ink-2'}`}>{meta}</p>}
    </div>
  );
}
