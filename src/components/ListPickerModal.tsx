import { useState } from 'react';
import { CheckIcon, PlusIcon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Modal } from './Modal';
import { inputClass } from './ui';

export function ListPickerModal() {
  const { listPicker: product, closeListPicker, lists, setListItem, createList } = useApp();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');

  const close = () => {
    closeListPicker();
    setCreating(false);
    setName('');
  };

  return (
    <Modal open={!!product} onClose={close} label="Save to a list">
      {product && (
        <div className="p-6">
          <p className="eyebrow text-gold">Save to a list</p>
          <h2 className="mt-1 pr-10 font-display text-2xl text-charcoal">{product.name}</h2>

          <ul className="mt-5 max-h-72 space-y-2 overflow-y-auto thin-scrollbar">
            {lists.length === 0 && (
              <li className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-charcoal-muted">
                Lists help you group pieces — “Wedding shortlist”, “Anniversary ideas”…
              </li>
            )}
            {lists.map((l) => {
              const has = l.productIds.includes(product.id);
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => setListItem(l.id, product.id, !has)}
                    aria-pressed={has}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors duration-150 ease-luxe ${
                      has ? 'border-gold bg-gold-wash' : 'border-line hover:border-gold'
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-medium text-charcoal">{l.name}</span>
                      <span className="block text-xs text-charcoal-muted">
                        {[l.occasion, `${l.productIds.length} pieces`].filter(Boolean).join(' · ')}
                      </span>
                    </span>
                    {has && <CheckIcon className="h-4 w-4 shrink-0 text-gold" />}
                  </button>
                </li>
              );
            })}
          </ul>

          {creating ? (
            <form
              className="mt-4 flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!name.trim()) return;
                const list = await createList(name.trim(), '');
                if (list) setListItem(list.id, product.id, true);
                setName('');
                setCreating(false);
              }}
            >
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="List name"
                aria-label="New list name"
                className={inputClass}
              />
              <button type="submit" className="shrink-0 rounded-lg bg-charcoal px-4 text-sm font-medium text-white hover:bg-gold">
                Create
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-line py-3 text-sm font-medium text-charcoal-soft transition-colors duration-150 ease-luxe hover:border-gold hover:text-gold"
            >
              <PlusIcon className="h-4 w-4" /> New list
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}
