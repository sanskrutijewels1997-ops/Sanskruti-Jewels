import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell, accountNav } from '../../components/DashboardShell';
import { EmptyState, ErrorNotice, PageLoader, primaryButton } from '../../components/ui';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { formatDate } from '../../lib/format';
import { qk, useCatalogue } from '../../lib/queries';
import type { EnquiryStatus } from '../../types';

export const enquiryTone: Record<EnquiryStatus, string> = {
  New: 'bg-gold-wash text-gold-light',
  Contacted: 'bg-emerald-950 text-emerald-300',
  Closed: 'bg-ivory-dark text-charcoal-muted'
};

export function MyEnquiries() {
  const { user } = useAuth();
  const { openEnquiry } = useApp();
  const { byId } = useCatalogue();
  const q = useQuery({
    queryKey: qk.myEnquiries(user?.id ?? ''),
    queryFn: () => api.listMyEnquiries(user!.id),
    enabled: !!user
  });

  return (
    <DashboardShell
      eyebrow="Questions you've asked"
      title="My Enquiries"
      nav={accountNav}
      actions={
        <button type="button" onClick={() => openEnquiry(null)} className={primaryButton}>
          New enquiry
        </button>
      }
    >
      {q.isLoading ? (
        <PageLoader />
      ) : q.error ? (
        <ErrorNotice error={q.error} />
      ) : !q.data?.length ? (
        <EmptyState
          title="No enquiries yet"
          text="Tap “Enquire” on any piece to ask about price, size or customisation."
          action={
            <Link to="/catalogue" className={primaryButton}>
              Browse jewellery
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {q.data.map((e) => {
            const p = e.productId ? byId(e.productId) : undefined;
            return (
              <li key={e.id} className="flex gap-4 rounded-xl border border-line bg-white p-4">
                {p?.images[0] && (
                  <img src={p.images[0].url} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-charcoal">
                      {p ? (
                        <Link to={`/product/${p.slug}`} className="hover:text-gold">
                          {p.name}
                        </Link>
                      ) : (
                        'General enquiry'
                      )}
                    </p>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${enquiryTone[e.status]}`}>
                      {e.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-charcoal-faint">
                    {formatDate(e.createdAt)}
                    {e.size && ` · Size ${e.size}`}
                    {e.quantity > 1 && ` · Qty ${e.quantity}`}
                  </p>
                  {e.message && <p className="mt-2 text-sm text-charcoal-muted">{e.message}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardShell>
  );
}
