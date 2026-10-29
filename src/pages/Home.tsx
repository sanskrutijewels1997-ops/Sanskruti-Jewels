import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRightIcon,
  ClockIcon,
  GemIcon,
  HandshakeIcon,
  SearchIcon,
  ShieldCheckIcon,
  SmileIcon,
  SparklesIcon
} from 'lucide-react';
import { ProductRail } from '../components/home/ProductRail';
import { BrandStrip, Logo, SinceBadge } from '../components/Logo';
import { SectionHeader } from '../components/ui';
import { useApp } from '../contexts/AppContext';
import { purityShortcuts } from '../data/options';
import { BRAND } from '../data/brand';
import { useCatalogue } from '../lib/queries';

const metalTiles = [
  { metal: 'Gold', note: '22K & 18K', tone: 'from-[#f5d77a] to-[#c9962e]' },
  { metal: 'Diamond', note: 'Certified', tone: 'from-[#e8eef5] to-[#9fb2c8]' },
  { metal: 'Silver', note: '92.5 sterling', tone: 'from-[#eceae6] to-[#a9a49b]' },
  { metal: 'Platinum', note: 'PT 950', tone: 'from-[#e3e1dd] to-[#8d8a85]' }
];

export function Home() {
  const { published, topCategories, byId, loading } = useCatalogue();
  const { recentlyViewed, openEnquiry } = useApp();
  const recent = recentlyViewed
    .map((id) => byId(id))
    .filter((p): p is NonNullable<typeof p> => !!p && p.isPublished);

  return (
    <div className="mx-auto max-w-site lg:px-6">
      {/* Phone: the slogan strip stays pinned under the status bar, the logo row scrolls
          away and the search bar pins below the strip. iOS paints the status bar in the
          colour of a bar pinned at the very top; without one it blurs whatever is under
          it, which smeared the slogan at launch. */}
      <div className="pt-safe sticky top-0 z-40 bg-brand lg:hidden">
        <BrandStrip />
      </div>
      <div className="flex h-16 items-center justify-between px-4 lg:hidden">
        <Logo />
        <SinceBadge />
      </div>
      <header className="sticky top-[calc(env(safe-area-inset-top)+2rem)] z-30 bg-bg lg:hidden">
        <div className="px-4 pb-3 pt-2">
          <Link
            to="/search"
            className="pressable flex h-11 items-center gap-2.5 rounded-xl border border-line bg-surface px-3.5 text-[14px] text-ink-3"
          >
            <SearchIcon className="h-[18px] w-[18px]" />
            Search for necklaces, bangles, rings…
          </Link>
        </div>
      </header>

      <PurityShortcuts />

      {/* Story-style category circles */}
      <nav aria-label="Categories" className="no-scrollbar flex gap-4 overflow-x-auto px-4 pb-2 pt-4 lg:px-0 lg:pt-8">
        <CategoryCircle to="/catalogue?filter=new" label="New In">
          <span className="flex h-full w-full items-center justify-center bg-brand text-brand-on">
            <SparklesIcon className="h-6 w-6" />
          </span>
        </CategoryCircle>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <span key={i} className="skeleton h-[68px] w-[68px] shrink-0 rounded-full" />)
          : topCategories.map((c) => (
              <CategoryCircle key={c.id} to={`/catalogue?category=${c.slug}`} label={c.name.replace(' Jewellery', '')}>
                {c.imageUrl ? <img src={c.imageUrl} alt="" className="h-full w-full object-cover" /> : <GemIcon className="m-auto h-6 w-6 text-ink-3" />}
              </CategoryCircle>
            ))}
      </nav>

      <HeroCarousel />

      <Intro />

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

/** The two purity shortcuts customers asked for, right at the top of Home. */
function PurityShortcuts() {
  const { published, loading } = useCatalogue();
  return (
    <nav aria-label="Shop by purity" className="grid grid-cols-2 gap-3 px-4 pt-1 lg:mx-auto lg:max-w-3xl lg:gap-5 lg:px-0 lg:pt-8">
      {purityShortcuts.map((s, i) => {
        const count = published.filter((p) => p.purity === s.value).length;
        return (
          <Link
            key={s.value}
            to={`/catalogue?purity=${encodeURIComponent(s.value)}`}
            className={`pressable relative flex h-[88px] flex-col justify-between overflow-hidden rounded-2xl p-3.5 text-black shadow-card lg:h-28 lg:p-5 ${
              i === 0 ? 'bg-gradient-to-br from-[#f7e3a3] to-[#d4a23f]' : 'bg-gradient-to-br from-[#f3d27a] to-[#b98318]'
            }`}
          >
            <GemIcon className="absolute -right-3 -top-3 h-16 w-16 opacity-15" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] opacity-70">Shop</span>
            <span>
              <span className="block font-display text-[26px] font-bold leading-none lg:text-4xl">{s.label}</span>
              <span className="mt-1 flex items-center gap-0.5 text-[11.5px] font-semibold opacity-80">
                {loading ? 'Loading…' : `${count} ${count === 1 ? 'design' : 'designs'}`}
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

const pillarIcons = [ShieldCheckIcon, ClockIcon, HandshakeIcon, SmileIcon];

/** The brand introduction: quality, punctuality, relationships, tension-free ordering. */
function Intro() {
  const { intro } = BRAND;
  const years = new Date().getFullYear() - BRAND.since;
  return (
    <section aria-labelledby="intro-title" className="px-4 pt-6 lg:px-0 lg:pt-12">
      <div className="overflow-hidden rounded-2xl border border-gold-pale bg-surface shadow-card lg:grid lg:grid-cols-[1.15fr_1fr]">
        <div className="p-5 lg:p-10">
          <p className="eyebrow flex items-center gap-2 text-gold">
            <span className="h-px w-6 bg-gold" aria-hidden="true" /> Since {BRAND.since} · {years} years of trust
          </p>
          <h2 id="intro-title" className="mt-3 font-display text-[26px] font-semibold leading-tight text-ink lg:text-4xl">
            {intro.title}
          </h2>
          {intro.paragraphs.map((p) => (
            <p key={p.slice(0, 20)} className="mt-3 text-[14px] leading-relaxed text-ink-2 lg:text-base">
              {p}
            </p>
          ))}
        </div>
        <ul className="grid grid-cols-2 gap-px bg-gold-pale/60 lg:content-stretch">
          {intro.pillars.map((pillar, i) => {
            const Icon = pillarIcons[i % pillarIcons.length];
            return (
              <li key={pillar.title} className="flex flex-col bg-gold-wash p-4 lg:justify-center lg:p-6">
                <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                <p className="mt-2 text-[14px] font-semibold text-ink">{pillar.title}</p>
                <p className="mt-0.5 text-[12px] leading-snug text-ink-2">{pillar.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
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
  const { topCategories } = useCatalogue();
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const slides = [
    {
      key: 'hero',
      to: '/catalogue',
      image: '/images/hero.jpg',
      eyebrow: 'Handcrafted since 1977',
      title: 'Heirlooms for your big day',
      cta: 'Explore designs'
    },
    // Then a few main categories that have a photo
    ...topCategories
      .filter((c) => c.imageUrl)
      .slice(0, 4)
      .map((c) => ({
        key: c.id,
        to: `/catalogue?category=${c.slug}`,
        image: c.imageUrl as string,
        eyebrow: 'Shop by category',
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
