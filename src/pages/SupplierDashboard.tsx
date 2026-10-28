import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3Icon,
  BoxesIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  PackageIcon,
  PlusIcon,
  UploadCloudIcon,
  UserIcon } from
'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { DashboardShell, StatCard, type NavItem } from '../components/DashboardShell';
import { productById, products } from '../data/products';
import { initialQuotes } from '../data/collections';

const nav: NavItem[] = [
{ label: 'Overview', to: '/supplier/dashboard', icon: LayoutDashboardIcon },
{ label: 'My Catalogue', to: '/supplier/dashboard?tab=catalogue', icon: BoxesIcon },
{ label: 'Add Product', to: '/supplier/add-product', icon: PlusIcon },
{ label: 'Bulk Upload', to: '/supplier/add-product', icon: UploadCloudIcon },
{ label: 'Quote Requests', to: '/supplier/dashboard?tab=quotes', icon: FileTextIcon },
{ label: 'Orders', to: '/orders', icon: PackageIcon },
{ label: 'Analytics', to: '/supplier/dashboard?tab=analytics', icon: BarChart3Icon },
{ label: 'Profile', to: '/supplier/dashboard?tab=profile', icon: UserIcon }];


const viewsData = [
{ day: 'Mon', views: 1820, quotes: 12 },
{ day: 'Tue', views: 2140, quotes: 18 },
{ day: 'Wed', views: 1960, quotes: 15 },
{ day: 'Thu', views: 2480, quotes: 22 },
{ day: 'Fri', views: 3120, quotes: 31 },
{ day: 'Sat', views: 3640, quotes: 38 },
{ day: 'Sun', views: 2890, quotes: 24 }];


const categoryData = [
{ name: 'Bridal', value: 412 },
{ name: 'Necklace', value: 368 },
{ name: 'Earrings', value: 296 },
{ name: 'Bangle', value: 241 },
{ name: 'Ring', value: 198 },
{ name: 'Chain', value: 147 }];


export function SupplierDashboard() {
  const topDesigns = [...products].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <DashboardShell
      eyebrow="Supplier portal · Rajmandir Jewels, Jaipur"
      title="Catalogue Overview"
      subtitle="How your designs performed with retailers over the last 7 days."
      nav={nav}
      actions={
      <Link
        to="/supplier/add-product"
        className="flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white transition-colors duration-150 ease-luxe hover:bg-gold">
        
          <PlusIcon className="h-4 w-4" />
          Add Product
        </Link>
      }>
      
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Products" value="1,842" meta="+34 this week" emphasis />
        <StatCard label="Product Views" value="18,052" meta="+12.4% vs last week" />
        <StatCard label="New Quote Requests" value="46" meta="9 awaiting response" />
        <StatCard label="Active Orders" value="17" meta="4 ready to ship" />
        <StatCard label="Conversion Rate" value="4.8%" meta="Views → quotes" />
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-2xl text-charcoal">Retailer views & quote requests</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsData} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid stroke="#E5DCCD" vertical={false} />
                <XAxis dataKey="day" stroke="#9A9088" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9A9088" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #E5DCCD',
                    fontSize: 12
                  }} />
                
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#A9853F"
                  fill="#241D12"
                  strokeWidth={2} />
                
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-2xl text-charcoal">Designs by category</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 12, right: 12 }}>
                <CartesianGrid stroke="#E5DCCD" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#C2BAAD"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={70} />
                
                <Tooltip
                  cursor={{ fill: '#FAF6F0' }}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E5DCCD', fontSize: 12 }} />
                
                <Bar dataKey="value" fill="#C9A24D" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-2xl text-charcoal">Top performing designs</h2>
          <ul className="mt-5 divide-y divide-line">
            {topDesigns.map((p) =>
            <li key={p.id} className="flex items-center gap-4 py-3.5">
                <img src={p.images[0]} alt="" className="h-14 w-14 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <Link
                  to={`/product/${p.id}`}
                  className="block truncate text-sm font-medium text-charcoal hover:text-gold">
                  
                    {p.name}
                  </Link>
                  <p className="text-xs text-charcoal-faint">{p.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-charcoal">{p.views.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-charcoal-faint">views</p>
                </div>
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-2xl text-charcoal">Incoming quote requests</h2>
          <ul className="mt-5 divide-y divide-line">
            {initialQuotes.slice(0, 5).map((q) => {
              const p = productById(q.productId);
              return (
                <li key={q.id} className="flex items-center gap-4 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-charcoal">{p?.name}</p>
                    <p className="text-xs text-charcoal-faint">
                      {q.id} · Qty {q.quantity} · needed {q.deliveryDate}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-full border border-charcoal px-4 py-2 text-xs font-semibold text-charcoal transition-colors duration-150 ease-luxe hover:bg-charcoal hover:text-white">
                    
                    Respond
                  </button>
                </li>);

            })}
          </ul>
        </div>
      </section>
    </DashboardShell>);

}