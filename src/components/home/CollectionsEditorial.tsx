import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { useCatalogue } from '../../lib/queries';

export function CollectionsEditorial() {
  const { collections, published } = useCatalogue();
  if (collections.length === 0) return null;
  const count = (id: string) => published.filter((p) => p.collectionId === id).length;
  const [lead, ...rest] = collections;

  return (
    <section className="border-y border-line bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-site px-5 lg:px-10">
        <p className="eyebrow text-gold">Shop by collection</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl text-charcoal sm:text-5xl">
          Curated stories in gold and stone
        </h2>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <Link
            to={`/catalogue?collection=${encodeURIComponent(lead.slug)}`}
            className="group relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-2xl bg-ivory-deep lg:min-h-[560px]"
          >
            {lead.imageUrl && (
              <img
                src={lead.imageUrl}
                alt={lead.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[500ms] ease-luxe group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-charcoal/45" aria-hidden="true" />
            <div className="relative p-8 text-charcoal lg:p-10">
              <p className="eyebrow text-gold-light">{count(lead.id)} designs</p>
              <h3 className="mt-3 font-display text-4xl lg:text-5xl">{lead.name}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-charcoal-soft">{lead.tagline}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
                Explore collection
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 ease-luxe group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          <div className="grid gap-5 sm:grid-cols-2">
            {rest.slice(0, 4).map((c) => (
              <Link
                key={c.id}
                to={`/catalogue?collection=${encodeURIComponent(c.slug)}`}
                className="group relative flex min-h-[200px] flex-col justify-end overflow-hidden rounded-2xl bg-ivory-deep"
              >
                {c.imageUrl && (
                  <img
                    src={c.imageUrl}
                    alt={c.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[500ms] ease-luxe group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-charcoal/40" aria-hidden="true" />
                <div className="relative p-6 text-charcoal">
                  <h3 className="font-display text-2xl">{c.name}</h3>
                  <p className="mt-1 text-xs text-gold-light">{count(c.id)} designs</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {collections.length > 5 && (
          <div className="mt-8 text-center">
            <Link to="/collections" className="text-sm font-medium text-charcoal underline-offset-4 hover:text-gold hover:underline">
              See all {collections.length} collections
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
