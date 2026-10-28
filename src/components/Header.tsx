import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  HeartIcon,
  LayoutDashboardIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
  XIcon
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { BRAND } from '../data/brand';

const nav = [
  { label: 'Home', to: '/' },
  { label: 'New Arrivals', to: '/catalogue?filter=new' },
  { label: 'Shop All', to: '/catalogue' },
  { label: 'Collections', to: '/collections' },
  { label: 'Bridal', to: '/catalogue?collection=bridal' }
];

export function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <span className="flex items-center gap-2.5">
      <img
        src={BRAND.logo}
        alt=""
        className={size === 'lg' ? 'h-14 w-14 object-contain' : 'h-10 w-10 object-contain'}
      />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display font-semibold tracking-tight text-charcoal ${
            size === 'lg' ? 'text-3xl' : 'text-[22px]'
          }`}
        >
          Sanskruti
        </span>
        <span className="eyebrow mt-1 text-[9px] text-gold">Jewels</span>
      </span>
    </span>
  );
}

export function Header() {
  const { wishlist } = useApp();
  const { user, isAdmin } = useAuth();
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => setMobileOpen(false), [location.pathname, location.search]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/catalogue?q=${encodeURIComponent(query.trim())}`);
  };

  const current = location.pathname + location.search;
  const isActive = (to: string) => (to === '/' ? location.pathname === '/' : current === to);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-ivory/95 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-site items-center gap-6 px-4 sm:px-5 lg:px-10">
        <Link to="/" className="shrink-0" aria-label={`${BRAND.name} home`}>
          <Logo />
        </Link>

        <form onSubmit={submit} className="hidden flex-1 lg:block" role="search">
          <div className="relative mx-auto max-w-xl">
            <SearchIcon
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-faint"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search necklaces, bangles, SKU…"
              aria-label="Search jewellery"
              className="h-11 w-full rounded-full border border-line bg-white pl-11 pr-4 text-sm text-charcoal placeholder:text-charcoal-faint outline-none transition-colors duration-150 ease-luxe focus:border-gold"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 lg:gap-2">
          <Link
            to="/wishlist"
            className="relative rounded-full p-2.5 text-charcoal-soft transition-colors duration-150 ease-luxe hover:bg-gold-wash hover:text-charcoal"
            aria-label={`Wishlist, ${wishlist.length} items`}
          >
            <HeartIcon className="h-[18px] w-[18px]" />
            {wishlist.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-black">
                {wishlist.length}
              </span>
            )}
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden items-center gap-2 rounded-full border border-gold-pale bg-gold-wash px-4 py-2 text-sm font-medium text-gold-light transition-colors duration-150 ease-luxe hover:border-gold sm:flex"
            >
              <LayoutDashboardIcon className="h-4 w-4" />
              Admin
            </Link>
          )}
          {user ? (
            <Link
              to="/account"
              className="rounded-full p-2.5 text-charcoal-soft transition-colors duration-150 ease-luxe hover:bg-gold-wash hover:text-charcoal"
              aria-label="My account"
            >
              <UserIcon className="h-[18px] w-[18px]" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden px-3 py-2 text-sm font-medium text-charcoal-soft transition-colors duration-150 ease-luxe hover:text-charcoal sm:block"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="hidden rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 ease-luxe hover:bg-gold md:block"
              >
                Create account
              </Link>
            </>
          )}
          <button
            type="button"
            className="rounded-full p-2.5 text-charcoal lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <nav className="hidden border-t border-line lg:block" aria-label="Primary">
        <ul className="mx-auto flex max-w-site items-center gap-9 px-10">
          {nav.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                className={`block border-b-2 py-3 text-[13px] font-medium tracking-wide transition-colors duration-150 ease-luxe ${
                  isActive(item.to)
                    ? 'border-gold text-charcoal'
                    : 'border-transparent text-charcoal-muted hover:text-charcoal'
                }`}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {mobileOpen && (
        <div className="max-h-[calc(100vh-68px)] overflow-y-auto border-t border-line bg-white px-5 py-4 lg:hidden">
          <form onSubmit={submit} className="mb-4" role="search">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jewellery, SKU…"
                aria-label="Search jewellery"
                className="h-11 w-full rounded-full border border-line bg-ivory pl-11 pr-4 text-sm text-charcoal outline-none focus:border-gold"
              />
            </div>
          </form>
          <ul className="space-y-1">
            {nav.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal-soft hover:bg-gold-wash"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {user && (
              <>
                <li>
                  <Link to="/lists" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal-soft hover:bg-gold-wash">
                    My Lists
                  </Link>
                </li>
                <li>
                  <Link to="/account" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal-soft hover:bg-gold-wash">
                    My Account
                  </Link>
                </li>
              </>
            )}
            {isAdmin && (
              <li>
                <Link to="/admin" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gold-light hover:bg-gold-wash">
                  Admin Console
                </Link>
              </li>
            )}
            {!user && (
              <li className="grid grid-cols-2 gap-2 pt-3">
                <Link to="/login" className="rounded-full border border-line px-4 py-2.5 text-center text-sm text-charcoal">
                  Sign in
                </Link>
                <Link to="/register" className="rounded-full bg-charcoal px-4 py-2.5 text-center text-sm text-white">
                  Create account
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
