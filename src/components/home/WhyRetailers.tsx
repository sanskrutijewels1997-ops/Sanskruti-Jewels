import React from 'react';
import {
  CalendarClockIcon,
  FileTextIcon,
  FolderHeartIcon,
  LayersIcon,
  ShieldCheckIcon,
  TruckIcon } from
'lucide-react';

const reasons = [
{
  icon: LayersIcon,
  title: 'Access More Designs',
  text: 'Sell beyond your physical inventory. Show a customer 12,000 designs from a counter that stocks 400.'
},
{
  icon: CalendarClockIcon,
  title: 'Fresh Catalogue Every Day',
  text: 'Discover new designs uploaded daily by manufacturers across Jaipur, Rajkot, Surat and Coimbatore.'
},
{
  icon: ShieldCheckIcon,
  title: 'Verified Suppliers',
  text: 'Source from trusted jewellery manufacturers with documented hallmarking and trade references.'
},
{
  icon: FolderHeartIcon,
  title: 'Save & Shortlist',
  text: 'Create a private collection for each customer and pick the conversation back up on their next visit.'
},
{
  icon: FileTextIcon,
  title: 'Request Quotes',
  text: 'Get B2B quotations directly from the manufacturer. Pricing stays private between you and the supplier.'
},
{
  icon: TruckIcon,
  title: 'Track Orders',
  text: 'Manage the entire sourcing process from quote to delivery with a single production timeline.'
}];


export function WhyRetailers() {
  return (
    <section id="how-it-works" className="border-t border-line bg-ivory-deep py-20">
      <div className="mx-auto max-w-site px-5 lg:px-10">
        <div className="max-w-2xl">
          <p className="eyebrow text-gold">Why retailers use 25Carat</p>
          <h2 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl">
            Sell more. Stock less.
          </h2>
          <p className="mt-4 text-charcoal-muted">
            Everything a jewellery retailer needs to source confidently — while the customer is
            still sitting across the counter.
          </p>
        </div>

        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r) =>
          <div key={r.title} className="border-t border-line pt-6">
              <r.icon className="h-5 w-5 text-gold" aria-hidden="true" />
              <h3 className="mt-4 font-display text-2xl text-charcoal">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">{r.text}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}