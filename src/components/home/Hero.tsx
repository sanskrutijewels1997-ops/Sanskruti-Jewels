import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, CheckIcon } from 'lucide-react';
import { IMG } from '../../data/images';

const trust = ['Verified Suppliers', 'Fresh Designs Added Daily', 'B2B Exclusive', 'Secure Sourcing'];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-ivory">
      <div className="mx-auto grid max-w-site items-center gap-10 px-5 py-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:px-10 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}>
          
          <p className="eyebrow text-gold">Sell More. Stock Less.</p>
          <h1 className="mt-5 font-display text-[2.75rem] font-medium leading-[1.05] tracking-tight text-charcoal sm:text-6xl lg:text-[4.25rem]">
            India's B2B Jewellery
            <br />
            Sourcing Marketplace
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-charcoal-muted sm:text-lg">
            Access thousands of jewellery designs from verified suppliers. Discover,
            shortlist, quote and source jewellery — all in one place.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/catalogue"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-8 py-4 text-sm font-medium text-white transition-colors duration-150 ease-luxe hover:bg-gold">
              
              Explore Catalogue
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 ease-luxe group-hover:translate-x-1" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-charcoal px-8 py-4 text-sm font-medium text-charcoal transition-colors duration-150 ease-luxe hover:bg-charcoal hover:text-white">
              
              Join as a Retailer
            </Link>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-7 sm:max-w-xl">
            {trust.map((t) =>
            <li key={t} className="flex items-center gap-2 text-sm text-charcoal-soft">
                <CheckIcon className="h-4 w-4 shrink-0 text-gold" />
                {t}
              </li>
            )}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.08 }}
          className="relative">
          
          <div className="overflow-hidden rounded-2xl shadow-lift">
            <img
              src={IMG.hero}
              alt="Bridal model wearing an opulent gold and emerald jewellery set"
              className="aspect-[4/3] w-full object-cover lg:aspect-[5/4]" />
            
          </div>
          <div className="absolute -bottom-5 left-5 hidden rounded-xl border border-line bg-white/95 px-5 py-4 shadow-panel backdrop-blur sm:block lg:-left-8">
            <p className="font-display text-3xl text-charcoal">12,482</p>
            <p className="eyebrow mt-1 text-charcoal-faint">Live designs</p>
          </div>
          <div className="absolute -right-4 top-6 hidden rounded-xl border border-line bg-white/95 px-5 py-4 shadow-panel backdrop-blur lg:block">
            <p className="font-display text-3xl text-charcoal">340+</p>
            <p className="eyebrow mt-1 text-charcoal-faint">Verified suppliers</p>
          </div>
        </motion.div>
      </div>
    </section>);

}