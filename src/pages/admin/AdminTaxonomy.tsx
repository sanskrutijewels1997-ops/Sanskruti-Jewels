import React, { useState } from 'react';
import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { DashboardShell, adminNav } from '../../components/DashboardShell';
import { ImageUploader, useCleanupUnsavedUploads, type UploadedImage } from '../../components/admin/ImageUploader';
import { Modal } from '../../components/Modal';
import { ProductImageFallback } from '../../components/ProductCard';
import { EmptyState, ErrorNotice, Field, PageLoader, Spinner, inputClass, primaryButton } from '../../components/ui';
import { useApp } from '../../contexts/AppContext';
import { api } from '../../lib/api';
import { friendlyError, slugify } from '../../lib/format';
import { qk, useCatalogue } from '../../lib/queries';

type Kind = 'categories' | 'collections';

interface Item {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  imageUrl: string | null;
  sortOrder: number;
}

/** Shared CRUD screen for categories and collections — they differ only by the tagline. */
export function AdminTaxonomy({ kind }: { kind: Kind }) {
  const { categories, collections, products, loading } = useCatalogue();
  const [editing, setEditing] = useState<Item | null>(null);
  const { notify } = useApp();
  const queryClient = useQueryClient();
  const isCollections = kind === 'collections';
  const singular = isCollections ? 'collection' : 'category';

  const items: Item[] = isCollections
    ? collections
    : categories.map((c) => ({ ...c, tagline: '' }));
  const usage = (id?: string) =>
    products.filter((p) => (isCollections ? p.collectionId : p.categoryId) === id).length;

  const remove = async (item: Item) => {
    const n = usage(item.id);
    const warn = n ? ` ${n} product${n > 1 ? 's' : ''} will be left without a ${singular}.` : '';
    if (!item.id || !window.confirm(`Delete “${item.name}”?${warn}`)) return;
    try {
      await (isCollections ? api.deleteCollection(item.id) : api.deleteCategory(item.id));
      queryClient.invalidateQueries({ queryKey: isCollections ? qk.collections : qk.categories });
      queryClient.invalidateQueries({ queryKey: qk.products });
      notify(`Deleted “${item.name}”`, 'info');
    } catch (e) {
      notify(friendlyError(e), 'error');
    }
  };

  return (
    <DashboardShell
      eyebrow="Catalogue"
      title={isCollections ? 'Collections' : 'Categories'}
      subtitle={
        isCollections
          ? 'Curated groupings shown on the home page, e.g. Bridal, Everyday.'
          : 'Product types customers browse by, e.g. Necklaces, Rings.'
      }
      nav={adminNav}
      actions={
        <button
          type="button"
          onClick={() =>
            setEditing({ slug: '', name: '', tagline: '', imageUrl: null, sortOrder: items.length })
          }
          className={primaryButton}
        >
          <PlusIcon className="h-4 w-4" /> Add {singular}
        </button>
      }
    >
      {loading ? (
        <PageLoader />
      ) : items.length === 0 ? (
        <EmptyState title={`No ${kind} yet`} />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 rounded-xl border border-line bg-white p-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ProductImageFallback className="h-full w-full" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-charcoal">{item.name}</p>
                <p className="text-xs text-charcoal-faint">
                  {usage(item.id)} products · order {item.sortOrder}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditing(item)}
                aria-label={`Edit ${item.name}`}
                className="rounded-full p-2 text-charcoal-muted hover:bg-gold-wash hover:text-gold"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(item)}
                aria-label={`Delete ${item.name}`}
                className="rounded-full p-2 text-charcoal-muted hover:bg-red-950 hover:text-red-300"
              >
                <Trash2Icon className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} label={`Edit ${singular}`} className="max-w-lg">
        {editing && (
          <TaxonomyForm
            key={editing.id ?? 'new'}
            item={editing}
            kind={kind}
            onDone={() => setEditing(null)}
          />
        )}
      </Modal>
    </DashboardShell>
  );
}

function TaxonomyForm({ item, kind, onDone }: { item: Item; kind: Kind; onDone: () => void }) {
  const isCollections = kind === 'collections';
  const queryClient = useQueryClient();
  const { notify } = useApp();
  const { sessionUploads, markSaved } = useCleanupUnsavedUploads();
  const [form, setForm] = useState(item);
  const [slugTouched, setSlugTouched] = useState(!!item.id);
  const [images, setImages] = useState<UploadedImage[]>(
    item.imageUrl ? [{ url: item.imageUrl, storagePath: null }] : []
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug) {
      setError('Name and slug are required.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const base = {
        id: form.id,
        slug: form.slug,
        name: form.name.trim(),
        imageUrl: images[0]?.url ?? null,
        sortOrder: Number(form.sortOrder) || 0
      };
      if (isCollections) await api.saveCollection({ ...base, tagline: form.tagline.trim() });
      else await api.saveCategory(base);
      markSaved(images.map((i) => i.storagePath));
      queryClient.invalidateQueries({ queryKey: isCollections ? qk.collections : qk.categories });
      notify(`Saved “${base.name}”`);
      onDone();
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-4 p-6 sm:p-8">
      <h2 className="pr-10 font-display text-3xl text-charcoal">
        {item.id ? `Edit ${item.name}` : `New ${isCollections ? 'collection' : 'category'}`}
      </h2>
      <Field label="Name">
        <input
          autoFocus
          value={form.name}
          onChange={(e) =>
            setForm((f) => ({ ...f, name: e.target.value, slug: slugTouched ? f.slug : slugify(e.target.value) }))
          }
          className={inputClass}
        />
      </Field>
      <div className="grid grid-cols-[1fr_100px] gap-3">
        <Field label="URL slug">
          <input
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setForm({ ...form, slug: slugify(e.target.value) });
            }}
            className={inputClass}
          />
        </Field>
        <Field label="Order">
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
            className={inputClass}
          />
        </Field>
      </div>
      {isCollections && (
        <Field label="Tagline">
          <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={inputClass} />
        </Field>
      )}
      <div>
        <p className="mb-1.5 text-xs font-medium text-charcoal-muted">Cover image</p>
        <ImageUploader
          images={images}
          onChange={setImages}
          multiple={false}
          folder={kind}
          sessionUploads={sessionUploads}
          onError={(m) => setError(m)}
        />
      </div>
      {error && <ErrorNotice error={error} />}
      <button type="submit" disabled={busy} className={`w-full ${primaryButton}`}>
        {busy && <Spinner />} Save
      </button>
    </form>
  );
}
