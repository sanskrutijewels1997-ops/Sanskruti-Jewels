import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DownloadIcon,
  FolderPlusIcon,
  HeartIcon,
  PencilIcon,
  Share2Icon,
  Trash2Icon,
  XIcon } from
'lucide-react';
import { useApp } from '../contexts/AppContext';
import { productById } from '../data/products';

export function Collections() {
  const {
    collections,
    createCollection,
    renameCollection,
    deleteCollection,
    removeFromCollection,
    updateNote,
    notify
  } = useApp();

  const [activeId, setActiveId] = useState(collections[0]?.id ?? '');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', customer: '', occasion: '' });

  const active = collections.find((c) => c.id === activeId) ?? collections[0];

  return (
    <div className="bg-ivory">
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-site px-5 py-12 lg:px-10 lg:py-14">
          <p className="eyebrow text-gold">Customer collections</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="font-display text-4xl text-charcoal sm:text-5xl">
                A private catalogue for every customer
              </h1>
              <p className="mt-3 max-w-2xl text-charcoal-muted">
                Shortlist designs while the customer is with you, add notes, and pick the
                conversation back up on their next visit.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="flex items-center gap-2 rounded-full bg-charcoal px-6 py-3.5 text-sm font-medium text-white transition-colors duration-150 ease-luxe hover:bg-gold">
              
              <FolderPlusIcon className="h-4 w-4" />
              New Collection
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-site gap-8 px-5 py-10 lg:grid-cols-[300px_1fr] lg:px-10">
        <aside>
          {creating &&
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.name.trim()) return;
              createCollection(form.name, form.customer || 'New customer', form.occasion || 'Shortlist');
              setForm({ name: '', customer: '', occasion: '' });
              setCreating(false);
            }}
            className="mb-4 space-y-3 rounded-xl border border-gold-pale bg-white p-4">
            
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-charcoal">New collection</p>
                <button type="button" onClick={() => setCreating(false)} aria-label="Cancel">
                  <XIcon className="h-4 w-4 text-charcoal-faint" />
                </button>
              </div>
              {(['name', 'customer', 'occasion'] as const).map((k) =>
            <input
              key={k}
              value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              placeholder={
              k === 'name' ? 'Collection name' : k === 'customer' ? 'Customer name' : 'Occasion'
              }
              aria-label={k}
              className="h-10 w-full rounded-lg border border-line px-3 text-sm outline-none focus:border-gold" />

            )}
              <button
              type="submit"
              className="w-full rounded-full bg-charcoal py-2.5 text-sm font-medium text-white hover:bg-gold">
              
                Create collection
              </button>
            </form>
          }

          <ul className="space-y-2">
            {collections.map((c) =>
            <li key={c.id}>
                <button
                type="button"
                onClick={() => setActiveId(c.id)}
                className={`w-full rounded-xl border px-4 py-3.5 text-left transition-colors duration-150 ease-luxe ${
                active?.id === c.id ?
                'border-charcoal bg-white shadow-card' :
                'border-line bg-white/60 hover:border-gold'}`
                }>
                
                  <span className="block font-display text-lg leading-tight text-charcoal">
                    {c.name}
                  </span>
                  <span className="mt-1 block text-xs text-charcoal-muted">
                    {c.customer} · {c.productIds.length} designs
                  </span>
                  <span className="mt-1 block text-[11px] text-charcoal-faint">
                    Updated {c.updated}
                  </span>
                </button>
              </li>
            )}
          </ul>
        </aside>

        {!active ?
        <div className="rounded-2xl border border-dashed border-line bg-white px-8 py-24 text-center">
            <h2 className="font-display text-3xl text-charcoal">No collections yet</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-charcoal-muted">
              Create your first customer collection to start shortlisting designs.
            </p>
          </div> :

        <section>
            <div className="rounded-2xl border border-line bg-white p-6 lg:p-8">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="eyebrow text-gold">{active.occasion}</p>
                  <h2 className="mt-2 font-display text-3xl text-charcoal sm:text-4xl">
                    {active.name}
                  </h2>
                  <p className="mt-2 text-sm text-charcoal-muted">
                    {active.customer} · {active.productIds.length} designs shortlisted ·{' '}
                    <span className="text-gold">{active.preference}</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <IconAction
                  icon={PencilIcon}
                  label="Rename"
                  onClick={() => {
                    const next = window.prompt('Rename collection', active.name);
                    if (next && next.trim()) renameCollection(active.id, next.trim());
                  }} />
                
                  <IconAction
                  icon={Share2Icon}
                  label="Share"
                  onClick={() => notify('Share link copied to clipboard')} />
                
                  <IconAction
                  icon={DownloadIcon}
                  label="Catalogue PDF"
                  onClick={() => notify('Preparing catalogue PDF…', 'info')} />
                
                  <IconAction
                  icon={Trash2Icon}
                  label="Delete"
                  onClick={() => {
                    deleteCollection(active.id);
                    setActiveId(collections.find((c) => c.id !== active.id)?.id ?? '');
                  }} />
                
                </div>
              </div>

              <label className="mt-6 block">
                <span className="mb-1.5 block text-xs font-medium text-charcoal-muted">
                  Customer notes
                </span>
                <textarea
                rows={2}
                value={active.note}
                onChange={(e) => updateNote(active.id, e.target.value)}
                placeholder="Budget, metal preference, delivery timelines…"
                className="w-full resize-none rounded-lg border border-line p-3 text-sm outline-none focus:border-gold" />
              
              </label>
            </div>

            {active.productIds.length === 0 ?
          <div className="mt-6 rounded-2xl border border-dashed border-line bg-white px-8 py-20 text-center">
                <HeartIcon className="mx-auto h-6 w-6 text-gold" />
                <h3 className="mt-4 font-display text-2xl text-charcoal">
                  Nothing shortlisted yet
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-charcoal-muted">
                  Browse the catalogue and use “Add to collection” on any design.
                </p>
                <Link
              to="/catalogue"
              className="mt-6 inline-block rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white hover:bg-gold">
              
                  Explore catalogue
                </Link>
              </div> :

          <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {active.productIds.map((pid) => {
              const p = productById(pid);
              if (!p) return null;
              return (
                <article
                  key={pid}
                  className="group overflow-hidden rounded-xl border border-line bg-white shadow-card transition-shadow duration-200 ease-luxe hover:shadow-lift">
                  
                      <div className="relative aspect-square overflow-hidden bg-ivory-deep">
                        <Link to={`/product/${p.id}`}>
                          <img
                        src={p.images[0]}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[400ms] ease-luxe group-hover:scale-105" />
                      
                        </Link>
                        <button
                      type="button"
                      onClick={() => removeFromCollection(active.id, pid)}
                      aria-label={`Remove ${p.name} from collection`}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-charcoal-muted opacity-0 shadow-card transition-opacity duration-150 ease-luxe hover:text-red-600 group-hover:opacity-100">
                      
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="p-4">
                        <p className="text-[11px] text-charcoal-faint">{p.id}</p>
                        <h4 className="mt-1 line-clamp-2 font-display text-base leading-snug text-charcoal">
                          {p.name}
                        </h4>
                        <p className="mt-1 text-xs text-charcoal-muted">
                          {p.purity} · {p.weightMin}–{p.weightMax} g
                        </p>
                      </div>
                    </article>);

            })}
              </div>
          }
          </section>
        }
      </div>
    </div>);

}

function IconAction({
  icon: Icon,
  label,
  onClick




}: {icon: React.ComponentType<{className?: string;}>;label: string;onClick: () => void;}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-xs font-medium text-charcoal-soft transition-colors duration-150 ease-luxe hover:border-gold hover:text-charcoal">
      
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>);

}