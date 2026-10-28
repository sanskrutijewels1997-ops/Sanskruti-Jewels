import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { IMG } from '../../data/images';
import { collectionsEditorial } from '../../data/products';

const imageFor: Record<string, string> = {
  bridal: IMG.editorialBridal,
  everyday: IMG.editorialEveryday,
  traditional: IMG.temple,
  modern: IMG.editorialModern,
  statement: IMG.editorialStatement,
  mens: IMG.mens
};

export function CollectionsEditorial() {
  const [lead, ...rest] = collectionsEditorial;

  return (
    <section className="border-y border-line bg-white py-20">
      <div className="mx-auto max-w-site px-5 lg:px-10">
        <p className="eyebrow text-gold">Shop by collection</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl text-charcoal sm:text-5xl">
          Curated lines, built for how your counter actually sells
        </h2>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <Link
            to={`/catalogue?collection=${encodeURIComponent(lead.name)}`}
            className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-2xl lg:min-h-[560px]">
            
            <img
              src={imageFor[lead.slug]}
              alt={lead.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[500ms] ease-luxe group-hover:scale-105" />
            
            <div className="absolute inset-0 bg-charcoal/45" aria-hidden="true" />
            <div className="relative p-8 text-charcoal lg:p-10">
              <p className="eyebrow text-gold-light">{lead.designs.toLocaleString('en-IN')} designs</p>
              <h3 className="mt-3 font-display text-4xl lg:text-5xl">{lead.name}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-charcoal-soft">{lead.line}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
                Explore collection
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 ease-luxe group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-rows-2">
            {rest.map((c) =>
            <Link
              key={c.slug}
              to={`/catalogue?collection=${encodeURIComponent(c.name)}`}
              className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-2xl">
              
                <img
                src={imageFor[c.slug]}
                alt={c.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[500ms] ease-luxe group-hover:scale-105" />
              
                <div className="absolute inset-0 bg-charcoal/40" aria-hidden="true" />
                <div className="relative p-6 text-charcoal">
                  <h3 className="font-display text-2xl">{c.name}</h3>
                  <p className="mt-1 text-xs text-gold-light">
                    {c.designs.toLocaleString('en-IN')} designs
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>);

}