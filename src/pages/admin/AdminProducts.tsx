import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, PencilIcon, PlusIcon, SearchIcon, Trash2Icon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { DashboardShell, adminNav } from '../../components/DashboardShell';
import { ProductImageFallback } from '../../components/ProductCard';
import { EmptyState, ErrorNotice, PageLoader, inputClass, primaryButton } from '../../components/ui';
import { useApp } from '../../contexts/AppContext';
import { api } from '../../lib/api';
import { formatPrice, friendlyError } from '../../lib/format';
import { qk, useCatalogue } from '../../lib/queries';
import type { Product } from '../../types';

type StatusFilter = 'all' | 'published' | 'draft';

export function AdminProducts() {
  const { products, categories, categoryName, loading, error } = useCatalogue();
  const { notify } = useApp();
  const queryClient = useQueryClient();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [category, setCategory] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter((p) => {
      if (status === 'published' && !p.isPublished) return false;
      if (status === 'draft' && p.isPublished) return false;
      if (category && p.categoryId !== category) return false;
      return !needle || `${p.name} ${p.sku}`.toLowerCase().includes(needle);
    });
  }, [products, q, status, category]);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: qk.products });
    queryClient.invalidateQueries({ queryKey: qk.stats });
  };

  const togglePublish = async (p: Product) => {
    setBusyId(p.id);
    try {
      await api.saveProduct({
        ...p,
        isPublished: !p.isPublished,
        images: p.images.map((i) => ({ url: i.url, storagePath: i.storagePath }))
      });
      notify(p.isPublished ? `“${p.name}” hidden from the store` : `“${p.name}” is now live`);
      refresh();
    } catch (e) {
      notify(friendlyError(e), 'error');
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (p: Product) => {
    if (!window.confirm(`Delete “${p.name}” permanently? Its images will be deleted too.`)) return;
    setBusyId(p.id);
    try {
      await api.deleteProduct(p.id);
      notify('Product deleted', 'info');
      refresh();
    } catch (e) {
      notify(friendlyError(e), 'error');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardShell
      eyebrow="Catalogue"
      title="Products"
      subtitle={`${products.length} total · ${products.filter((p) => p.isPublished).length} published`}
      nav={adminNav}
      actions={
        <Link to="/admin/products/new" className={primaryButton}>
          <PlusIcon className="h-4 w-4" /> Add product
        </Link>
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or SKU" aria-label="Search products" className={`${inputClass} pl-9`} />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category" className={`${inputClass} sm:w-48`}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)} aria-label="Filter by status" className={`${inputClass} sm:w-36`}>
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      <div className="mt-6">
        {loading ? (
          <PageLoader />
        ) : error ? (
          <ErrorNotice error={error} />
        ) : list.length === 0 ? (
          <EmptyState
            title={products.length ? 'No products match' : 'No products yet'}
            action={
              !products.length && (
                <Link to="/admin/products/new" className={primaryButton}>
                  Add your first product
                </Link>
              )
            }
          />
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
            {list.map((p) => (
              <li key={p.id} className={`flex items-center gap-3 p-3 sm:gap-4 sm:p-4 ${busyId === p.id ? 'opacity-50' : ''}`}>
                <Link to={`/admin/products/${p.id}`} className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                  {p.images[0] ? (
                    <img src={p.images[0].url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ProductImageFallback className="h-full w-full" />
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/admin/products/${p.id}`} className="block truncate font-medium text-ink hover:text-brand">
                    {p.name}
                  </Link>
                  <p className="mt-0.5 truncate text-xs text-ink-3">
                    {[p.sku, categoryName(p.categoryId), p.purity, p.quantity === null ? 'Qty not set' : `Qty ${p.quantity}`, p.isFeatured ? 'Trending' : '', formatPrice(p) ?? 'On request'].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <span
                  className={`hidden rounded-full px-2.5 py-1 text-[11px] font-medium sm:inline ${
                    p.isPublished ? 'bg-success/15 text-success' : 'bg-surface-3 text-ink-2'
                  }`}
                >
                  {p.isPublished ? 'Live' : 'Draft'}
                </span>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    disabled={busyId === p.id}
                    onClick={() => togglePublish(p)}
                    aria-label={p.isPublished ? 'Unpublish' : 'Publish'}
                    title={p.isPublished ? 'Unpublish' : 'Publish'}
                    className="rounded-full p-2 text-ink-2 hover:bg-gold-wash hover:text-brand"
                  >
                    {p.isPublished ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
                  </button>
                  <Link to={`/admin/products/${p.id}`} aria-label="Edit" title="Edit" className="rounded-full p-2 text-ink-2 hover:bg-gold-wash hover:text-brand">
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    disabled={busyId === p.id}
                    onClick={() => remove(p)}
                    aria-label="Delete"
                    title="Delete"
                    className="rounded-full p-2 text-ink-2 hover:bg-danger/10 hover:text-danger"
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardShell>
  );
}
