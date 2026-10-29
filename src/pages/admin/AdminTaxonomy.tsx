import React, { useState } from 'react';
import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { DashboardShell, adminNav } from '../../components/DashboardShell';
import { ImageUploader, useCleanupUnsavedUploads, type UploadedImage } from '../../components/admin/ImageUploader';
import { BottomSheet } from '../../components/BottomSheet';
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
  /** Categories only: set for sub-categories. */
  parentId: string | null;
}

/** Shared CRUD screen for categories and collections — they differ only by the tagline. */
export function AdminTaxonomy({ kind }: { kind: Kind }) {
  const { categories, collections, products, loading } = useCatalogue();
  const [editing, setEditing] = useState<Item | null>(null);
  const { notify } = useApp();
  const queryClient = useQueryClient();
  const isCollections = kind === 'collections';
  const singular = isCollections ? 'collection' : 'category';

  // Categories: each main category followed by its sub-categories.
  const items: Item[] = isCollections
    ? collections.map((c) => ({ ...c, parentId: null }))
    : categories
        .filter((c) => !c.parentId)
        .flatMap((c) => [c, ...categories.filter((s) => s.parentId === c.id)])
        .map((c) => ({ ...c, tagline: '' }));
  const childrenOf = (id?: string) => items.filter((i) => id && i.parentId === id);
  const usage = (id?: string) =>
    products.filter((p) => (isCollections ? p.collectionId : p.categoryId) === id).length;

  const remove = async (item: Item) => {
    const subs = childrenOf(item.id);
    const n = usage(item.id) + subs.reduce((sum, s) => sum + usage(s.id), 0);
    const warn =
      (subs.length ? ` Its ${subs.length} sub-categor${subs.length > 1 ? 'ies' : 'y'} will be deleted too.` : '') +
      (n ? ` ${n} product${n > 1 ? 's' : ''} will be left without a ${singular}.` : '');
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
          : 'Main categories and their sub-categories, e.g. Rings › Gents Rings.'
      }
      nav={adminNav}
      actions={
        <button
          type="button"
          onClick={() =>
            setEditing({ slug: '', name: '', tagline: '', imageUrl: null, sortOrder: items.length, parentId: null })
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
        <ul className={isCollections ? 'grid gap-3 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-2'}>
          {items.map((item) => (
            <li
              key={item.id}
              className={`flex items-center gap-4 rounded-xl border border-line bg-surface p-3 ${
                item.parentId ? 'ml-8 border-dashed' : ''
              }`}
            >
              <div className={`${item.parentId ? 'h-11 w-11' : 'h-16 w-16'} shrink-0 overflow-hidden rounded-lg`}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ProductImageFallback className="h-full w-full" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{item.name}</p>
                <p className="text-xs text-ink-3">
                  {!item.parentId && childrenOf(item.id).length > 0 && `${childrenOf(item.id).length} types · `}
                  {usage(item.id)} {usage(item.id) === 1 ? 'product' : 'products'}
                </p>
              </div>
              {!isCollections && !item.parentId && (
                <button
                  type="button"
                  onClick={() =>
                    setEditing({ slug: '', name: '', tagline: '', imageUrl: null, sortOrder: items.length, parentId: item.id ?? null })
                  }
                  aria-label={`Add sub-category to ${item.name}`}
                  title="Add sub-category"
                  className="rounded-full p-2 text-ink-2 hover:bg-gold-wash hover:text-brand"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setEditing(item)}
                aria-label={`Edit ${item.name}`}
                className="rounded-full p-2 text-ink-2 hover:bg-gold-wash hover:text-brand"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(item)}
                aria-label={`Delete ${item.name}`}
                className="rounded-full p-2 text-ink-2 hover:bg-danger/10 hover:text-danger"
              >
                <Trash2Icon className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <BottomSheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? `Edit ${editing.name}` : editing?.parentId ? 'New sub-category' : `New ${singular}`}
        className="sm:max-w-lg"
      >
        {editing && (
          <TaxonomyForm
            key={editing.id ?? 'new'}
            item={editing}
            kind={kind}
            onDone={() => setEditing(null)}
          />
        )}
      </BottomSheet>
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
  const { categories } = useCatalogue();
  // Only main categories can be parents, and a category that has sub-categories stays a main one.
  const parentOptions = categories.filter((c) => !c.parentId && c.id !== item.id);
  const hasChildren = !!item.id && categories.some((c) => c.parentId === item.id);
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
      else await api.saveCategory({ ...base, parentId: form.parentId || null });
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
    <form onSubmit={save} className="space-y-4 px-5 py-4">
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
      {!isCollections && (
        <Field
          label="Parent category"
          hint={hasChildren ? 'This category has sub-categories, so it stays a main category.' : 'Leave as “None” for a main category.'}
        >
          <select
            value={form.parentId ?? ''}
            disabled={hasChildren}
            onChange={(e) => setForm({ ...form, parentId: e.target.value || null })}
            className={inputClass}
          >
            <option value="">None (main category)</option>
            {parentOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      )}
      {isCollections && (
        <Field label="Tagline">
          <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={inputClass} />
        </Field>
      )}
      <div>
        <p className="mb-1.5 text-xs font-medium text-ink-2">Cover image</p>
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
