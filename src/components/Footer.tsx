import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../data/brand';

const columns = [
{
  title: 'Marketplace',
  links: [
  { label: 'Explore Catalogue', to: '/catalogue' },
  { label: 'New Arrivals', to: '/catalogue?filter=new' },
  { label: 'Suppliers', to: '/suppliers' },
  { label: 'Customer Collections', to: '/collections' }]

},
{
  title: 'For Retailers',
  links: [
  { label: 'Retailer Dashboard', to: '/dashboard' },
  { label: 'Quote Requests', to: '/dashboard?tab=quotes' },
  { label: 'Orders', to: '/orders' },
  { label: 'Saved Designs', to: '/dashboard?tab=saved' }]

},
{
  title: 'For Suppliers',
  links: [
  { label: 'Supplier Dashboard', to: '/supplier/dashboard' },
  { label: 'Add Product', to: '/supplier/add-product' },
  { label: 'Bulk Upload', to: '/supplier/add-product' },
  { label: 'Admin Console', to: '/admin' }]

}];


export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-site px-5 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={BRAND.logo}
                alt=""
                className="h-16 w-16 object-contain mix-blend-lighten" />
              
              <p className="font-display text-3xl font-semibold text-charcoal">
                25<span className="text-gold">Carat</span>
              </p>
            </div>
            <p className="mt-2 font-display text-lg italic text-charcoal-muted">
              One Platform. Every Design.
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-charcoal-muted">
              India's B2B jewellery sourcing marketplace. Sell more, stock less — source
              verified designs from manufacturers across the country.
            </p>
          </div>
          {columns.map((col) =>
          <div key={col.title}>
              <h3 className="eyebrow text-charcoal-faint">{col.title}</h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) =>
              <li key={l.label}>
                    <Link
                  to={l.to}
                  className="text-sm text-charcoal-soft transition-colors duration-150 ease-luxe hover:text-gold">
                  
                      {l.label}
                    </Link>
                  </li>
              )}
              </ul>
            </div>
          )}
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-xs text-charcoal-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 25Carat Sourcing Pvt. Ltd. B2B access only.</p>
          <p>Verified suppliers · BIS hallmarked production · Secure sourcing</p>
        </div>
      </div>
    </footer>);

}