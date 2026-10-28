import { Link } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell, StatCard, adminNav } from '../../components/DashboardShell';
import { ErrorNotice, PageLoader, Panel, primaryButton } from '../../components/ui';
import { api } from '../../lib/api';
import { formatDate } from '../../lib/format';
import { qk, useCatalogue } from '../../lib/queries';
import { enquiryTone } from '../account/MyEnquiries';

export function AdminDashboard() {
  const stats = useQuery({ queryKey: qk.stats, queryFn: () => api.adminStats() });
  const enquiries = useQuery({ queryKey: qk.allEnquiries, queryFn: () => api.listAllEnquiries() });
  const { byId } = useCatalogue();

  const s = stats.data;
  const maxCat = Math.max(1, ...(s?.byCategory.map((c) => c.count) ?? [1]));

  return (
    <DashboardShell
      eyebrow="Admin console"
      title="Store overview"
      nav={adminNav}
      actions={
        <Link to="/admin/products/new" className={primaryButton}>
          <PlusIcon className="h-4 w-4" /> Add product
        </Link>
      }
    >
      {stats.isLoading ? (
        <PageLoader />
      ) : stats.error ? (
        <ErrorNotice error={stats.error} />
      ) : s ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard label="Products" value={String(s.products)} meta={`${s.published} published`} emphasis />
            <StatCard label="Customers" value={String(s.customers)} />
            <StatCard label="Open enquiries" value={String(s.enquiriesOpen)} />
            <StatCard label="Wishlist saves" value={String(s.wishlistAdds)} meta={`${s.totalViews.toLocaleString('en-IN')} product views`} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Panel title="Products by category">
              {s.byCategory.length === 0 ? (
                <p className="text-sm text-ink-2">No products yet.</p>
              ) : (
                <ul className="space-y-3" aria-label="Number of products in each category">
                  {s.byCategory.map((c) => (
                    <li key={c.name} className="grid grid-cols-[120px_1fr_32px] items-center gap-3 text-sm" title={`${c.name}: ${c.count}`}>
                      <span className="truncate text-ink-2">{c.name}</span>
                      <span className="h-2.5 rounded-r bg-surface-3">
                        <span className="block h-full rounded-r bg-gold" style={{ width: `${(c.count / maxCat) * 100}%` }} />
                      </span>
                      <span className="text-right tabular-nums text-ink">{c.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="Most wishlisted">
              {s.topWishlisted.length === 0 ? (
                <p className="text-sm text-ink-2">Nobody has wishlisted anything yet.</p>
              ) : (
                <ol className="divide-y divide-line">
                  {s.topWishlisted.map((t, i) => (
                    <li key={t.id} className="flex items-center gap-3 py-3 text-sm">
                      <span className="w-5 text-ink-3">{i + 1}</span>
                      <Link to={`/admin/products/${t.id}`} className="flex-1 truncate text-ink hover:text-brand">
                        {t.name}
                      </Link>
                      <span className="text-xs text-ink-3">{t.sku}</span>
                      <span className="w-10 text-right tabular-nums text-ink">♥ {t.count}</span>
                    </li>
                  ))}
                </ol>
              )}
            </Panel>
          </div>

          <div className="mt-6">
            <Panel
              title="Latest enquiries"
              actions={
                <Link to="/admin/enquiries" className="text-sm text-brand">
                  View all →
                </Link>
              }
            >
              {!enquiries.data?.length ? (
                <p className="text-sm text-ink-2">No enquiries yet.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {enquiries.data.slice(0, 6).map((e) => (
                    <li key={e.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 text-sm">
                      <span className="font-medium text-ink">{e.name}</span>
                      <span className="text-ink-2">{e.phone}</span>
                      <span className="flex-1 truncate text-ink-2">
                        {e.productId ? byId(e.productId)?.name ?? 'Deleted product' : 'General enquiry'}
                      </span>
                      <span className="text-xs text-ink-3">{formatDate(e.createdAt)}</span>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${enquiryTone[e.status]}`}>{e.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </>
      ) : null}
    </DashboardShell>
  );
}
