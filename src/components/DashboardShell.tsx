import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileTextIcon,
  FolderHeartIcon,
  FoldersIcon,
  HeartIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  PackageIcon,
  TagsIcon,
  UserIcon,
  UsersIcon
} from 'lucide-react';

export interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const accountNav: NavItem[] = [
  { label: 'My Account', to: '/account', icon: UserIcon },
  { label: 'Wishlist', to: '/wishlist', icon: HeartIcon },
  { label: 'My Lists', to: '/lists', icon: FolderHeartIcon },
  { label: 'My Enquiries', to: '/account/enquiries', icon: FileTextIcon }
];

export const adminNav: NavItem[] = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboardIcon },
  { label: 'Products', to: '/admin/products', icon: PackageIcon },
  { label: 'Categories', to: '/admin/categories', icon: TagsIcon },
  { label: 'Collections', to: '/admin/collections', icon: FoldersIcon },
  { label: 'Enquiries', to: '/admin/enquiries', icon: MessageSquareIcon },
  { label: 'Customers', to: '/admin/customers', icon: UsersIcon }
];

interface Props {
  title: string;
  eyebrow: string;
  subtitle?: string;
  nav: NavItem[];
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardShell({ title, eyebrow, subtitle, nav, actions, children }: Props) {
  const { pathname } = useLocation();
  // The first entry is the section root; it only matches exactly.
  const isActive = (to: string, i: number) =>
    pathname === to || (i > 0 && pathname.startsWith(`${to}/`));

  return (
    <div className="mx-auto flex max-w-site gap-8 px-4 py-8 sm:px-5 lg:px-10">
      <aside className="hidden w-56 shrink-0 lg:block">
        <nav className="sticky top-[140px] space-y-1" aria-label="Section">
          {nav.map((item, i) => {
            const active = isActive(item.to, i);
            return (
              <Link
                key={item.label}
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-colors duration-150 ease-luxe ${
                  active
                    ? 'bg-white font-medium text-charcoal shadow-card'
                    : 'text-charcoal-muted hover:bg-white/60 hover:text-charcoal'
                }`}
              >
                <item.icon className={`h-4 w-4 ${active ? 'text-gold' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <nav
          className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:-mx-5 sm:px-5 lg:hidden"
          aria-label="Section"
        >
          {nav.map((item, i) => {
            const active = isActive(item.to, i);
            return (
              <Link
                key={item.label}
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs ${
                  active ? 'border-gold bg-gold-wash text-charcoal' : 'border-line bg-white text-charcoal-soft'
                }`}
              >
                <item.icon className="h-3.5 w-3.5 text-gold" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <div className="min-w-0">
            <p className="eyebrow text-gold">{eyebrow}</p>
            <h1 className="mt-2 font-display text-3xl text-charcoal sm:text-5xl">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-charcoal-muted">{subtitle}</p>}
          </div>
          {actions}
        </div>

        <div className="mt-8">{children}</div>
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
    <div className={`rounded-xl border p-5 ${emphasis ? 'border-charcoal bg-charcoal text-white' : 'border-line bg-white'}`}>
      <p className={`text-xs ${emphasis ? 'text-white/70' : 'text-charcoal-faint'}`}>{label}</p>
      <p className="mt-2 font-display text-4xl leading-none">{value}</p>
      {meta && <p className={`mt-2 text-xs ${emphasis ? 'text-white/80' : 'text-charcoal-muted'}`}>{meta}</p>}
    </div>
  );
}
