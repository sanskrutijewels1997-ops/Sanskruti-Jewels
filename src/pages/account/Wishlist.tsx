import { Link } from 'react-router-dom';
import { HeartIcon, XIcon } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { ProductCard, ProductCardSkeleton, ProductGrid } from '../../components/ProductCard';
import { EmptyState, primaryButton, secondaryButton } from '../../components/ui';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCatalogue } from '../../lib/queries';

/** Wishlist tab. Guests see a sign-in prompt in place instead of being redirected. */
export function Wishlist() {
  const { user, loading: authLoading } = useAuth();
  const { wishlist, toggleWishlist, openEnquiry } = useApp();
  const { byId, categoryName, loading } = useCatalogue();
  const items = wishlist.map((id) => byId(id)).filter((p): p is NonNullable<typeof p> => !!p && p.isPublished);

  return (
    <div className="mx-auto max-w-site lg:px-6">
      <PageHeader
        title="Wishlist"
        subtitle={user ? `${items.length} ${items.length === 1 ? 'item' : 'items'}` : undefined}
        back={false}
        large
      />
      {!user && !authLoading ? (
        <EmptyState
          icon={HeartIcon}
          title="Save the pieces you love"
          text="Sign in to keep your wishlist across your phone and the web."
          action={
            <div className="space-y-2">
              <Link to="/login?next=/wishlist" className={`w-full ${primaryButton}`}>
                Sign in
              </Link>
              <Link to="/register?next=/wishlist" className={`w-full ${secondaryButton}`}>
                Create account
              </Link>
            </div>
          }
        />
      ) : loading || authLoading ? (
        <div className="pt-4">
          <ProductGrid>
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </ProductGrid>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={HeartIcon}
          title="Your wishlist is empty"
          text="Tap the ♡ on any piece to save it here."
          action={
            <Link to="/catalogue" className={`w-full ${primaryButton}`}>
              Explore jewellery
            </Link>
          }
        />
      ) : (
        <div className="pb-6 pt-4">
          <ProductGrid>
            {items.map((p) => (
              <div key={p.id} className="relative flex flex-col">
                <ProductCard product={p} categoryName={categoryName(p.categoryId)} />
                {/* Myntra-style: an X to remove and a primary action under each card */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(p.id)}
                  aria-label={`Remove ${p.name} from wishlist`}
                  className="pressable absolute left-1.5 top-1.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-ink-2 shadow-card"
                >
                  <XIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => openEnquiry(p)}
                  className="pressable mt-2 h-9 rounded-lg border border-line text-[12px] font-bold uppercase tracking-wide text-brand"
                >
                  Enquire
                </button>
              </div>
            ))}
          </ProductGrid>
        </div>
      )}
    </div>
  );
}
