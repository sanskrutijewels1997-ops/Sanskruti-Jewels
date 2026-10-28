import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../data/categories';

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-site px-5 py-20 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold">Shop by category</p>
          <h2 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl">
            Every jewellery category, one catalogue
          </h2>
        </div>
        <Link
          to="/catalogue"
          className="text-sm font-medium text-charcoal underline-offset-4 hover:text-gold hover:underline">
          
          View all 12,482 designs
        </Link>
      </div>

      <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {categories.map((cat) =>
        <li key={cat.slug}>
            <Link
            to={`/catalogue?category=${encodeURIComponent(cat.name)}`}
            className="group block overflow-hidden rounded-xl border border-line bg-white transition-shadow duration-200 ease-luxe hover:shadow-lift">
            
              <div className="aspect-[4/5] overflow-hidden bg-ivory-deep">
                <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[400ms] ease-luxe group-hover:scale-105" />
              
              </div>
              <div className="px-4 py-3.5">
                <p className="font-display text-lg leading-tight text-charcoal">{cat.name}</p>
                <p className="mt-0.5 text-xs text-charcoal-faint">
                  {cat.designs.toLocaleString('en-IN')} designs
                </p>
              </div>
            </Link>
          </li>
        )}
      </ul>
    </section>);

}