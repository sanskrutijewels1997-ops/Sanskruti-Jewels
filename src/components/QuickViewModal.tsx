import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatPrice, formatWeight } from '../lib/format';
import { useCatalogue } from '../lib/queries';
import { Modal } from './Modal';
import { ProductImageFallback } from './ProductCard';

export function QuickViewModal() {
  const { quickView: product, setQuickView, isWishlisted, toggleWishlist, openEnquiry } = useApp();
  const { categoryName } = useCatalogue();
  const [active, setActive] = useState(0);

  useEffect(() => setActive(0), [product?.id]);

  return (
    <Modal
      open={!!product}
      onClose={() => setQuickView(null)}
      label={`Quick view: ${product?.name ?? ''}`}
      className="max-w-4xl"
    >
      {product && (
        <div className="grid md:grid-cols-2">
          <div className="bg-ivory-deep p-5">
            <div className="overflow-hidden rounded-xl bg-white">
              {product.images[active] ? (
                <img src={product.images[active].url} alt={product.name} className="aspect-square w-full object-cover" />
              ) : (
                <ProductImageFallback className="aspect-square w-full" />
              )}
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`h-16 w-16 overflow-hidden rounded-lg border transition-colors duration-150 ease-luxe ${
                      active === i ? 'border-gold' : 'border-line hover:border-gold-light'
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col p-6 sm:p-8">
            <p className="text-xs tracking-wide text-charcoal-faint">{product.sku}</p>
            <h2 className="mt-1 pr-10 font-display text-3xl leading-tight text-charcoal">{product.name}</h2>
            <p className="mt-3 text-lg text-gold-light">{formatPrice(product) ?? 'Price on request'}</p>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-line py-5 text-sm">
              {(
                [
                  ['Category', categoryName(product.categoryId)],
                  ['Metal', product.metal],
                  ['Purity', product.purity],
                  ['Weight', formatWeight(product)],
                  ['Size', product.size],
                  ['Availability', product.availability]
                ] as const
              )
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-charcoal-faint">{k}</dt>
                    <dd className="mt-0.5 text-charcoal">{v}</dd>
                  </div>
                ))}
            </dl>

            <p className="mt-5 line-clamp-4 text-sm leading-relaxed text-charcoal-muted">{product.description}</p>

            <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row">
              <button
                type="button"
                onClick={() => openEnquiry(product)}
                className="flex-1 rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-white transition-colors duration-150 ease-luxe hover:bg-gold"
              >
                Enquire about this piece
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="flex items-center justify-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium text-charcoal transition-colors duration-150 ease-luxe hover:border-gold"
              >
                <HeartIcon className={`h-4 w-4 ${isWishlisted(product.id) ? 'fill-gold text-gold' : ''}`} />
                Wishlist
              </button>
            </div>
            <Link
              to={`/product/${product.slug}`}
              onClick={() => setQuickView(null)}
              className="mt-3 text-center text-xs font-medium tracking-wide text-charcoal-muted underline-offset-4 hover:text-gold hover:underline"
            >
              View full details →
            </Link>
          </div>
        </div>
      )}
    </Modal>
  );
}
