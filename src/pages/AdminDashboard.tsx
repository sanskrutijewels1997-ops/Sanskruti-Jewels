import React, { useState } from 'react';
import {
  BadgeCheckIcon,
  BarChart3Icon,
  BoxesIcon,
  CheckIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  PackageIcon,
  ShieldCheckIcon,
  StoreIcon,
  UsersIcon,
  XIcon } from
'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { DashboardShell, StatCard, type NavItem } from '../components/DashboardShell';
import { useApp } from '../contexts/AppContext';
import { suppliers } from '../data/suppliers';
import { products } from '../data/products';

const nav: NavItem[] = [
{ label: 'Overview', to: '/admin', icon: LayoutDashboardIcon },
{ label: 'Retailers', to: '/admin?tab=retailers', icon: UsersIcon },
{ label: 'Suppliers', to: '/admin?tab=suppliers', icon: StoreIcon },
{ label: 'Product Approval', to: '/admin?tab=approval', icon: BoxesIcon },
{ label: 'Catalogue Management', to: '/admin?tab=catalogue', icon: BoxesIcon },
{ label: 'Quote Requests', to: '/admin?tab=quotes', icon: FileTextIcon },
{ label: 'Orders', to: '/admin?tab=orders', icon: PackageIcon },
{ label: 'Verification', to: '/admin?tab=verification', icon: ShieldCheckIcon },
{ label: 'Analytics', to: '/admin?tab=analytics', icon: BarChart3Icon }];


const gmvData = [
{ month: 'Mar', gmv: 182, orders: 240 },
{ month: 'Apr', gmv: 214, orders: 286 },
{ month: 'May', gmv: 268, orders: 331 },
{ month: 'Jun', gmv: 246, orders: 308 },
{ month: 'Jul', gmv: 312, orders: 402 },
{ month: 'Aug', gmv: 388, orders: 468 }];


const uploadData = [
{ day: 'Mon', designs: 96 },
{ day: 'Tue', designs: 128 },
{ day: 'Wed', designs: 112 },
{ day: 'Thu', designs: 141 },
{ day: 'Fri', designs: 168 },
{ day: 'Sat', designs: 154 },
{ day: 'Sun', designs: 127 }];


export function AdminDashboard() {
  const { notify } = useApp();
  const [pending, setPending] = useState(products.slice(0, 5));

  return (
    <DashboardShell
      eyebrow="Platform administration"
      title="25Carat Console"
      subtitle="Marketplace health across retailers, suppliers, catalogue and orders."
      nav={nav}>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Retailers" value="4,218" meta="+112 this month" emphasis />
        <StatCard label="Active Retailers" value="2,946" meta="70% 30-day active" />
        <StatCard label="Total Suppliers" value="340" meta="+8 this month" />
        <StatCard label="Verified Suppliers" value="298" meta="42 under review" />
        <StatCard label="Total Designs" value="12,482" meta="127 added today" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="New Designs Today" value="127" />
        <StatCard label="Quote Requests" value="1,864" meta="This month" />
        <StatCard label="Orders" value="468" meta="This month" />
        <StatCard label="GMV" value="₹ 38.8 Cr" meta="+24% MoM" />
        <StatCard label="Platform Revenue" value="₹ 1.94 Cr" meta="5% take rate" />
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-2xl text-charcoal">GMV & orders</h2>
          <p className="mt-1 text-xs text-charcoal-muted">GMV in ₹ crore, orders in units</p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gmvData} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid stroke="#E5DCCD" vertical={false} />
                <XAxis dataKey="month" stroke="#9A9088" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9A9088" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5DCCD', fontSize: 12 }} />
                <Line type="monotone" dataKey="gmv" stroke="#A9853F" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="orders" stroke="#EDE8DF" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-2xl text-charcoal">Designs uploaded</h2>
          <p className="mt-1 text-xs text-charcoal-muted">Last 7 days across all suppliers</p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={uploadData} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid stroke="#E5DCCD" vertical={false} />
                <XAxis dataKey="day" stroke="#9A9088" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9A9088" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#FAF6F0' }}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E5DCCD', fontSize: 12 }} />
                
                <Bar dataKey="designs" fill="#A9853F" radius={[6, 6, 0, 0]} barSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-line bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-charcoal">Product approval queue</h2>
            <span className="rounded-full bg-gold-wash px-3 py-1 text-xs font-medium text-gold">
              {pending.length} pending
            </span>
          </div>
          {pending.length === 0 ?
          <p className="mt-8 rounded-xl border border-dashed border-line py-14 text-center text-sm text-charcoal-muted">
              Queue is clear. Nothing awaiting review.
            </p> :

          <ul className="mt-5 divide-y divide-line">
              {pending.map((p) =>
            <li key={p.id} className="flex items-center gap-4 py-3.5">
                  <img src={p.images[0]} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-charcoal">{p.name}</p>
                    <p className="text-xs text-charcoal-faint">
                      {p.id} · {p.category} · {p.purity}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                  type="button"
                  onClick={() => {
                    setPending((list) => list.filter((x) => x.id !== p.id));
                    notify(`${p.id} approved`);
                  }}
                  aria-label={`Approve ${p.id}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-charcoal-soft transition-colors duration-150 ease-luxe hover:border-gold hover:text-gold">
                  
                      <CheckIcon className="h-4 w-4" />
                    </button>
                    <button
                  type="button"
                  onClick={() => {
                    setPending((list) => list.filter((x) => x.id !== p.id));
                    notify(`${p.id} rejected`, 'info');
                  }}
                  aria-label={`Reject ${p.id}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-charcoal-soft transition-colors duration-150 ease-luxe hover:border-red-300 hover:text-red-600">
                  
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                </li>
            )}
            </ul>
          }
        </div>

        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-2xl text-charcoal">Supplier verification</h2>
          <ul className="mt-5 divide-y divide-line">
            {suppliers.slice(0, 6).map((s) =>
            <li key={s.id} className="flex items-center gap-3 py-3.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-wash text-xs font-semibold text-gold">
                  {s.logo}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-charcoal">{s.name}</p>
                  <p className="text-xs text-charcoal-faint">
                    {s.city} · {s.designs.toLocaleString('en-IN')} designs
                  </p>
                </div>
                {s.verified ?
              <span className="flex items-center gap-1 text-xs text-gold">
                    <BadgeCheckIcon className="h-4 w-4" /> Verified
                  </span> :

              <button
                type="button"
                onClick={() => notify(`${s.name} marked verified`)}
                className="rounded-full border border-charcoal px-3.5 py-1.5 text-xs font-semibold text-charcoal transition-colors duration-150 ease-luxe hover:bg-charcoal hover:text-white">
                
                    Verify
                  </button>
              }
              </li>
            )}
          </ul>
        </div>
      </section>
    </DashboardShell>);

}