import { SparklesIcon, TrendingUpIcon } from 'lucide-react';
import { Hero } from '../components/home/Hero';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { ProductRail } from '../components/home/ProductRail';
import { CollectionsEditorial } from '../components/home/CollectionsEditorial';
import { WhyUs } from '../components/home/WhyUs';
import { useApp } from '../contexts/AppContext';
import { useCatalogue } from '../lib/queries';
import { BRAND } from '../data/brand';

export function Home() {
  const { published } = useCatalogue();
  const { openEnquiry } = useApp();

  return (
    <>
      <Hero />
      <CategoryGrid />
      <ProductRail
        eyebrow={
          <>
            <SparklesIcon className="h-3.5 w-3.5" /> Just added
          </>
        }
        title="New Arrivals"
        text="The latest pieces from our karigars."
        products={published.filter((p) => p.isNew).slice(0, 12)}
        viewAllTo="/catalogue?filter=new"
        viewAllLabel="View all new arrivals"
      />
      <ProductRail
        tone="page"
        eyebrow={
          <>
            <TrendingUpIcon className="h-3.5 w-3.5" /> Loved by our customers
          </>
        }
        title="Featured Pieces"
        products={published.filter((p) => p.isFeatured).slice(0, 12)}
        viewAllTo="/catalogue?sort=popular"
        viewAllLabel="See what's popular"
      />
      <CollectionsEditorial />
      <WhyUs />

      <section className="border-t border-gold-pale bg-black py-20">
        <div className="mx-auto max-w-site px-5 text-center lg:px-10">
          <img src={BRAND.logo} alt={BRAND.name} className="mx-auto h-24 w-24 object-contain" />
          <p className="eyebrow mt-5 text-gold-light">{BRAND.slogan}</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl text-charcoal sm:text-5xl">
            Looking for something special? Tell us and we'll make it for you.
          </h2>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => openEnquiry(null)}
              className="rounded-full bg-gold px-8 py-4 text-sm font-medium text-black transition-colors duration-150 ease-luxe hover:bg-gold-light"
            >
              Request a custom design
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
