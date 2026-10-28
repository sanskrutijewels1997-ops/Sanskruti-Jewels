import { useEffect, useMemo, useState } from 'react';
import { CheckIcon } from 'lucide-react';
import { BottomSheet } from '../BottomSheet';
import { availabilities, metals, purities, styles } from '../../data/options';
import {
  MAX_WEIGHT,
  applyFilters,
  emptyFilters,
  facetValue,
  type Filters,
  type ListFacet
} from '../../lib/filters';
import { useCatalogue } from '../../lib/queries';

type Facet = ListFacet | 'weight' | 'new';

/**
 * Full-height filter screen in the Myntra pattern: facet tabs on the left, options with
 * live result counts on the right, Clear / Apply pinned at the bottom.
 */
export function FilterSheet({
  open,
  onClose,
  value,
  q,
  onApply
}: {
  open: boolean;
  onClose: () => void;
  value: Filters;
  q: string;
  onApply: (f: Filters) => void;
}) {
  const { published, categories, collections, categoryName } = useCatalogue();
  const lookups = useMemo(() => ({ categories, collections, categoryName }), [categories, collections, categoryName]);
  const [draft, setDraft] = useState(value);
  const [facet, setFacet] = useState<Facet>('categories');

  // Start from the applied filters each time the sheet opens (not on every parent render).
  useEffect(() => {
    if (open) setDraft(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const options: Record<ListFacet, { value: string; label: string }[]> = {
    categories: categories.map((c) => ({ value: c.slug, label: c.name })),
    collections: collections.map((c) => ({ value: c.slug, label: c.name })),
    metals: metals.map((m) => ({ value: m, label: m })),
    purities: purities.map((m) => ({ value: m, label: m })),
    styles: styles.map((m) => ({ value: m, label: m })),
    availability: availabilities.map((m) => ({ value: m, label: m }))
  };

  const facets: { key: Facet; label: string; count: number }[] = [
    { key: 'categories', label: 'Category', count: draft.categories.length },
    { key: 'collections', label: 'Collection', count: draft.collections.length },
    { key: 'metals', label: 'Metal', count: draft.metals.length },
    { key: 'purities', label: 'Purity', count: draft.purities.length },
    { key: 'styles', label: 'Style', count: draft.styles.length },
    { key: 'availability', label: 'Availability', count: draft.availability.length },
    { key: 'weight', label: 'Weight', count: draft.maxWeight < MAX_WEIGHT ? 1 : 0 },
    { key: 'new', label: 'New Arrivals', count: draft.newOnly ? 1 : 0 }
  ];

  const total = applyFilters(published, draft, q, lookups).length;

  // Count for each option given every *other* selected filter.
  const counts = useMemo(() => {
    if (facet === 'weight' || facet === 'new') return new Map<string, number>();
    const base = applyFilters(published, draft, q, lookups, facet);
    const m = new Map<string, number>();
    base.forEach((p) => {
      const v = facetValue(p, facet, lookups);
      m.set(v, (m.get(v) ?? 0) + 1);
    });
    return m;
  }, [facet, published, draft, q, lookups]);

  const toggle = (f: ListFacet, v: string) =>
    setDraft((d) => ({ ...d, [f]: d[f].includes(v) ? d[f].filter((x) => x !== v) : [...d[f], v] }));

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Filters"
      full
      className="sm:max-w-2xl"
      footer={
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setDraft(emptyFilters)} className="pressable h-12 rounded-xl text-sm font-bold uppercase tracking-wide text-ink-2">
            Clear all
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="pressable h-12 rounded-xl bg-brand text-sm font-bold uppercase tracking-wide text-brand-on"
          >
            Show {total} {total === 1 ? 'item' : 'items'}
          </button>
        </div>
      }
    >
      <div className="flex h-full min-h-full">
        <ul role="tablist" aria-orientation="vertical" className="w-[38%] shrink-0 overflow-y-auto bg-surface-2 sm:w-48">
          {facets.map((f) => (
            <li key={f.key}>
              <button
                type="button"
                role="tab"
                aria-selected={facet === f.key}
                onClick={() => setFacet(f.key)}
                className={`relative flex w-full items-center justify-between gap-2 px-4 py-4 text-left text-[13.5px] ${
                  facet === f.key ? 'bg-surface font-semibold text-ink' : 'text-ink-2'
                }`}
              >
                {facet === f.key && <span className="absolute inset-y-0 left-0 w-1 bg-brand" aria-hidden="true" />}
                {f.label}
                {f.count > 0 && <span className="text-[11px] font-bold text-brand">{f.count}</span>}
              </button>
            </li>
          ))}
        </ul>

        <div className="min-w-0 flex-1 overflow-y-auto px-4 py-2" role="tabpanel">
          {facet === 'weight' ? (
            <div className="py-4">
              <p className="text-sm text-ink-2">
                Up to <strong className="text-ink">{draft.maxWeight >= MAX_WEIGHT ? 'any weight' : `${draft.maxWeight} g`}</strong>
              </p>
              <input
                type="range"
                min={2}
                max={MAX_WEIGHT}
                step={2}
                value={draft.maxWeight}
                onChange={(e) => setDraft({ ...draft, maxWeight: Number(e.target.value) })}
                className="mt-4 w-full"
                aria-label="Maximum weight in grams"
              />
              <div className="mt-1 flex justify-between text-[11px] text-ink-3">
                <span>2 g</span>
                <span>{MAX_WEIGHT} g+</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {[5, 10, 20, 50].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setDraft({ ...draft, maxWeight: w })}
                    className={`h-8 rounded-full border px-3 text-xs font-medium ${
                      draft.maxWeight === w ? 'border-brand bg-brand-soft text-brand' : 'border-line text-ink-2'
                    }`}
                  >
                    Under {w} g
                  </button>
                ))}
              </div>
            </div>
          ) : facet === 'new' ? (
            <OptionRow label="Show only new arrivals" checked={draft.newOnly} onToggle={() => setDraft({ ...draft, newOnly: !draft.newOnly })} />
          ) : (
            options[facet].map((o) => (
              <OptionRow
                key={o.value}
                label={o.label}
                count={counts.get(o.value) ?? 0}
                checked={draft[facet].includes(o.value)}
                onToggle={() => toggle(facet, o.value)}
              />
            ))
          )}
        </div>
      </div>
    </BottomSheet>
  );
}

function OptionRow({ label, count, checked, onToggle }: { label: string; count?: number; checked: boolean; onToggle: () => void }) {
  const disabled = count === 0 && !checked;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      disabled={disabled}
      className="flex w-full items-center gap-3 py-3 text-left disabled:opacity-40"
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
          checked ? 'border-brand bg-brand text-brand-on' : 'border-ink-3'
        }`}
      >
        {checked && <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />}
      </span>
      <span className={`flex-1 text-[14px] ${checked ? 'font-semibold text-ink' : 'text-ink-2'}`}>{label}</span>
      {count !== undefined && <span className="text-xs text-ink-3">{count}</span>}
    </button>
  );
}
