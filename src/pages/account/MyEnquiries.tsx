import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MessageSquareIcon, PlusIcon } from 'lucide-react';
import { HeaderIconButton, PageHeader } from '../../components/PageHeader';
import { ProductImageFallback } from '../../components/ProductCard';
import { EmptyState, ErrorNotice, PageLoader, primaryButton } from '../../components/ui';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { formatDate } from '../../lib/format';
import { qk, useCatalogue } from '../../lib/queries';
import type { EnquiryStatus } from '../../types';

export const enquiryTone: Record<EnquiryStatus, string> = {
  New: 'bg-gold-wash text-gold',
  Contacted: 'bg-success/15 text-success',
  Closed: 'bg-surface-2 text-ink-3'
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
    <div className="mx-auto max-w-2xl lg:px-6">
      <PageHeader
        title="My Enquiries"
        fallback="/account"
        actions={
          <HeaderIconButton label="New enquiry" onClick={() => openEnquiry(null)}>
            <PlusIcon className="h-6 w-6" />
          </HeaderIconButton>
        }
      />
      {q.isLoading ? (
        <PageLoader />
      ) : q.error ? (
        <div className="p-4">
          <ErrorNotice error={q.error} />
        </div>
      ) : !q.data?.length ? (
        <EmptyState
          icon={MessageSquareIcon}
          title="No enquiries yet"
          text="Tap “Enquire now” on any piece to ask about price, size or customisation."
          action={
            <Link to="/catalogue" className={`w-full ${primaryButton}`}>
              Browse jewellery
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3 px-4 py-4 lg:px-0">
          {q.data.map((e) => {
            const p = e.productId ? byId(e.productId) : undefined;
            const body = (
              <>
                {p?.images[0] ? (
                  <img src={p.images[0].url} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                ) : (
                  <ProductImageFallback className="h-16 w-16 shrink-0 rounded-xl" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="truncate text-[15px] font-semibold text-ink">{p?.name ?? 'General enquiry'}</span>
                    <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${enquiryTone[e.status]}`}>{e.status}</span>
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-3">
                    {formatDate(e.createdAt)}
                    {e.size && ` · Size ${e.size}`}
                    {e.quantity > 1 && ` · Qty ${e.quantity}`}
                  </span>
                  {e.message && <span className="mt-1.5 line-clamp-2 block text-[13px] text-ink-2">{e.message}</span>}
                </span>
              </>
            );
            const cls = 'pressable flex gap-3 rounded-2xl border border-line bg-surface p-3';
            return (
              <li key={e.id}>
                {p ? (
                  <Link to={`/product/${p.slug}`} className={cls}>
                    {body}
                  </Link>
                ) : (
                  <div className={cls}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
