import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, CheckIcon } from 'lucide-react';
import { useCatalogue } from '../../lib/queries';

const trust = ['BIS Hallmarked Gold', 'Certified Diamonds', 'Custom Orders Welcome', 'Lifetime Exchange'];

export function Hero() {
  const { published, categories } = useCatalogue();

  return (
    <section className="relative overflow-hidden border-b border-line bg-ivory">
      <div className="mx-auto grid max-w-site items-center gap-10 px-5 py-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:px-10 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="eyebrow text-gold">Heritage · Handcrafted · Hallmarked</p>
          <h1 className="mt-5 font-display text-[2.6rem] font-medium leading-[1.05] tracking-tight text-charcoal sm:text-6xl lg:text-[4.25rem]">
            Jewellery that carries
            <br />
            your story forward
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-charcoal-muted sm:text-lg">
            Discover bridal sets, everyday gold and certified diamonds from Sanskruti Jewels.
            Save the pieces you love and enquire for today's price.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/catalogue"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-8 py-4 text-sm font-medium text-white transition-colors duration-150 ease-luxe hover:bg-gold"
            >
              Explore the collection
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 ease-luxe group-hover:translate-x-1" />
            </Link>
            <Link
              to="/catalogue?collection=bridal"
              className="inline-flex items-center justify-center rounded-full border border-charcoal px-8 py-4 text-sm font-medium text-charcoal transition-colors duration-150 ease-luxe hover:bg-charcoal hover:text-white"
            >
              Shop Bridal
            </Link>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-7 sm:max-w-xl">
            {trust.map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm text-charcoal-soft">
                <CheckIcon className="h-4 w-4 shrink-0 text-gold" />
                {t}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.08 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-2xl shadow-lift">
            <img
              src="/images/hero.jpg"
              alt="Bride wearing an opulent gold and emerald jewellery set"
              className="aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
            />
          </div>
          {published.length > 0 && (
            <div className="absolute -bottom-5 left-5 hidden rounded-xl border border-line bg-white/95 px-5 py-4 shadow-panel backdrop-blur sm:block lg:-left-8">
              <p className="font-display text-3xl text-charcoal">{published.length.toLocaleString('en-IN')}</p>
              <p className="eyebrow mt-1 text-charcoal-faint">Designs to explore</p>
            </div>
          )}
          {categories.length > 0 && (
            <div className="absolute -right-4 top-6 hidden rounded-xl border border-line bg-white/95 px-5 py-4 shadow-panel backdrop-blur lg:block">
              <p className="font-display text-3xl text-charcoal">{categories.length}</p>
              <p className="eyebrow mt-1 text-charcoal-faint">Categories</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
