import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import {
  availabilities,
  filterCategories,
  materials,
  purities,
  styles } from
'../../data/categories';
import { suppliers } from '../../data/suppliers';

export interface Filters {
  categories: string[];
  materials: string[];
  purities: string[];
  styles: string[];
  suppliers: string[];
  availability: string[];
  maxWeight: number;
  newOnly: boolean;
}

export const emptyFilters: Filters = {
  categories: [],
  materials: [],
  purities: [],
  styles: [],
  suppliers: [],
  availability: [],
  maxWeight: 120,
  newOnly: false
};

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
}

function Group({
  title,
  children,
  defaultOpen = true




}: {title: string;children: React.ReactNode;defaultOpen?: boolean;}) {
  return (
    <details open={defaultOpen} className="group border-b border-line py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between">
        <span className="eyebrow text-charcoal">{title}</span>
        <ChevronDownIcon className="h-4 w-4 text-charcoal-faint transition-transform duration-200 ease-luxe group-open:rotate-180" />
      </summary>
      <div className="mt-4">{children}</div>
    </details>);

}

function Check({
  label,
  checked,
  onToggle,
  meta





}: {label: string;checked: boolean;onToggle: () => void;meta?: string;}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm text-charcoal-soft transition-colors duration-150 ease-luxe hover:text-charcoal">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="h-4 w-4 rounded border-line text-gold focus:ring-gold" />
      
      <span className="flex-1">{label}</span>
      {meta && <span className="text-xs text-charcoal-faint">{meta}</span>}
    </label>);

}

export function FilterPanel({ filters, onChange, onReset }: Props) {
  const toggle = (key: keyof Filters, value: string) => {
    const list = filters[key] as string[];
    onChange({
      ...filters,
      [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <h2 className="font-display text-2xl text-charcoal">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-charcoal-muted underline-offset-4 hover:text-gold hover:underline">
          
          Clear all
        </button>
      </div>

      <label className="flex items-center justify-between gap-3 border-y border-line py-4">
        <span className="text-sm font-medium text-charcoal">New Arrivals only</span>
        <button
          type="button"
          role="switch"
          aria-checked={filters.newOnly}
          onClick={() => onChange({ ...filters, newOnly: !filters.newOnly })}
          className={`relative h-6 w-11 rounded-full transition-colors duration-150 ease-luxe ${
          filters.newOnly ? 'bg-gold' : 'bg-ivory-dark'}`
          }>
          
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-card transition-transform duration-200 ease-luxe ${
            filters.newOnly ? 'translate-x-[22px]' : 'translate-x-0.5'}`
            } />
          
        </button>
      </label>

      <Group title="Category">
        <div className="max-h-64 overflow-y-auto thin-scrollbar pr-1">
          {filterCategories.map((c) =>
          <Check
            key={c}
            label={c}
            checked={filters.categories.includes(c)}
            onToggle={() => toggle('categories', c)} />

          )}
        </div>
      </Group>

      <Group title="Material">
        {materials.map((m) =>
        <Check
          key={m}
          label={m}
          checked={filters.materials.includes(m)}
          onToggle={() => toggle('materials', m)} />

        )}
      </Group>

      <Group title="Purity">
        <div className="flex flex-wrap gap-2">
          {purities.map((p) =>
          <button
            key={p}
            type="button"
            onClick={() => toggle('purities', p)}
            aria-pressed={filters.purities.includes(p)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 ease-luxe ${
            filters.purities.includes(p) ?
            'border-charcoal bg-charcoal text-white' :
            'border-line bg-white text-charcoal-soft hover:border-gold'}`
            }>
            
              {p}
            </button>
          )}
        </div>
      </Group>

      <Group title="Style" defaultOpen={false}>
        {styles.map((s) =>
        <Check
          key={s}
          label={s}
          checked={filters.styles.includes(s)}
          onToggle={() => toggle('styles', s)} />

        )}
      </Group>

      <Group title="Weight range">
        <label className="block">
          <span className="mb-3 block text-sm text-charcoal-soft">
            Up to <strong className="font-medium text-charcoal">{filters.maxWeight} g</strong>
          </span>
          <input
            type="range"
            min={2}
            max={120}
            step={2}
            value={filters.maxWeight}
            onChange={(e) => onChange({ ...filters, maxWeight: Number(e.target.value) })}
            className="w-full"
            aria-label="Maximum weight in grams" />
          
          <span className="mt-1 flex justify-between text-[11px] text-charcoal-faint">
            <span>2 g</span>
            <span>120 g</span>
          </span>
        </label>
      </Group>

      <Group title="Supplier" defaultOpen={false}>
        <div className="max-h-56 overflow-y-auto thin-scrollbar pr-1">
          {suppliers.map((s) =>
          <Check
            key={s.id}
            label={s.name}
            meta={s.city}
            checked={filters.suppliers.includes(s.id)}
            onToggle={() => toggle('suppliers', s.id)} />

          )}
        </div>
      </Group>

      <Group title="Availability">
        {availabilities.map((a) =>
        <Check
          key={a}
          label={a}
          checked={filters.availability.includes(a)}
          onToggle={() => toggle('availability', a)} />

        )}
      </Group>
    </div>);

}