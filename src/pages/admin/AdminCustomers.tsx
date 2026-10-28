import { useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardShell, adminNav } from '../../components/DashboardShell';
import { EmptyState, ErrorNotice, PageLoader, inputClass } from '../../components/ui';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { formatDate, friendlyError } from '../../lib/format';
import { qk } from '../../lib/queries';
import type { Profile } from '../../types';

export function AdminCustomers() {
  const q = useQuery({ queryKey: qk.customers, queryFn: () => api.listCustomers() });
  const { user } = useAuth();
  const { notify } = useApp();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const needle = search.trim().toLowerCase();
  const list = (q.data ?? []).filter(
    (p) => !needle || `${p.fullName} ${p.email} ${p.phone} ${p.city}`.toLowerCase().includes(needle)
  );

  const toggleAdmin = async (p: Profile) => {
    const role = p.role === 'admin' ? 'customer' : 'admin';
    const msg =
      role === 'admin'
        ? `Give ${p.email} full admin access? They will be able to edit products and see all customer data.`
        : `Remove admin access from ${p.email}?`;
    if (!window.confirm(msg)) return;
    try {
      await api.setRole(p.id, role);
      queryClient.invalidateQueries({ queryKey: qk.customers });
      notify(role === 'admin' ? 'Admin access granted' : 'Admin access removed');
    } catch (e) {
      notify(friendlyError(e), 'error');
    }
  };

  return (
    <DashboardShell eyebrow="People" title="Customers" subtitle={`${q.data?.length ?? 0} accounts`} nav={adminNav}>
      <div className="relative mb-5 max-w-md">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, phone" aria-label="Search customers" className={`${inputClass} pl-9`} />
      </div>
      {q.isLoading ? (
        <PageLoader />
      ) : q.error ? (
        <ErrorNotice error={q.error} />
      ) : list.length === 0 ? (
        <EmptyState title="No customers found" />
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {list.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 p-4 text-sm">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink">{p.fullName || '—'}</p>
                <p className="truncate text-xs text-ink-2">
                  {[p.email, p.phone, p.city].filter(Boolean).join(' · ')}
                </p>
              </div>
              <span className="text-xs text-ink-3">Joined {formatDate(p.createdAt)}</span>
              {p.role === 'admin' && (
                <span className="rounded-full bg-gold-wash px-2.5 py-1 text-[11px] font-medium text-gold">Admin</span>
              )}
              {p.id !== user?.id && (
                <button type="button" onClick={() => toggleAdmin(p)} className="text-xs text-ink-2 underline-offset-4 hover:text-brand hover:underline">
                  {p.role === 'admin' ? 'Remove admin' : 'Make admin'}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </DashboardShell>
  );
}
