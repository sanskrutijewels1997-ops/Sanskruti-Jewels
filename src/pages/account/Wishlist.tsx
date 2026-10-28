import { Link } from 'react-router-dom';
import { DashboardShell, accountNav } from '../../components/DashboardShell';
import { ProductCard } from '../../components/ProductCard';
import { EmptyState, PageLoader, primaryButton } from '../../components/ui';
import { useApp } from '../../contexts/AppContext';
import { useCatalogue } from '../../lib/queries';

export function Wishlist() {
  const { wishlist } = useApp();
  const { byId, categoryName, loading } = useCatalogue();
  const items = wishlist.map((id) => byId(id)).filter((p): p is NonNullable<typeof p> => !!p && p.isPublished);

  return (
    <DashboardShell
      eyebrow="Your favourites"
      title="Wishlist"
      subtitle={`${items.length} ${items.length === 1 ? 'piece' : 'pieces'} saved`}
      nav={accountNav}
    >
      {loading ? (
        <PageLoader />
      ) : items.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          text="Tap the heart on any piece to save it here."
          action={
            <Link to="/catalogue" className={primaryButton}>
              Explore the collection
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} categoryName={categoryName(p.categoryId)} />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
