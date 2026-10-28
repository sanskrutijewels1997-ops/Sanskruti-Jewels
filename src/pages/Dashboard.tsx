import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  BellIcon,
  CompassIcon,
  FileTextIcon,
  FolderHeartIcon,
  HeartIcon,
  LayoutDashboardIcon,
  PackageIcon,
  UserIcon } from
'lucide-react';
import { DashboardShell, StatCard, type NavItem } from '../components/DashboardShell';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../contexts/AppContext';
import { productById, products } from '../data/products';
import { supplierById } from '../data/suppliers';
import type { QuoteStatus } from '../types';

const nav: NavItem[] = [
{ label: 'Dashboard', to: '/dashboard', icon: LayoutDashboardIcon },
{ label: 'Explore Catalogue', to: '/catalogue', icon: CompassIcon },
{ label: 'Saved Designs', to: '/dashboard?tab=saved', icon: HeartIcon },
{ label: 'Customer Collections', to: '/collections', icon: FolderHeartIcon },
{ label: 'Quote Requests', to: '/dashboard?tab=quotes', icon: FileTextIcon },
{ label: 'Orders', to: '/orders', icon: PackageIcon },
{ label: 'Notifications', to: '/dashboard?tab=notifications', icon: BellIcon },
{ label: 'Profile', to: '/dashboard?tab=profile', icon: UserIcon }];


const statusTone: Record<QuoteStatus, string> = {
  Sent: 'bg-ivory-dark text-charcoal-soft',
  'Supplier Responded': 'bg-gold-wash text-gold',
  Negotiation: 'bg-amber-100 text-amber-800',
  Confirmed: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-red-100 text-red-700'
};

export function Dashboard() {
  const [params] = useSearchParams();
  const tab = params.get('tab') ?? 'overview';
  const { saved, collections, quotes, recentlyViewed, notify } = useApp();

  const savedProducts = saved.map((s) => productById(s)).filter(Boolean);
  const recommended = products.filter((p) => p.isNew).slice(0, 4);
  const recent = recentlyViewed.map((r) => productById(r)).filter(Boolean).slice(0, 6);

  return (
    <DashboardShell
      eyebrow="Shree Krishna Jewellers · Nashik"
      title="Welcome back, Lakshya 👋"
      subtitle="Here's what has moved on your counter since yesterday."
      nav={nav}
      actions={
      <Link
        to="/catalogue"
        className="rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white transition-colors duration-150 ease-luxe hover:bg-gold">
        
          Explore Catalogue
        </Link>
      }>
      
      {tab === 'saved' ?
      <section>
          <h2 className="font-display text-3xl text-charcoal">Saved Designs</h2>
          {savedProducts.length === 0 ?
        <EmptyState
          title="No saved designs yet"
          text="Tap the heart on any design to keep it here for your next customer conversation." /> :


        <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {savedProducts.map((p) => p && <ProductCard key={p.id} product={p} />)}
            </div>
        }
        </section> :
      tab === 'quotes' ?
      <QuoteTable /> :
      tab === 'notifications' ?
      <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-3xl text-charcoal">Notifications</h2>
          <ul className="mt-5 divide-y divide-line">
            {[
          ['Rajmandir Jewels responded to quote QR-4821', '18 minutes ago'],
          ['127 new designs added across your saved categories', '2 hours ago'],
          ['Order ORD-90208 has shipped from Mumbai', 'Yesterday'],
          ['Aurum Diamonds updated pricing on 14 designs', '2 days ago']].
          map(([msg, time]) =>
          <li key={msg} className="flex items-start gap-3 py-4">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold" />
                <div>
                  <p className="text-sm text-charcoal">{msg}</p>
                  <p className="mt-0.5 text-xs text-charcoal-faint">{time}</p>
                </div>
              </li>
          )}
          </ul>
        </section> :
      tab === 'profile' ?
      <section className="max-w-2xl rounded-2xl border border-line bg-white p-7">
          <h2 className="font-display text-3xl text-charcoal">Retailer Profile</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
          ['Business name', 'Shree Krishna Jewellers'],
          ['Owner', 'Lakshya Patil'],
          ['City', 'Nashik, Maharashtra'],
          ['GSTIN', '27AAFCS1234K1ZV'],
          ['Counters', '2 showrooms'],
          ['Member since', 'March 2024']].
          map(([k, v]) =>
          <label key={k} className="block">
                <span className="mb-1.5 block text-xs font-medium text-charcoal-muted">{k}</span>
                <input
              defaultValue={v}
              className="h-11 w-full rounded-lg border border-line px-3 text-sm outline-none focus:border-gold" />
            
              </label>
          )}
          </div>
          <button
          type="button"
          onClick={() => notify('Profile updated')}
          className="mt-6 rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white hover:bg-gold">
          
            Save changes
          </button>
        </section> :

      <div className="space-y-14">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Saved Designs" value={String(saved.length)} meta="+3 this week" emphasis />
            <StatCard
            label="Active Customer Collections"
            value={String(collections.length)}
            meta="2 awaiting customer visit" />
          
            <StatCard
            label="Pending Quotes"
            value={String(quotes.filter((q) => q.status === 'Sent' || q.status === 'Negotiation').length)}
            meta="1 supplier responded today" />
          
            <StatCard label="Active Orders" value="4" meta="1 shipped, 2 in production" />
          </div>

          <section>
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl text-charcoal">New Designs You May Like</h2>
              <Link to="/catalogue?filter=new" className="text-sm text-charcoal-muted hover:text-gold">
                See all
              </Link>
            </div>
            <p className="mt-1 text-sm text-charcoal-muted">
              Based on your bridal and diamond sourcing history.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
              {recommended.map((p) =>
            <ProductCard key={p.id} product={p} />
            )}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl text-charcoal">Recently Viewed</h2>
            <div className="no-scrollbar -mx-5 mt-6 flex gap-5 overflow-x-auto px-5 pb-2 lg:mx-0 lg:px-0">
              {recent.map(
              (p) =>
              p &&
              <div key={p.id} className="w-[240px] shrink-0">
                      <ProductCard product={p} />
                    </div>

            )}
            </div>
          </section>

          <QuoteTable compact />
        </div>
      }
    </DashboardShell>);

}

function QuoteTable({ compact = false }: {compact?: boolean;}) {
  const { quotes } = useApp();
  const list = compact ? quotes.slice(0, 4) : quotes;

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-3xl text-charcoal">
          {compact ? 'Recent Quote Requests' : 'Quote Requests'}
        </h2>
        {compact &&
        <Link to="/dashboard?tab=quotes" className="text-sm text-charcoal-muted hover:text-gold">
            View all
          </Link>
        }
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-ivory">
            <tr className="text-xs text-charcoal-faint">
              <th className="px-5 py-3 font-medium">Design</th>
              <th className="hidden px-5 py-3 font-medium md:table-cell">Supplier</th>
              <th className="px-5 py-3 font-medium">Qty</th>
              <th className="hidden px-5 py-3 font-medium sm:table-cell">Raised</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((q) => {
              const p = productById(q.productId);
              const s = supplierById(q.supplierId);
              return (
                <tr key={q.id} className="transition-colors duration-150 ease-luxe hover:bg-ivory/60">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {p &&
                      <img src={p.images[0]} alt="" className="h-12 w-12 rounded-lg object-cover" />
                      }
                      <div className="min-w-0">
                        <Link
                          to={`/product/${q.productId}`}
                          className="block truncate font-medium text-charcoal hover:text-gold">
                          
                          {p?.name}
                        </Link>
                        <span className="text-xs text-charcoal-faint">{q.id} · {q.productId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-5 py-4 text-charcoal-muted md:table-cell">{s?.name}</td>
                  <td className="px-5 py-4 text-charcoal">{q.quantity}</td>
                  <td className="hidden px-5 py-4 text-charcoal-muted sm:table-cell">{q.raised}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${statusTone[q.status]}`}>
                      
                      {q.status}
                    </span>
                  </td>
                </tr>);

            })}
          </tbody>
        </table>
      </div>
    </section>);

}

function EmptyState({ title, text }: {title: string;text: string;}) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-line bg-white px-8 py-20 text-center">
      <h3 className="font-display text-2xl text-charcoal">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-charcoal-muted">{text}</p>
      <Link
        to="/catalogue"
        className="mt-6 inline-block rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white hover:bg-gold">
        
        Explore catalogue
      </Link>
    </div>);

}