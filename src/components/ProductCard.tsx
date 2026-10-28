import { Link } from 'react-router-dom';
import { GemIcon, HeartIcon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatPrice, formatWeight } from '../lib/format';
import type { Product } from '../types';

export function ProductImageFallback({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-surface-2 text-ink-3 ${className}`}>
      <GemIcon className="h-10 w-10" aria-hidden="true" />
    </div>
  );
}

/** Two-up grid card in the style of shopping apps: image first, compact text, heart on the photo. */
export function ProductCard({ product, categoryName }: { product: Product; categoryName?: string }) {
  const { isWishlisted, toggleWishlist } = useApp();
  const saved = isWishlisted(product.id);
  const price = formatPrice(product);
  const cover = product.images[0]?.url;
  const meta = [product.purity, formatWeight(product)].filter(Boolean).join(' · ');

  return (
    <article className="group relative flex h-full flex-col">
      <Link
        to={`/product/${product.slug}`}
        className="pressable relative block aspect-square overflow-hidden rounded-xl bg-surface-2"
        aria-label={product.name}
      >
        {cover ? (
          <img
            src={cover}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-luxe lg:group-hover:scale-105"
          />
        ) : (
          <ProductImageFallback className="h-full w-full" />
        )}
        <span className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {!product.isPublished && (
            <span className="rounded bg-danger px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">Draft</span>
          )}
          {product.isNew && (
            <span className="rounded bg-brand px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-brand-on">New</span>
          )}
        </span>
        {product.availability === 'Made to Order' && (
          <span className="absolute bottom-2 left-2 rounded bg-surface/90 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-ink-2 backdrop-blur">
            Made to order
          </span>
        )}
      </Link>

      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        aria-pressed={saved}
        aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
        className="pressable absolute right-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 shadow-card backdrop-blur"
      >
        <HeartIcon className={`h-[18px] w-[18px] ${saved ? 'fill-brand text-brand' : 'text-ink-2'}`} />
      </button>

      <Link to={`/product/${product.slug}`} className="mt-2 block px-0.5">
        {categoryName && <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-ink-3">{categoryName}</p>}
        <h3 className="mt-0.5 line-clamp-1 text-[13.5px] font-medium leading-snug text-ink">{product.name}</h3>
        {meta && <p className="mt-0.5 truncate text-[11.5px] text-ink-3">{meta}</p>}
        <p className={`mt-1 text-[13.5px] ${price ? 'font-bold text-ink' : 'font-semibold text-gold'}`}>
          {price ?? 'Price on request'}
        </p>
      </Link>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div>
      <div className="skeleton aspect-square w-full rounded-xl" />
      <div className="skeleton mt-2 h-3 w-1/3 rounded" />
      <div className="skeleton mt-1.5 h-3.5 w-full rounded" />
      <div className="skeleton mt-1.5 h-3.5 w-1/2 rounded" />
    </div>
  );
}

/** Responsive two-column (phone) to five-column (desktop) grid. */
export function ProductGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-5 lg:px-0 xl:grid-cols-5">{children}</div>;
}
