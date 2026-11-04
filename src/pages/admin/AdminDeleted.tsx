import { useState } from 'react';
import { RotateCcwIcon, Trash2Icon } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardShell, adminNav } from '../../components/DashboardShell';
import { EmptyState, ErrorNotice, PageLoader, secondaryButton } from '../../components/ui';
import { useApp } from '../../contexts/AppContext';
import { api } from '../../lib/api';
import { formatDate, friendlyError } from '../../lib/format';
import { qk } from '../../lib/queries';
import { RECOVERY_DAYS, daysLeft } from '../../lib/recovery';
import type { DeletedItem, DeletedKind } from '../../types';

const kindLabel: Record<DeletedKind, string> = { product: 'Product', category: 'Category', enquiry: 'Enquiry' };

export function AdminDeleted() {
  const q = useQuery({ queryKey: qk.deleted, queryFn: () => api.listDeleted() });

  return (
    <DashboardShell
      eyebrow="Admin"
      title="Recently deleted"
      subtitle={`Deleted products, categories and enquiries stay here for ${RECOVERY_DAYS} days, then are removed for good.`}
      nav={adminNav}
    >
      {q.isLoading ? (
        <PageLoader />
      ) : q.error ? (
        <ErrorNotice error={q.error} />
      ) : !q.data?.length ? (
        <EmptyState title="Nothing here" text="Anything you delete will appear here so you can restore it." />
      ) : (
        <ul className="space-y-3">
          {q.data.map((item) => (
            <DeletedRow key={`${item.kind}-${item.id}`} item={item} />
          ))}
        </ul>
      )}
    </DashboardShell>
  );
}

function DeletedRow({ item }: { item: DeletedItem }) {
  const { notify } = useApp();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const left = daysLeft(item.deletedAt);

  const run = async (action: () => Promise<void>, message: string) => {
    setBusy(true);
    try {
      await action();
      // A restored item can touch every admin list and the store.
      await queryClient.invalidateQueries();
      notify(message, 'info');
    } catch (err) {
      notify(friendlyError(err), 'error');
      setBusy(false);
    }
  };

  const purge = () => {
    if (!window.confirm(`Permanently delete “${item.title}”? This can't be undone.`)) return;
    run(() => api.purgeDeleted(item.kind, item.id), `“${item.title}” permanently deleted`);
  };

  return (
    <li className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-surface p-4">
      {item.imageUrl && <img src={item.imageUrl} alt="" className="h-14 w-14 rounded-lg object-cover" />}
      <div className="min-w-[calc(100%-5rem)] flex-1 sm:min-w-0">
        <p className="font-medium text-ink">{item.title}</p>
        <p className="mt-0.5 text-xs text-ink-3">{[kindLabel[item.kind], item.detail].filter(Boolean).join(' · ')}</p>
        <p className="mt-0.5 text-xs text-ink-3">
          Deleted {formatDate(item.deletedAt)} · {left} {left === 1 ? 'day' : 'days'} left
        </p>
      </div>
      <div className="ml-auto flex gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => run(() => api.restoreDeleted(item.kind, item.id), `“${item.title}” restored`)}
          aria-label={`Restore ${item.title}`}
          className={`${secondaryButton} h-10 px-4`}
        >
          <RotateCcwIcon className="h-4 w-4" /> Restore
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={purge}
          aria-label={`Permanently delete ${item.title}`}
          className="pressable flex h-10 w-10 items-center justify-center rounded-xl border border-line text-danger hover:border-danger disabled:opacity-50"
        >
          <Trash2Icon className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
