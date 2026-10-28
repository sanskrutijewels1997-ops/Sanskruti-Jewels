import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { DashboardShell, type NavItem } from '../components/DashboardShell';
import { orders } from '../data/collections';
import { productById } from '../data/products';
import { supplierById } from '../data/suppliers';
import type { OrderStatus } from '../types';

const nav: NavItem[] = [
{ label: 'Dashboard', to: '/dashboard', icon: LayoutDashboardIcon },
{ label: 'Explore Catalogue', to: '/catalogue', icon: CompassIcon },
{ label: 'Saved Designs', to: '/dashboard?tab=saved', icon: HeartIcon },
{ label: 'Customer Collections', to: '/collections', icon: FolderHeartIcon },
{ label: 'Quote Requests', to: '/dashboard?tab=quotes', icon: FileTextIcon },
{ label: 'Orders', to: '/orders', icon: PackageIcon },
{ label: 'Notifications', to: '/dashboard?tab=notifications', icon: BellIcon },
{ label: 'Profile', to: '/dashboard?tab=profile', icon: UserIcon }];


const tabs = [
'All Orders',
'Quote Pending',
'Confirmed',
'In Production',
'Ready',
'Shipped',
'Delivered'] as
const;

export const statusTone: Record<OrderStatus, string> = {
  'Quote Pending': 'bg-ivory-dark text-charcoal-soft',
  Confirmed: 'bg-gold-wash text-gold',
  'In Production': 'bg-amber-100 text-amber-800',
  Ready: 'bg-sky-100 text-sky-800',
  Shipped: 'bg-indigo-100 text-indigo-800',
  Delivered: 'bg-emerald-100 text-emerald-800'
};

export function Orders() {
  const [tab, setTab] = useState<(typeof tabs)[number]>('All Orders');
  const list = tab === 'All Orders' ? orders : orders.filter((o) => o.status === tab);

  return (
    <DashboardShell
      eyebrow="Sourcing pipeline"
      title="Orders"
      subtitle="Every B2B order from quote through to delivery."
      nav={nav}>
      
      <div
        className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0"
        role="tablist"
        aria-label="Order status">
        
        {tabs.map((t) =>
        <button
          key={t}
          role="tab"
          aria-selected={tab === t}
          onClick={() => setTab(t)}
          className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors duration-150 ease-luxe ${
          tab === t ?
          'border-charcoal bg-charcoal text-white' :
          'border-line bg-white text-charcoal-soft hover:border-gold'}`
          }>
          
            {t}
            <span className="ml-2 text-[10px] opacity-70">
              {t === 'All Orders' ? orders.length : orders.filter((o) => o.status === t).length}
            </span>
          </button>
        )}
      </div>

      {list.length === 0 ?
      <div className="mt-8 rounded-2xl border border-dashed border-line bg-white px-8 py-20 text-center">
          <h2 className="font-display text-2xl text-charcoal">No orders in this stage</h2>
          <p className="mt-2 text-sm text-charcoal-muted">
            Orders move here as suppliers progress your production.
          </p>
        </div> :

      <ul className="mt-8 space-y-4">
          {list.map((o) => {
          const p = productById(o.productId);
          const s = supplierById(o.supplierId);
          return (
            <li key={o.id}>
                <article className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-5 transition-shadow duration-200 ease-luxe hover:shadow-card sm:flex-row sm:items-center">
                  {p &&
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="h-24 w-24 shrink-0 rounded-xl object-cover" />

                }
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-charcoal-faint">
                      {o.id} · {o.productId}
                    </p>
                    <h2 className="mt-1 font-display text-2xl leading-tight text-charcoal">
                      {p?.name}
                    </h2>
                    <p className="mt-1 text-sm text-charcoal-muted">
                      {s?.name} · Qty {o.quantity} · Placed {o.placed}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-5 sm:flex-col sm:items-end">
                    <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusTone[o.status]}`}>
                    
                      {o.status}
                    </span>
                    <div className="text-right">
                      <p className="text-sm font-medium text-charcoal">{o.value}</p>
                      <p className="text-xs text-charcoal-faint">ETA {o.eta}</p>
                    </div>
                    <Link
                    to={`/orders/${o.id}`}
                    className="rounded-full border border-charcoal px-5 py-2.5 text-xs font-semibold text-charcoal transition-colors duration-150 ease-luxe hover:bg-charcoal hover:text-white">
                    
                      View Order
                    </Link>
                  </div>
                </article>
              </li>);

        })}
        </ul>
      }
    </DashboardShell>);

}