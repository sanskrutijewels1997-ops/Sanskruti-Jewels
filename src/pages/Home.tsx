import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRightIcon,
  GemIcon,
  RefreshCwIcon,
  SearchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TruckIcon
} from 'lucide-react';
import { ProductRail } from '../components/home/ProductRail';
import { Logo } from '../components/Logo';
import { SectionHeader } from '../components/ui';
import { useApp } from '../contexts/AppContext';
import { useCatalogue } from '../lib/queries';

const metalTiles = [
  { metal: 'Gold', note: '22K & 18K', tone: 'from-[#f5d77a] to-[#c9962e]' },
  { metal: 'Diamond', note: 'Certified', tone: 'from-[#e8eef5] to-[#9fb2c8]' },
  { metal: 'Silver', note: '92.5 sterling', tone: 'from-[#eceae6] to-[#a9a49b]' },
  { metal: 'Platinum', note: 'PT 950', tone: 'from-[#e3e1dd] to-[#8d8a85]' }
];

const promises = [
  { icon: ShieldCheckIcon, label: 'BIS Hallmarked' },
  { icon: GemIcon, label: 'Certified diamonds' },
  { icon: RefreshCwIcon, label: 'Lifetime exchange' },
  { icon: TruckIcon, label: 'Insured delivery' }
];

export function Home() {
  const { published, categories, collections, byId, loading } = useCatalogue();
  const { recentlyViewed, openEnquiry } = useApp();
  const recent = recentlyViewed
    .map((id) => byId(id))
    .filter((p): p is NonNullable<typeof p> => !!p && p.isPublished);

  return (
    <div className="mx-auto max-w-site lg:px-6">
      {/* Phone app bar: logo + tap-to-search, like Myntra / CaratLane */}
      <header className="pt-safe sticky top-0 z-30 bg-bg/95 backdrop-blur-md lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Logo size="sm" />
        </div>
        <div className="px-4 pb-3">
          <Link
            to="/search"
            className="pressable flex h-11 items-center gap-2.5 rounded-xl border border-line bg-surface px-3.5 text-[14px] text-ink-3"
          >
            <SearchIcon className="h-[18px] w-[18px]" />
            Search for necklaces, bangles, rings…
          </Link>
        </div>
      </header>

      {/* Story-style category circles */}
      <nav aria-label="Categories" className="no-scrollbar flex gap-4 overflow-x-auto px-4 pb-2 pt-2 lg:px-0 lg:pt-8">
        <CategoryCircle to="/catalogue?filter=new" label="New In">
          <span className="flex h-full w-full items-center justify-center bg-brand text-brand-on">
            <SparklesIcon className="h-6 w-6" />
          </span>
        </CategoryCircle>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <span key={i} className="skeleton h-[68px] w-[68px] shrink-0 rounded-full" />)
          : categories.map((c) => (
              <CategoryCircle key={c.id} to={`/catalogue?category=${c.slug}`} label={c.name.replace(' Jewellery', '')}>
                {c.imageUrl ? <img src={c.imageUrl} alt="" className="h-full w-full object-cover" /> : <GemIcon className="m-auto h-6 w-6 text-ink-3" />}
              </CategoryCircle>
            ))}
      </nav>

      <HeroCarousel />

      <ul className="no-scrollbar mt-5 flex gap-2 overflow-x-auto px-4 lg:px-0" aria-label="Our promise">
        {promises.map(({ icon: Icon, label }) => (
          <li key={label} className="flex shrink-0 items-center gap-1.5 rounded-full bg-gold-wash px-3 py-1.5 text-[11.5px] font-medium text-ink-2">
            <Icon className="h-3.5 w-3.5 text-gold" /> {label}
          </li>
        ))}
      </ul>

      <ProductRail
        title="New Arrivals"
        subtitle="Fresh from our karigars"
        products={published.filter((p) => p.isNew).slice(0, 12)}
        viewAllTo="/catalogue?filter=new"
      />

      <section className="py-6 lg:py-10">
        <SectionHeader title="Shop by Metal" />
        <div className="mt-4 grid grid-cols-4 gap-2.5 px-4 lg:gap-5 lg:px-0">
          {metalTiles.map((m) => (
            <Link
              key={m.metal}
              to={`/catalogue?metal=${m.metal}`}
              className={`pressable flex aspect-[3/4] flex-col justify-end rounded-xl bg-gradient-to-br p-2.5 text-black ${m.tone} lg:aspect-[16/9] lg:p-5`}
            >
              <span className="text-[13px] font-bold lg:text-lg">{m.metal}</span>
              <span className="text-[10px] opacity-70 lg:text-xs">{m.note}</span>
            </Link>
          ))}
        </div>
      </section>

      {collections.length > 0 && (
        <section className="py-6 lg:py-10">
          <SectionHeader
            title="Curated Collections"
            action={
              <Link to="/collections" className="flex shrink-0 items-center text-[13px] font-semibold text-brand">
                All <ChevronRightIcon className="h-4 w-4" />
              </Link>
            }
          />
          <div className="mt-4 grid grid-cols-2 gap-3 px-4 lg:grid-cols-3 lg:gap-5 lg:px-0">
            {collections.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                to={`/catalogue?collection=${c.slug}`}
                className="pressable relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl bg-surface-2 lg:aspect-[4/3]"
              >
                {c.imageUrl && <img src={c.imageUrl} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden="true" />
                <span className="relative p-3 text-white lg:p-5">
                  <span className="block font-display text-lg font-semibold leading-tight lg:text-2xl">{c.name}</span>
                  <span className="mt-0.5 block text-[11px] opacity-80">
                    {published.filter((p) => p.collectionId === c.id).length} designs
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <ProductRail
        title="Trending Now"
        subtitle="Most-loved by our customers"
        products={published.filter((p) => p.isFeatured).slice(0, 12)}
        viewAllTo="/catalogue?sort=popular"
      />

      {recent.length > 0 && (
        <ProductRail title="Recently Viewed" products={recent.slice(0, 10)} viewAllTo="/catalogue" />
      )}

      <section className="px-4 py-6 lg:px-0 lg:py-10">
        <div className="relative overflow-hidden rounded-2xl bg-brand p-6 text-brand-on lg:p-10">
          <GemIcon className="absolute -right-6 -top-6 h-32 w-32 opacity-10" aria-hidden="true" />
          <p className="eyebrow opacity-80">Made just for you</p>
          <h2 className="mt-2 max-w-xs font-display text-2xl font-semibold leading-tight lg:max-w-md lg:text-4xl">
            Have a design in mind? We'll craft it.
          </h2>
          <button
            type="button"
            onClick={() => openEnquiry(null)}
            className="pressable mt-5 h-11 rounded-xl bg-brand-on px-5 text-sm font-semibold text-brand"
          >
            Request a custom design
          </button>
        </div>
      </section>

      <p className="pb-6 text-center text-[11px] text-ink-3 lg:hidden">Sanskruti Jewels · {published.length} designs to explore</p>
    </div>
  );
}

function CategoryCircle({ to, label, children }: { to: string; label: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="pressable flex w-[68px] shrink-0 flex-col items-center gap-1.5 lg:w-20">
      <span className="flex h-[68px] w-[68px] overflow-hidden rounded-full border-2 border-gold-pale bg-surface-2 p-0.5 lg:h-20 lg:w-20">
        <span className="flex h-full w-full overflow-hidden rounded-full">{children}</span>
      </span>
      <span className="w-full truncate text-center text-[11px] font-medium text-ink-2">{label}</span>
    </Link>
  );
}

/** Swipeable promo banners that auto-advance, with page dots. */
function HeroCarousel() {
  const { collections } = useCatalogue();
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const slides = [
    {
      key: 'hero',
      to: '/catalogue?collection=bridal',
      image: '/images/hero.jpg',
      eyebrow: 'The Bridal Edit',
      title: 'Heirlooms for your big day',
      cta: 'Shop bridal'
    },
    ...collections
      .filter((c) => c.imageUrl && c.slug !== 'bridal')
      .slice(0, 4)
      .map((c) => ({
        key: c.id,
        to: `/catalogue?collection=${c.slug}`,
        image: c.imageUrl as string,
        eyebrow: 'Collection',
        title: c.name,
        cta: 'Explore'
      }))
  ];

  useEffect(() => {
    const el = trackRef.current;
    if (!el || slides.length < 2) return;
    const t = window.setInterval(() => {
      const next = (Math.round(el.scrollLeft / el.clientWidth) + 1) % slides.length;
      el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
    }, 5000);
    return () => window.clearInterval(t);
  }, [slides.length]);

  return (
    <div className="relative mt-3 lg:mt-6">
      <div
        ref={trackRef}
        onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
        aria-roledescription="carousel"
      >
        {slides.map((s) => (
          <Link key={s.key} to={s.to} className="w-full shrink-0 snap-center px-4 lg:px-0">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-surface-2 lg:aspect-[21/8]">
              <img src={s.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <span className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" aria-hidden="true" />
              <span className="absolute inset-y-0 left-0 flex max-w-[70%] flex-col justify-end p-5 text-white lg:justify-center lg:p-12">
                <span className="eyebrow text-[10px] text-[#f1d89a]">{s.eyebrow}</span>
                <span className="mt-1.5 font-display text-[26px] font-semibold leading-[1.1] lg:text-5xl">{s.title}</span>
                <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-black">
                  {s.cta} <ChevronRightIcon className="h-3.5 w-3.5" />
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="mt-2.5 flex justify-center gap-1.5" aria-hidden="true">
          {slides.map((s, i) => (
            <span key={s.key} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-brand' : 'w-1.5 bg-surface-3'}`} />
          ))}
        </div>
      )}
    </div>
  );
}
