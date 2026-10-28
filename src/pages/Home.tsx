import React from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/home/Hero';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { NewArrivals } from '../components/home/NewArrivals';
import { Trending } from '../components/home/Trending';
import { CollectionsEditorial } from '../components/home/CollectionsEditorial';
import { FeaturedSuppliers } from '../components/home/FeaturedSuppliers';
import { WhyRetailers } from '../components/home/WhyRetailers';
import { BRAND } from '../data/brand';

export function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <NewArrivals />
      <Trending />
      <CollectionsEditorial />
      <FeaturedSuppliers />
      <WhyRetailers />

      <section className="border-t border-gold-pale bg-black py-20">
        <div className="mx-auto max-w-site px-5 text-center lg:px-10">
          <img
            src={BRAND.logo}
            alt="25Carat"
            className="mx-auto h-24 w-24 object-contain mix-blend-lighten" />
          
          <p className="eyebrow mt-4 text-gold-light">{BRAND.slogan}</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl text-charcoal sm:text-5xl">
            Open 25Carat at your counter and never say “we don't have that design” again.
          </h2>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/catalogue"
              className="rounded-full bg-gold px-8 py-4 text-sm font-medium text-black transition-colors duration-150 ease-luxe hover:bg-gold-light">
              
              Explore Catalogue
            </Link>
            <Link
              to="/supplier/dashboard"
              className="rounded-full border border-gold-pale px-8 py-4 text-sm font-medium text-charcoal transition-colors duration-150 ease-luxe hover:border-gold hover:text-gold-light">
              
              List as a Supplier
            </Link>
          </div>
        </div>
      </section>
    </>);

}