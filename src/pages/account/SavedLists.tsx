import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderPlusIcon, HeartIcon, PencilIcon, Share2Icon, Trash2Icon, XIcon } from 'lucide-react';
import { DashboardShell, accountNav } from '../../components/DashboardShell';
import { ProductImageFallback } from '../../components/ProductCard';
import { EmptyState, inputClass, primaryButton } from '../../components/ui';
import { useApp } from '../../contexts/AppContext';
import { formatDate, formatWeight } from '../../lib/format';
import { useCatalogue } from '../../lib/queries';

export function SavedLists() {
  const { lists, createList, renameList, deleteList, setListItem, updateListNote, notify } = useApp();
  const { byId } = useCatalogue();
  const [activeId, setActiveId] = useState('');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', occasion: '' });
  const active = lists.find((l) => l.id === activeId) ?? lists[0];
  const [note, setNote] = useState('');

  useEffect(() => setNote(active?.note ?? ''), [active?.id, active?.note]);

  const share = async () => {
    if (!active) return;
    const lines = active.productIds
      .map((id) => byId(id))
      .filter(Boolean)
      .map((p) => `• ${p!.name} — ${window.location.origin}/product/${p!.slug}`);
    const text = `${active.name}\n${lines.join('\n')}`;
    try {
      if (navigator.share) await navigator.share({ title: active.name, text });
      else {
        await navigator.clipboard.writeText(text);
        notify('List copied — paste it anywhere to share');
      }
    } catch {
      // Share sheet dismissed.
    }
  };

  return (
    <DashboardShell
      eyebrow="Shortlists & occasions"
      title="My Lists"
      subtitle="Group pieces for a wedding, an anniversary or a gift, and add notes."
      nav={accountNav}
      actions={
        <button type="button" onClick={() => setCreating(true)} className={primaryButton}>
          <FolderPlusIcon className="h-4 w-4" /> New list
        </button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside>
          {creating && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!form.name.trim()) return;
                const list = await createList(form.name.trim(), form.occasion.trim());
                if (list) setActiveId(list.id);
                setForm({ name: '', occasion: '' });
                setCreating(false);
              }}
              className="mb-4 space-y-3 rounded-xl border border-gold-pale bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-charcoal">New list</p>
                <button type="button" onClick={() => setCreating(false)} aria-label="Cancel">
                  <XIcon className="h-4 w-4 text-charcoal-faint" />
                </button>
              </div>
              <input
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="List name, e.g. Wedding shortlist"
                aria-label="List name"
                className={inputClass}
              />
              <input
                value={form.occasion}
                onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                placeholder="Occasion (optional)"
                aria-label="Occasion"
                className={inputClass}
              />
              <button type="submit" className={`w-full ${primaryButton} py-2.5`}>
                Create list
              </button>
            </form>
          )}

          <ul className="no-scrollbar flex gap-2 overflow-x-auto lg:block lg:space-y-2">
            {lists.map((l) => (
              <li key={l.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveId(l.id)}
                  className={`w-full min-w-[180px] rounded-xl border px-4 py-3.5 text-left transition-colors duration-150 ease-luxe ${
                    active?.id === l.id ? 'border-gold bg-white shadow-card' : 'border-line bg-white/60 hover:border-gold'
                  }`}
                >
                  <span className="block font-display text-lg leading-tight text-charcoal">{l.name}</span>
                  <span className="mt-1 block text-xs text-charcoal-muted">
                    {[l.occasion, `${l.productIds.length} pieces`].filter(Boolean).join(' · ')}
                  </span>
                  <span className="mt-1 block text-[11px] text-charcoal-faint">Updated {formatDate(l.updatedAt)}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {!active ? (
          <EmptyState
            title="No lists yet"
            text="Create a list, then use “Save to a list” on any piece to add it."
            action={
              <button type="button" onClick={() => setCreating(true)} className={primaryButton}>
                Create your first list
              </button>
            }
          />
        ) : (
          <section className="min-w-0">
            <div className="rounded-2xl border border-line bg-white p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  {active.occasion && <p className="eyebrow text-gold">{active.occasion}</p>}
                  <h2 className="mt-2 font-display text-3xl text-charcoal sm:text-4xl">{active.name}</h2>
                  <p className="mt-2 text-sm text-charcoal-muted">{active.productIds.length} pieces</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <IconAction
                    icon={PencilIcon}
                    label="Rename"
                    onClick={() => {
                      const next = window.prompt('Rename list', active.name);
                      if (next && next.trim()) renameList(active.id, next.trim());
                    }}
                  />
                  <IconAction icon={Share2Icon} label="Share" onClick={share} />
                  <IconAction
                    icon={Trash2Icon}
                    label="Delete"
                    onClick={() => {
                      if (!window.confirm(`Delete “${active.name}”?`)) return;
                      deleteList(active.id);
                      setActiveId('');
                    }}
                  />
                </div>
              </div>

              <label className="mt-6 block">
                <span className="mb-1.5 block text-xs font-medium text-charcoal-muted">Notes</span>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onBlur={() => note !== active.note && updateListNote(active.id, note)}
                  placeholder="Budget, sizes, who it's for…"
                  className={`${inputClass} h-auto resize-none py-2.5`}
                />
              </label>
            </div>

            {active.productIds.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-line bg-white px-8 py-16 text-center">
                <HeartIcon className="mx-auto h-6 w-6 text-gold" />
                <h3 className="mt-4 font-display text-2xl text-charcoal">Nothing here yet</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-charcoal-muted">
                  Browse the collection and use “Save to a list” on any piece.
                </p>
                <Link to="/catalogue" className={`mt-6 ${primaryButton}`}>
                  Explore the collection
                </Link>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {active.productIds.map((pid) => {
                  const p = byId(pid);
                  if (!p) return null;
                  return (
                    <article
                      key={pid}
                      className="group overflow-hidden rounded-xl border border-line bg-white shadow-card transition-shadow duration-200 ease-luxe hover:shadow-lift"
                    >
                      <div className="relative aspect-square overflow-hidden bg-ivory-deep">
                        <Link to={`/product/${p.slug}`}>
                          {p.images[0] ? (
                            <img
                              src={p.images[0].url}
                              alt={p.name}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-[400ms] ease-luxe group-hover:scale-105"
                            />
                          ) : (
                            <ProductImageFallback className="h-full w-full" />
                          )}
                        </Link>
                        <button
                          type="button"
                          onClick={() => setListItem(active.id, pid, false)}
                          aria-label={`Remove ${p.name} from list`}
                          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-charcoal-muted shadow-card transition-opacity duration-150 ease-luxe hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="p-4">
                        <p className="text-[11px] text-charcoal-faint">{p.sku}</p>
                        <h4 className="mt-1 line-clamp-2 font-display text-base leading-snug text-charcoal">{p.name}</h4>
                        <p className="mt-1 text-xs text-charcoal-muted">
                          {[p.purity, formatWeight(p)].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </DashboardShell>
  );
}

function IconAction({
  icon: Icon,
  label,
  onClick
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-xs font-medium text-charcoal-soft transition-colors duration-150 ease-luxe hover:border-gold hover:text-charcoal"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
