import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FolderPlusIcon,
  HeartIcon,
  MessageCircleIcon,
  PencilIcon,
  RefreshCwIcon,
  Share2Icon,
  ShieldCheckIcon,
  TruckIcon
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { BRAND } from '../data/brand';
import { api } from '../lib/api';
import { formatPrice, formatWeight } from '../lib/format';
import { useCatalogue } from '../lib/queries';
import { ProductCard, ProductImageFallback } from '../components/ProductCard';
import { PageLoader, primaryButton } from '../components/ui';

export function ProductDetail() {
  const { slug } = useParams();
  const { products, loading, categoryName, collectionName, byId } = useCatalogue();
  const { isAdmin } = useAuth();
  const { isWishlisted, toggleWishlist, openEnquiry, openListPicker, markViewed, recentlyViewed, notify } = useApp();
  const product = products.find((p) => p.slug === slug && (p.isPublished || isAdmin));

  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState({ x: 50, y: 50, on: false });

  useEffect(() => {
    if (!product) return;
    setActive(0);
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
      <div className="mx-auto max-w-site px-5 py-32 text-center lg:px-10">
        <h1 className="font-display text-4xl text-charcoal">Design not found</h1>
        <p className="mt-3 text-charcoal-muted">This piece is no longer in our collection.</p>
        <Link to="/catalogue" className={`mt-8 ${primaryButton}`}>
          Back to the collection
        </Link>
      </div>
    );
  }

  const price = formatPrice(product);
  const category = categoryName(product.categoryId);
  const collection = collectionName(product.collectionId);
  const published = products.filter((p) => p.isPublished);
  const similar = published
    .filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.collectionId === product.collectionId))
    .slice(0, 4);
  const recent = recentlyViewed
    .filter((r) => r !== product.id)
    .map((r) => byId(r))
    .filter((p): p is NonNullable<typeof p> => !!p && p.isPublished)
    .slice(0, 4);

  const quickFacts = (
    [
      ['Category', category],
      ['Metal', product.metal],
      ['Purity', product.purity],
      ['Approx. weight', formatWeight(product)],
      ['Size / length', product.size],
      ['Availability', product.availability]
    ] as const
  ).filter(([, v]) => v);

  const specs = [
    ['SKU', product.sku],
    ['Collection', collection],
    ['Style', product.style],
    ['Metal & purity', `${product.metal} · ${product.purity}`],
    ['Weight', formatWeight(product)],
    ['Stones', product.stone],
    ...product.specifications.map((s) => [s.label, s.value] as const)
  ].filter(([, v]) => v);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: product.name, url });
      else {
        await navigator.clipboard.writeText(url);
        notify('Link copied');
      }
    } catch {
      // User dismissed the share sheet.
    }
  };

  return (
    <div className="bg-ivory">
      <nav className="mx-auto flex max-w-site flex-wrap items-center gap-y-1 px-5 pt-6 text-xs text-charcoal-faint lg:px-10" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-charcoal">Home</Link>
        <span className="px-2">/</span>
        <Link to="/catalogue" className="hover:text-charcoal">Collection</Link>
        {category && (
          <>
            <span className="px-2">/</span>
            <span className="text-charcoal-soft">{category}</span>
          </>
        )}
        {isAdmin && (
          <Link
            to={`/admin/products/${product.id}`}
            className="ml-auto flex items-center gap-1.5 rounded-full border border-gold-pale px-3 py-1 text-gold-light hover:border-gold"
          >
            <PencilIcon className="h-3 w-3" /> Edit product
          </Link>
        )}
      </nav>

      <div className="mx-auto grid max-w-site gap-8 px-5 py-8 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:py-12">
        <div>
          <div
            className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-white"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, on: true });
            }}
            onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
          >
            {product.images[active] ? (
              <img
                src={product.images[active].url}
                alt={`${product.name} — image ${active + 1}`}
                style={{
                  transformOrigin: `${zoom.x}% ${zoom.y}%`,
                  transform: zoom.on ? 'scale(1.9)' : 'scale(1)'
                }}
                className="h-full w-full object-cover transition-transform duration-300 ease-luxe"
              />
            ) : (
              <ProductImageFallback className="h-full w-full" />
            )}
            {product.images.length > 0 && (
              <span className="pointer-events-none absolute bottom-4 left-4 hidden rounded-full bg-white/90 px-3 py-1.5 text-[11px] text-charcoal-soft md:block">
                Hover to zoom
              </span>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={active === i}
                  className={`overflow-hidden rounded-xl border bg-white transition-colors duration-150 ease-luxe ${
                    active === i ? 'border-gold' : 'border-line hover:border-gold-light'
                  }`}
                >
                  <img src={img.url} alt="" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            {!product.isPublished && (
              <span className="eyebrow rounded-full bg-red-900/80 px-3 py-1.5 text-[10px] text-red-100">Draft — hidden from customers</span>
            )}
            {product.isNew && (
              <span className="eyebrow rounded-full bg-charcoal px-3 py-1.5 text-[10px] text-white">New Arrival</span>
            )}
            <span className="eyebrow rounded-full border border-line bg-white px-3 py-1.5 text-[10px] text-charcoal-soft">
              {product.availability}
            </span>
          </div>

          <p className="mt-5 text-xs tracking-wide text-charcoal-faint">SKU · {product.sku}</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-charcoal sm:text-5xl">{product.name}</h1>

          <div className="mt-5">
            {price ? (
              <>
                <p className="font-display text-3xl text-gold-light">{price}</p>
                <p className="mt-1 text-xs text-charcoal-faint">
                  Indicative price. Final price depends on the gold rate on the day of purchase.
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-2xl text-charcoal">Price on request</p>
                <p className="mt-1 text-xs text-charcoal-faint">
                  Gold prices change daily — enquire and we'll share today's price.
                </p>
              </>
            )}
          </div>

          <dl className="mt-7 grid grid-cols-2 gap-x-8 gap-y-5 border-y border-line py-6 text-sm sm:grid-cols-3">
            {quickFacts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-charcoal-faint">{k}</dt>
                <dd className="mt-1 text-charcoal">{v}</dd>
              </div>
            ))}
            {product.stone && (
              <div className="col-span-2 sm:col-span-3">
                <dt className="text-xs text-charcoal-faint">Stone details</dt>
                <dd className="mt-1 text-charcoal">{product.stone}</dd>
              </div>
            )}
          </dl>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => openEnquiry(product)}
              className="flex-1 rounded-full bg-charcoal px-6 py-4 text-sm font-medium text-white transition-colors duration-150 ease-luxe hover:bg-gold"
            >
              Enquire about this piece
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-pressed={isWishlisted(product.id)}
              className="flex items-center justify-center gap-2 rounded-full border border-line bg-white px-6 py-4 text-sm font-medium text-charcoal transition-colors duration-150 ease-luxe hover:border-gold"
            >
              <HeartIcon className={`h-4 w-4 ${isWishlisted(product.id) ? 'fill-gold text-gold' : ''}`} />
              {isWishlisted(product.id) ? 'In wishlist' : 'Add to wishlist'}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            <button
              type="button"
              onClick={() => openListPicker(product)}
              className="flex items-center gap-2 py-2 text-sm text-charcoal-muted hover:text-gold"
            >
              <FolderPlusIcon className="h-4 w-4" /> Save to a list
            </button>
            <button type="button" onClick={share} className="flex items-center gap-2 py-2 text-sm text-charcoal-muted hover:text-gold">
              <Share2Icon className="h-4 w-4" /> Share
            </button>
            {BRAND.whatsapp && (
              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name} (${product.sku}) ${window.location.href}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 py-2 text-sm text-charcoal-muted hover:text-gold"
              >
                <MessageCircleIcon className="h-4 w-4" /> WhatsApp
              </a>
            )}
          </div>

          <ul className="mt-8 grid gap-3 rounded-2xl border border-gold-pale bg-gold-wash p-5 text-sm text-charcoal-soft sm:grid-cols-3">
            <li className="flex items-center gap-2">
              <ShieldCheckIcon className="h-4 w-4 shrink-0 text-gold" /> Certified purity
            </li>
            <li className="flex items-center gap-2">
              <RefreshCwIcon className="h-4 w-4 shrink-0 text-gold" /> Lifetime exchange
            </li>
            <li className="flex items-center gap-2">
              <TruckIcon className="h-4 w-4 shrink-0 text-gold" /> Insured delivery
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-site px-5 pb-6 lg:px-10">
        <div className="grid gap-8 rounded-2xl border border-line bg-white p-6 lg:grid-cols-2 lg:p-10">
          <section>
            <h2 className="font-display text-2xl text-charcoal">Description</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-charcoal-muted">
              {product.description || 'Details coming soon.'}
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-charcoal">Specifications</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {specs.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 border-b border-line pb-2.5">
                  <dt className="text-charcoal-faint">{k}</dt>
                  <dd className="text-right text-charcoal">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      {[
        { title: 'You may also like', list: similar },
        { title: 'Recently viewed', list: recent }
      ].map(
        (s) =>
          s.list.length > 0 && (
            <section key={s.title} className="mx-auto max-w-site px-5 py-12 lg:px-10">
              <h2 className="font-display text-3xl text-charcoal">{s.title}</h2>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
                {s.list.map((p) => (
                  <ProductCard key={p.id} product={p} categoryName={categoryName(p.categoryId)} />
                ))}
              </div>
            </section>
          )
      )}
    </div>
  );
}
