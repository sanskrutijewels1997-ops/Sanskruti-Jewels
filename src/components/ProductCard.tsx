import { Link } from 'react-router-dom';
import { ExpandIcon, FolderPlusIcon, GemIcon, HeartIcon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatPrice, formatWeight } from '../lib/format';
import type { Product } from '../types';

export function ProductImageFallback({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-ivory-deep text-gold-pale ${className}`}>
      <GemIcon className="h-10 w-10" aria-hidden="true" />
    </div>
  );
}

export function ProductCard({ product, categoryName }: { product: Product; categoryName?: string }) {
  const { isWishlisted, toggleWishlist, setQuickView, openListPicker, openEnquiry } = useApp();
  const saved = isWishlisted(product.id);
  const price = formatPrice(product);
  const cover = product.images[0]?.url;
  const meta = [categoryName, product.purity, formatWeight(product)].filter(Boolean).join(' · ');

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition-shadow duration-200 ease-luxe hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden bg-ivory-deep">
        <Link to={`/product/${product.slug}`} aria-label={product.name}>
          {cover ? (
            <img
              src={cover}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[400ms] ease-luxe group-hover:scale-105"
            />
          ) : (
            <ProductImageFallback className="h-full w-full" />
          )}
        </Link>

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {!product.isPublished && (
            <span className="eyebrow rounded-full bg-red-900/90 px-2.5 py-1 text-[9px] text-red-100">Draft</span>
          )}
          {product.isNew && (
            <span className="eyebrow rounded-full bg-charcoal px-2.5 py-1 text-[9px] text-white">New</span>
          )}
          {product.availability === 'Made to Order' && (
            <span className="eyebrow rounded-full bg-white/95 px-2.5 py-1 text-[9px] text-charcoal-soft">
              Made to Order
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={saved}
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-charcoal-soft shadow-card transition-colors duration-150 ease-luxe hover:text-gold"
        >
          <HeartIcon className={`h-4 w-4 ${saved ? 'fill-gold text-gold' : ''}`} />
        </button>

        <div className="pointer-events-none absolute inset-x-3 bottom-3 hidden gap-2 opacity-0 transition-opacity duration-200 ease-luxe group-hover:pointer-events-auto group-hover:opacity-100 sm:flex">
          <button
            type="button"
            onClick={() => setQuickView(product)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-xs font-medium text-charcoal shadow-card transition-colors duration-150 ease-luxe hover:bg-white"
          >
            <ExpandIcon className="h-3.5 w-3.5" />
            Quick View
          </button>
          <button
            type="button"
            onClick={() => openListPicker(product)}
            aria-label="Save to a list"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-charcoal shadow-card transition-colors duration-150 ease-luxe hover:text-gold"
          >
            <FolderPlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-[11px] font-medium tracking-wide text-charcoal-faint">{product.sku}</p>
        <h3 className="mt-1 line-clamp-2 font-display text-base leading-snug text-charcoal sm:text-lg">
          <Link to={`/product/${product.slug}`} className="hover:text-gold">
            {product.name}
          </Link>
        </h3>
        {meta && <p className="mt-1.5 text-xs text-charcoal-muted">{meta}</p>}
        <p className={`mt-2 text-sm ${price ? 'font-medium text-gold-light' : 'text-charcoal-muted'}`}>
          {price ?? 'Price on request'}
        </p>

        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={() => openEnquiry(product)}
            className="w-full rounded-full border border-charcoal bg-white px-4 py-2.5 text-xs font-semibold tracking-wide text-charcoal transition-colors duration-150 ease-luxe hover:bg-charcoal hover:text-white"
          >
            Enquire
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      <div className="skeleton aspect-square w-full" />
      <div className="space-y-2 p-4">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="skeleton mt-4 h-9 w-full rounded-full" />
      </div>
    </div>
  );
}
