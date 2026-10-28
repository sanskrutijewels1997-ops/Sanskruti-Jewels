import { useState } from 'react';
import { CheckCircle2Icon, CircleIcon, PlusIcon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { BottomSheet } from './BottomSheet';
import { inputClass } from './ui';

export function ListPickerSheet() {
  const { listPicker: product, closeListPicker, lists, setListItem, createList } = useApp();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');

  const close = () => {
    closeListPicker();
    setCreating(false);
    setName('');
  };

  return (
    <BottomSheet open={!!product} onClose={close} title="Save to a list">
      {product && (
        <div className="px-5 py-4">
          <div className="flex items-center gap-3">
            {product.images[0] && <img src={product.images[0].url} alt="" className="h-12 w-12 rounded-lg object-cover" />}
            <p className="line-clamp-2 text-sm font-medium text-ink">{product.name}</p>
          </div>

          <ul className="mt-4 divide-y divide-line">
            {lists.length === 0 && (
              <li className="py-4 text-sm text-ink-3">Group pieces into lists — “Wedding shortlist”, “Anniversary ideas”…</li>
            )}
            {lists.map((l) => {
              const has = l.productIds.includes(product.id);
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => setListItem(l.id, product.id, !has)}
                    aria-pressed={has}
                    className="pressable flex w-full items-center gap-3 py-3.5 text-left"
                  >
                    {has ? <CheckCircle2Icon className="h-5 w-5 shrink-0 text-brand" /> : <CircleIcon className="h-5 w-5 shrink-0 text-ink-3" />}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium text-ink">{l.name}</span>
                      <span className="block text-xs text-ink-3">{l.productIds.length} pieces</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {creating ? (
            <form
              className="mt-3 flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!name.trim()) return;
                const list = await createList(name.trim(), '');
                if (list) setListItem(list.id, product.id, true);
                setName('');
                setCreating(false);
              }}
            >
              <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="List name" aria-label="New list name" className={inputClass} />
              <button type="submit" className="pressable shrink-0 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-on">
                Create
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="pressable mt-3 flex w-full items-center gap-3 py-3 text-[15px] font-semibold text-brand"
            >
              <PlusIcon className="h-5 w-5" /> New list
            </button>
          )}
        </div>
      )}
    </BottomSheet>
  );
}
