import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  FolderPlusIcon,
  GemIcon,
  HeartIcon,
  MessageCircleIcon,
  HammerIcon,
  PackageIcon,
  PencilIcon,
  RefreshCwIcon,
  ScaleIcon,
  Share2Icon,
  ShieldCheckIcon,
  SparklesIcon,
  TruckIcon
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { BRAND } from '../data/brand';
import { api } from '../lib/api';
import { formatPrice, formatWeight } from '../lib/format';
import { useCatalogue } from '../lib/queries';
import { ProductRail } from '../components/home/ProductRail';
import { ProductImageFallback } from '../components/ProductCard';
import { useGoBack } from '../components/PageHeader';
import { EmptyState, PageLoader, primaryButton } from '../components/ui';
import type { Product } from '../types';

export function ProductDetail() {
  const { slug } = useParams();
  const { products, categories, loading, categoryName, categoryPath, collectionName, byId } = useCatalogue();
  const { isAdmin } = useAuth();
  const { isWishlisted, toggleWishlist, openEnquiry, openListPicker, markViewed, recentlyViewed, notify } = useApp();
  const goBack = useGoBack('/catalogue');
  const product = products.find((p) => p.slug === slug && (p.isPublished || isAdmin));

  useEffect(() => {
    if (!product) return;
    markViewed(product.id);
    void api.recordView(product.id);
    document.title = `${product.name} · ${BRAND.name}`;
    return () => {
      document.title = BRAND.name;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  if (loading) return <PageLoader />;

  if (!product) {
    return (
      <EmptyState
        icon={GemIcon}
        title="Design not found"
        text="This piece is no longer in our collection."
        action={
          <Link to="/catalogue" className={`w-full ${primaryButton}`}>
            Browse jewellery
          </Link>
        }
      />
    );
  }

  const saved = isWishlisted(product.id);
  const price = formatPrice(product);
  const category = categoryName(product.categoryId);
  const categorySlug = categories.find((c) => c.id === product.categoryId)?.slug;
  const published = products.filter((p) => p.isPublished);
  const similar = published
    .filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.collectionId === product.collectionId))
    .slice(0, 10);
  const recent = recentlyViewed
    .filter((r) => r !== product.id)
    .map((r) => byId(r))
    .filter((p): p is NonNullable<typeof p> => !!p && p.isPublished)
    .slice(0, 10);

  const grams = (v: number | null) => (v === null ? '' : `${v} g`);
  const range = product.weightMin !== null || product.weightMax !== null ? formatWeight({ weightMin: product.weightMin, weightMax: product.weightMax }) : '';
  // Core trade specs first, then the optional details.
  const specs = [
    ['Product category', categoryPath(product.categoryId)],
    ['Make', product.make],
    ['Purity', product.purity],
    ['Gross weight', grams(product.grossWeight)],
    ['Stone weight', grams(product.stoneWeight)],
    ['Net weight', grams(product.netWeight)],
    ['Qty', product.quantity === null ? '' : String(product.quantity)],
    ['SKU', product.sku],
    ['Collection', collectionName(product.collectionId)],
    ['Style', product.style],
    ['Metal', product.metal],
    ['Weight range', product.grossWeight === null ? range : ''],
    ['Size / length', product.size],
    ['Stones', product.stone],
    ['Availability', product.availability],
    ...product.specifications.map((s) => [s.label, s.value] as const)
  ].filter(([, v]) => v);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: product.name, text: `${product.name} — ${BRAND.name}`, url });
      else {
        await navigator.clipboard.writeText(url);
        notify('Link copied');
      }
    } catch {
      // Share sheet dismissed.
    }
  };

  const floating = 'pressable flex h-10 w-10 items-center justify-center rounded-full bg-surface/90 text-ink shadow-card backdrop-blur';

  return (
    <div className="mx-auto max-w-site pb-[calc(76px+env(safe-area-inset-bottom))] lg:px-6 lg:pb-10 lg:pt-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-12">
        <div className="relative lg:sticky lg:top-24 lg:self-start">
          <Gallery product={product} />
          {/* Floating app-bar buttons over the photo (phones) */}
          <div className="pt-safe pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3 lg:hidden">
            <button type="button" onClick={goBack} aria-label="Back" className={`pointer-events-auto ${floating}`}>
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <div className="pointer-events-auto flex gap-2">
              <button type="button" onClick={share} aria-label="Share" className={floating}>
                <Share2Icon className="h-[18px] w-[18px]" />
              </button>
              <button type="button" onClick={() => toggleWishlist(product.id)} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={saved} className={floating}>
                <HeartIcon className={`h-[18px] w-[18px] ${saved ? 'fill-brand text-brand' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 pt-4 lg:px-0 lg:pt-0">
          <div className="flex flex-wrap items-center gap-1.5">
            {!product.isPublished && <Badge tone="danger">Draft — hidden</Badge>}
            {product.isNew && <Badge tone="brand">New arrival</Badge>}
            <Badge>{product.availability}</Badge>
            {isAdmin && (
              <Link to={`/admin/products/${product.id}`} className="ml-auto flex items-center gap-1 text-xs font-semibold text-brand">
                <PencilIcon className="h-3.5 w-3.5" /> Edit
              </Link>
            )}
          </div>

          {category && <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-ink-3">{category}</p>}
          <h1 className="mt-1 font-display text-[28px] font-semibold leading-tight text-ink lg:text-5xl">{product.name}</h1>
          <p className="mt-1 text-xs text-ink-3">SKU {product.sku}</p>

          <div className="mt-4 border-b border-line pb-4">
            {price ? (
              <>
                <p className="text-2xl font-bold text-ink">{price}</p>
                <p className="mt-0.5 text-[11.5px] text-ink-3">Indicative price · final price depends on the day's gold rate</p>
              </>
            ) : (
              <button
                type="button"
                onClick={() => openEnquiry(product)}
                className="pressable flex w-full items-center gap-3 rounded-xl bg-gold-wash p-3 text-left"
              >
                <SparklesIcon className="h-5 w-5 shrink-0 text-gold" />
                <span className="flex-1">
                  <span className="block text-[15px] font-semibold text-ink">Price on request</span>
                  <span className="block text-xs text-ink-2">Gold rates change daily — tap to get today's price</span>
                </span>
              </button>
            )}
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-2.5">
            {(
              [
                [GemIcon, 'Purity', product.purity],
                [ScaleIcon, 'Gross weight', grams(product.grossWeight) || formatWeight(product)],
                [ScaleIcon, 'Net weight', grams(product.netWeight)],
                [SparklesIcon, 'Stone weight', grams(product.stoneWeight)],
                [HammerIcon, 'Make', product.make],
                [PackageIcon, 'Qty', product.quantity === null ? '' : String(product.quantity)]
              ] as const
            )
              .filter(([, , v]) => v)
              .map(([Icon, k, v]) => (
                <div key={k} className="rounded-xl border border-line bg-surface p-3">
                  <dt className="flex items-center gap-1.5 text-[11px] font-medium text-ink-3">
                    <Icon className="h-3.5 w-3.5" /> {k}
                  </dt>
                  <dd className="mt-1 line-clamp-2 text-[13px] font-semibold text-ink">{v}</dd>
                </div>
              ))}
          </dl>

          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => openListPicker(product)} className="pressable flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-line text-[13px] font-semibold text-ink">
              <FolderPlusIcon className="h-4 w-4" /> Save to list
            </button>
            {BRAND.whatsapp && (
              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name} (${product.sku}) ${window.location.href}`)}`}
                target="_blank"
                rel="noreferrer"
                className="pressable flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-line text-[13px] font-semibold text-ink"
              >
                <MessageCircleIcon className="h-4 w-4 text-success" /> WhatsApp
              </a>
            )}
            <button type="button" onClick={share} className="pressable hidden h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-line text-[13px] font-semibold text-ink lg:flex">
              <Share2Icon className="h-4 w-4" /> Share
            </button>
          </div>

          <div className="mt-5 divide-y divide-line border-y border-line">
            <Accordion title="Product details">
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink-2">{product.description || 'Details coming soon.'}</p>
            </Accordion>
            <Accordion title="Specifications" defaultOpen>
              <dl className="space-y-2.5 text-sm">
                {specs.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6">
                    <dt className="text-ink-3">{k}</dt>
                    <dd className="text-right font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </Accordion>
            <Accordion title="Our promise">
              <ul className="grid grid-cols-3 gap-2 text-center text-[11.5px] text-ink-2">
                {(
                  [
                    [ShieldCheckIcon, 'Certified purity'],
                    [RefreshCwIcon, 'Lifetime exchange'],
                    [TruckIcon, 'Insured delivery']
                  ] as const
                ).map(([Icon, label]) => (
                  <li key={label} className="flex flex-col items-center gap-1.5 rounded-xl bg-surface-2 px-2 py-3">
                    <Icon className="h-5 w-5 text-gold" /> {label}
                  </li>
                ))}
              </ul>
            </Accordion>
          </div>

          {/* Desktop: actions inline. Phones: the sticky bar below. */}
          <div className="mt-6 hidden gap-3 lg:flex">
            <ActionButtons saved={saved} onWishlist={() => toggleWishlist(product.id)} onEnquire={() => openEnquiry(product)} />
          </div>
        </div>
      </div>

      <ProductRail
        title="You may also like"
        products={similar}
        viewAllTo={categorySlug ? `/catalogue?category=${categorySlug}` : '/catalogue'}
      />
      {recent.length > 0 && <ProductRail title="Recently viewed" products={recent} viewAllTo="/catalogue" />}

      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t border-line bg-surface px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:hidden">
        <ActionButtons saved={saved} onWishlist={() => toggleWishlist(product.id)} onEnquire={() => openEnquiry(product)} />
      </div>
    </div>
  );
}

function ActionButtons({ saved, onWishlist, onEnquire }: { saved: boolean; onWishlist: () => void; onEnquire: () => void }) {
  return (
    <>
      <button
        type="button"
        onClick={onWishlist}
        aria-pressed={saved}
        className="pressable flex h-12 flex-[0.85] items-center justify-center gap-2 rounded-xl border border-line text-[13px] font-bold uppercase tracking-wide text-ink"
      >
        <HeartIcon className={`h-[18px] w-[18px] ${saved ? 'fill-brand text-brand' : ''}`} />
        {saved ? 'Wishlisted' : 'Wishlist'}
      </button>
      <button
        type="button"
        onClick={onEnquire}
        className="pressable flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand text-[13px] font-bold uppercase tracking-wide text-brand-on"
      >
        <MessageCircleIcon className="h-[18px] w-[18px]" /> Enquire now
      </button>
    </>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone?: 'brand' | 'danger' }) {
  const cls =
    tone === 'brand' ? 'bg-brand text-brand-on' : tone === 'danger' ? 'bg-danger text-white' : 'bg-surface-2 text-ink-2';
  return <span className={`rounded-md px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wider ${cls}`}>{children}</span>;
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[15px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDownIcon className="h-5 w-5 text-ink-3 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="pb-4">{children}</div>
    </details>
  );
}

/** Edge-to-edge swipe gallery with dots on phones; adds thumbnails and hover zoom on desktop. */
function Gallery({ product }: { product: Product }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const images = product.images;

  useEffect(() => {
    setIndex(0);
    trackRef.current?.scrollTo({ left: 0 });
  }, [product.id]);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  if (images.length === 0) return <ProductImageFallback className="aspect-square w-full lg:rounded-2xl" />;

  return (
    <div>
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto bg-surface-2 lg:rounded-2xl"
          aria-roledescription="carousel"
          aria-label={`${product.name} photos`}
        >
          {images.map((img, i) => (
            <img
              key={img.id}
              src={img.url}
              alt={`${product.name} — photo ${i + 1} of ${images.length}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="aspect-square w-full shrink-0 snap-center object-cover"
            />
          ))}
        </div>
        {images.length > 1 && (
          <>
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden="true">
              {images.map((img, i) => (
                <span key={img.id} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/55'}`} />
              ))}
            </div>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white">
              {index + 1}/{images.length}
            </span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 hidden gap-2 lg:flex">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`h-20 w-20 overflow-hidden rounded-xl border-2 ${i === index ? 'border-brand' : 'border-transparent'}`}
            >
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
