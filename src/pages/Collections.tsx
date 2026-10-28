import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { useCatalogue } from '../lib/queries';
import { EmptyState, PageLoader } from '../components/ui';

export function Collections() {
  const { collections, published, loading } = useCatalogue();
  if (loading) return <PageLoader />;

  return (
    <div className="bg-ivory">
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-site px-5 py-12 lg:px-10 lg:py-14">
          <p className="eyebrow text-gold">Our collections</p>
          <h1 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl">Curated stories in gold and stone</h1>
          <p className="mt-3 max-w-2xl text-charcoal-muted">
            From ceremonial bridal sets to featherlight everyday pieces — explore each collection.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-site px-5 py-10 lg:px-10">
        {collections.length === 0 ? (
          <EmptyState title="Collections coming soon" />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((c) => (
              <Link
                key={c.id}
                to={`/catalogue?collection=${encodeURIComponent(c.slug)}`}
                className="group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-2xl bg-ivory-deep"
              >
                {c.imageUrl && (
                  <img
                    src={c.imageUrl}
                    alt={c.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[500ms] ease-luxe group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-charcoal/45" aria-hidden="true" />
                <div className="relative p-7 text-charcoal">
                  <p className="eyebrow text-gold-light">
                    {published.filter((p) => p.collectionId === c.id).length} designs
                  </p>
                  <h2 className="mt-2 font-display text-3xl">{c.name}</h2>
                  {c.tagline && <p className="mt-2 text-sm text-charcoal-soft">{c.tagline}</p>}
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
                    Explore
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 ease-luxe group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
