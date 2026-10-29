import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HeartIcon, LayoutDashboardIcon, SearchIcon, UserIcon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Logo, SinceBadge } from './Logo';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Shop All', to: '/catalogue' },
  { label: 'New Arrivals', to: '/catalogue?filter=new' },
  { label: 'Categories', to: '/categories' }
];

/** Top navigation for laptops/desktops; phones use the bottom tab bar instead. */
export function DesktopNav() {
  const { wishlist } = useApp();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const { pathname, search } = useLocation();
  // Match on path + query so "Shop All" and "New Arrivals" aren't both active.
  const isActive = (to: string) => pathname + search === to;

  return (
    <header className="sticky top-0 z-40 hidden border-b border-line bg-surface/95 backdrop-blur-md lg:block">
      <div className="mx-auto flex h-16 max-w-site items-center gap-8 px-6">
        <Link to="/" aria-label="Sanskruti Jewels home" className="flex items-center gap-3">
          <Logo />
          <SinceBadge size="sm" />
        </Link>
        <nav className="flex items-center gap-6" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              aria-current={isActive(l.to) ? 'page' : undefined}
              className={`text-sm font-medium ${isActive(l.to) ? 'text-brand' : 'text-ink-2 hover:text-ink'}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <form
          role="search"
          className="relative ml-auto w-72"
          onSubmit={(e) => {
            e.preventDefault();
            navigate(`/catalogue?q=${encodeURIComponent(q.trim())}`);
          }}
        >
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search jewellery"
            aria-label="Search jewellery"
            className="h-10 w-full rounded-full border border-line bg-surface-2 pl-10 pr-4 text-sm text-ink outline-none focus:border-brand"
          />
        </form>
        <div className="flex items-center gap-1">
          {isAdmin && (
            <Link to="/admin" className="mr-2 flex items-center gap-1.5 rounded-full bg-brand-soft px-3.5 py-2 text-sm font-semibold text-brand">
              <LayoutDashboardIcon className="h-4 w-4" /> Admin
            </Link>
          )}
          <Link to="/wishlist" aria-label={`Wishlist, ${wishlist.length} items`} className="relative rounded-full p-2.5 text-ink hover:bg-surface-2">
            <HeartIcon className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-on">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/account" aria-label={user ? 'Profile' : 'Sign in'} className="rounded-full p-2.5 text-ink hover:bg-surface-2">
            <UserIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
