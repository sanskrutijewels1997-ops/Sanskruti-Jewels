import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  BellIcon,
  HeartIcon,
  LayoutDashboardIcon,
  MenuIcon,
  SearchIcon,
  XIcon } from
'lucide-react';
import { useApp } from '../contexts/AppContext';
import { BRAND } from '../data/brand';

const nav = [
{ label: 'Home', to: '/' },
{ label: 'New Arrivals', to: '/catalogue?filter=new' },
{ label: 'Categories', to: '/catalogue' },
{ label: 'Collections', to: '/collections' },
{ label: 'Suppliers', to: '/suppliers' },
{ label: 'How It Works', to: '/#how-it-works' }];


export function Header() {
  const { saved, loggedIn, setLoggedIn, notify } = useApp();
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/catalogue?q=${encodeURIComponent(query)}`);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-site items-center gap-6 px-5 lg:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${BRAND.name} home`}>
          <img
            src={BRAND.logo}
            alt=""
            className="h-11 w-11 object-contain mix-blend-lighten" />
          
          <span className="font-display text-2xl font-semibold tracking-tight text-charcoal">
            25<span className="text-gold">Carat</span>
          </span>
        </Link>

        <form onSubmit={submit} className="hidden flex-1 lg:block" role="search">
          <div className="relative mx-auto max-w-xl">
            <SearchIcon
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-faint"
              aria-hidden="true" />
            
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jewellery designs, product ID, category…"
              aria-label="Search jewellery designs"
              className="h-11 w-full rounded-full border border-line bg-white pl-11 pr-4 text-sm text-charcoal placeholder:text-charcoal-faint outline-none transition-colors duration-150 ease-luxe focus:border-gold" />
            
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 lg:gap-2">
          <Link
            to="/dashboard?tab=saved"
            className="relative rounded-full p-2.5 text-charcoal-soft transition-colors duration-150 ease-luxe hover:bg-gold-wash hover:text-charcoal"
            aria-label={`Saved designs, ${saved.length} items`}>
            
            <HeartIcon className="h-[18px] w-[18px]" />
            {saved.length > 0 &&
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-white">
                {saved.length}
              </span>
            }
          </Link>
          <button
            type="button"
            onClick={() => notify('No new notifications', 'info')}
            className="hidden rounded-full p-2.5 text-charcoal-soft transition-colors duration-150 ease-luxe hover:bg-gold-wash hover:text-charcoal sm:block"
            aria-label="Notifications">
            
            <BellIcon className="h-[18px] w-[18px]" />
          </button>
          {loggedIn ?
          <Link
            to="/dashboard"
            className="hidden items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-charcoal transition-colors duration-150 ease-luxe hover:border-gold sm:flex">
            
              <LayoutDashboardIcon className="h-4 w-4 text-gold" />
              Dashboard
            </Link> :

          <button
            type="button"
            onClick={() => {
              setLoggedIn(true);
              notify('Signed in as Lakshya — Shree Krishna Jewellers');
            }}
            className="hidden px-3 py-2 text-sm font-medium text-charcoal-soft transition-colors duration-150 ease-luxe hover:text-charcoal sm:block">
            
              Login
            </button>
          }
          <Link
            to="/dashboard"
            className="hidden rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 ease-luxe hover:bg-gold md:block">
            
            Join as Retailer
          </Link>
          <button
            type="button"
            className="rounded-full p-2.5 text-charcoal lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}>
            
            {mobileOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <nav
        className="hidden border-t border-line lg:block"
        aria-label="Primary">
        
        <ul className="mx-auto flex max-w-site items-center gap-9 px-10">
          {nav.map((item) =>
          <li key={item.label}>
              <NavLink
              to={item.to}
              className={({ isActive }) =>
              `block border-b-2 py-3 text-[13px] font-medium tracking-wide transition-colors duration-150 ease-luxe ${
              isActive && item.to === '/' ?
              'border-gold text-charcoal' :
              'border-transparent text-charcoal-muted hover:text-charcoal'}`

              }>
              
                {item.label}
              </NavLink>
            </li>
          )}
          <li className="ml-auto py-3 text-[13px] text-charcoal-faint">
            <Link to="/supplier/dashboard" className="hover:text-charcoal">
              Supplier Portal
            </Link>
            <span className="px-2 text-line">|</span>
            <Link to="/admin" className="hover:text-charcoal">
              Admin
            </Link>
          </li>
        </ul>
      </nav>

      {mobileOpen &&
      <div className="border-t border-line bg-white px-5 py-4 lg:hidden">
          <form onSubmit={submit} className="mb-4" role="search">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-faint" />
              <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search designs, product ID…"
              aria-label="Search jewellery designs"
              className="h-11 w-full rounded-full border border-line bg-ivory pl-11 pr-4 text-sm outline-none focus:border-gold" />
            
            </div>
          </form>
          <ul className="space-y-1">
            {nav.map((item) =>
          <li key={item.label}>
                <Link
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal-soft hover:bg-gold-wash">
              
                  {item.label}
                </Link>
              </li>
          )}
            <li className="grid grid-cols-2 gap-2 pt-3">
              <Link
              to="/supplier/dashboard"
              onClick={() => setMobileOpen(false)}
              className="rounded-full border border-line px-4 py-2.5 text-center text-sm">
              
                Supplier Portal
              </Link>
              <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="rounded-full bg-charcoal px-4 py-2.5 text-center text-sm text-white">
              
                Join as Retailer
              </Link>
            </li>
          </ul>
        </div>
      }
    </header>);

}