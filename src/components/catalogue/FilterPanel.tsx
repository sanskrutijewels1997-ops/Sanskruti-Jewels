import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { availabilities, metals, purities, styles } from '../../data/options';
import type { Category, Collection } from '../../types';

export interface Filters {
  categories: string[];
  collections: string[];
  metals: string[];
  purities: string[];
  styles: string[];
  availability: string[];
  maxWeight: number;
  newOnly: boolean;
}

export const MAX_WEIGHT = 120;

export const emptyFilters: Filters = {
  categories: [],
  collections: [],
  metals: [],
  purities: [],
  styles: [],
  availability: [],
  maxWeight: MAX_WEIGHT,
  newOnly: false
};

export function activeFilterCount(f: Filters) {
  return (
    f.categories.length +
    f.collections.length +
    f.metals.length +
    f.purities.length +
    f.styles.length +
    f.availability.length +
    (f.maxWeight < MAX_WEIGHT ? 1 : 0) +
    (f.newOnly ? 1 : 0)
  );
}

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
  categories: Category[];
  collections: Collection[];
}

function Group({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group border-b border-line py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between">
        <span className="eyebrow text-charcoal">{title}</span>
        <ChevronDownIcon className="h-4 w-4 text-charcoal-faint transition-transform duration-200 ease-luxe group-open:rotate-180" />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

function Check({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm text-charcoal-soft transition-colors duration-150 ease-luxe hover:text-charcoal">
      <input type="checkbox" checked={checked} onChange={onToggle} className="h-4 w-4 rounded border-line" />
      <span className="flex-1">{label}</span>
    </label>
  );
}

type ListKey = 'categories' | 'collections' | 'metals' | 'purities' | 'styles' | 'availability';

export function FilterPanel({ filters, onChange, onReset, categories, collections }: Props) {
  const toggle = (key: ListKey, value: string) => {
    const list = filters[key];
    onChange({ ...filters, [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] });
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <h2 className="font-display text-2xl text-charcoal">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-charcoal-muted underline-offset-4 hover:text-gold hover:underline"
        >
          Clear all
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 border-y border-line py-4">
        <span className="text-sm font-medium text-charcoal" id="new-only-label">
          New Arrivals only
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={filters.newOnly}
          aria-labelledby="new-only-label"
          onClick={() => onChange({ ...filters, newOnly: !filters.newOnly })}
          className={`relative h-6 w-11 rounded-full transition-colors duration-150 ease-luxe ${filters.newOnly ? 'bg-gold' : 'bg-ivory-dark'}`}
        >
          <span
            className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-charcoal-soft shadow-card transition-transform duration-200 ease-luxe ${
              filters.newOnly ? 'translate-x-[22px]' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      <Group title="Category">
        <div className="max-h-64 overflow-y-auto thin-scrollbar pr-1">
          {categories.map((c) => (
            <Check key={c.id} label={c.name} checked={filters.categories.includes(c.slug)} onToggle={() => toggle('categories', c.slug)} />
          ))}
        </div>
      </Group>

      {collections.length > 0 && (
        <Group title="Collection" defaultOpen={filters.collections.length > 0}>
          {collections.map((c) => (
            <Check key={c.id} label={c.name} checked={filters.collections.includes(c.slug)} onToggle={() => toggle('collections', c.slug)} />
          ))}
        </Group>
      )}

      <Group title="Metal">
        {metals.map((m) => (
          <Check key={m} label={m} checked={filters.metals.includes(m)} onToggle={() => toggle('metals', m)} />
        ))}
      </Group>

      <Group title="Purity">
        <div className="flex flex-wrap gap-2">
          {purities.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => toggle('purities', p)}
              aria-pressed={filters.purities.includes(p)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 ease-luxe ${
                filters.purities.includes(p)
                  ? 'border-charcoal bg-charcoal text-white'
                  : 'border-line bg-white text-charcoal-soft hover:border-gold'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Style" defaultOpen={false}>
        {styles.map((s) => (
          <Check key={s} label={s} checked={filters.styles.includes(s)} onToggle={() => toggle('styles', s)} />
        ))}
      </Group>

      <Group title="Weight">
        <label className="block">
          <span className="mb-3 block text-sm text-charcoal-soft">
            Up to <strong className="font-medium text-charcoal">{filters.maxWeight} g</strong>
          </span>
          <input
            type="range"
            min={2}
            max={MAX_WEIGHT}
            step={2}
            value={filters.maxWeight}
            onChange={(e) => onChange({ ...filters, maxWeight: Number(e.target.value) })}
            className="w-full"
            aria-label="Maximum weight in grams"
          />
          <span className="mt-1 flex justify-between text-[11px] text-charcoal-faint">
            <span>2 g</span>
            <span>{MAX_WEIGHT} g+</span>
          </span>
        </label>
      </Group>

      <Group title="Availability">
        {availabilities.map((a) => (
          <Check key={a} label={a} checked={filters.availability.includes(a)} onToggle={() => toggle('availability', a)} />
        ))}
      </Group>
    </div>
  );
}
