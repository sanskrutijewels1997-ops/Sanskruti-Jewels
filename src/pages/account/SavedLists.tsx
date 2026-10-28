import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRightIcon, FolderHeartIcon, GemIcon, PlusIcon } from 'lucide-react';
import { BottomSheet } from '../../components/BottomSheet';
import { HeaderIconButton, PageHeader } from '../../components/PageHeader';
import { EmptyState, Field, inputClass, primaryButton } from '../../components/ui';
import { useApp } from '../../contexts/AppContext';
import { formatDate } from '../../lib/format';
import { useCatalogue } from '../../lib/queries';

export function SavedLists() {
  const { lists, createList } = useApp();
  const { byId } = useCatalogue();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', occasion: '' });

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const list = await createList(form.name.trim(), form.occasion.trim());
    setCreating(false);
    setForm({ name: '', occasion: '' });
    if (list) navigate(`/lists/${list.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl lg:px-6">
      <PageHeader
        title="My Lists"
        subtitle="Shortlists for weddings, gifts and more"
        fallback="/account"
        actions={
          <HeaderIconButton label="New list" onClick={() => setCreating(true)}>
            <PlusIcon className="h-6 w-6" />
          </HeaderIconButton>
        }
      />

      {lists.length === 0 ? (
        <EmptyState
          icon={FolderHeartIcon}
          title="No lists yet"
          text="Create a list, then tap “Save to list” on any piece to add it."
          action={
            <button type="button" onClick={() => setCreating(true)} className={`w-full ${primaryButton}`}>
              Create your first list
            </button>
          }
        />
      ) : (
        <ul className="space-y-3 px-4 py-4 lg:px-0">
          {lists.map((l) => {
            const covers = l.productIds.slice(0, 3).map((id) => byId(id)?.images[0]?.url).filter(Boolean) as string[];
            return (
              <li key={l.id}>
                <Link to={`/lists/${l.id}`} className="pressable flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
                  <span className="grid h-16 w-16 shrink-0 grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-xl bg-surface-2">
                    {covers.length === 0 ? (
                      <GemIcon className="col-span-2 row-span-2 m-auto h-6 w-6 text-ink-3" />
                    ) : (
                      covers.map((u, i) => (
                        <img key={u + i} src={u} alt="" className={`h-full w-full object-cover ${i === 0 ? 'row-span-2' : ''} ${covers.length === 1 ? 'col-span-2' : ''}`} />
                      ))
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold text-ink">{l.name}</span>
                    <span className="block truncate text-xs text-ink-3">
                      {[l.occasion, `${l.productIds.length} pieces`].filter(Boolean).join(' · ')}
                    </span>
                    <span className="block text-[11px] text-ink-3">Updated {formatDate(l.updatedAt)}</span>
                  </span>
                  <ChevronRightIcon className="h-5 w-5 text-ink-3" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <BottomSheet
        open={creating}
        onClose={() => setCreating(false)}
        title="New list"
        footer={
          <button type="submit" form="new-list" className={`w-full ${primaryButton}`}>
            Create list
          </button>
        }
      >
        <form id="new-list" onSubmit={create} className="space-y-4 px-5 py-4">
          <Field label="List name">
            <input autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Wedding shortlist" className={inputClass} />
          </Field>
          <Field label="Occasion (optional)">
            <input value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })} placeholder="e.g. Wedding — Nov 2026" className={inputClass} />
          </Field>
        </form>
      </BottomSheet>
    </div>
  );
}
