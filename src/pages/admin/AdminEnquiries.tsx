import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailIcon, MessageCircleIcon, PhoneIcon } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardShell, adminNav } from '../../components/DashboardShell';
import { EmptyState, ErrorNotice, PageLoader, inputClass } from '../../components/ui';
import { useApp } from '../../contexts/AppContext';
import { api } from '../../lib/api';
import { formatDate, friendlyError } from '../../lib/format';
import { qk, useCatalogue } from '../../lib/queries';
import type { Enquiry, EnquiryStatus } from '../../types';
import { enquiryTone } from '../account/MyEnquiries';

const statuses: EnquiryStatus[] = ['New', 'Contacted', 'Closed'];

export function AdminEnquiries() {
  const q = useQuery({ queryKey: qk.allEnquiries, queryFn: () => api.listAllEnquiries() });
  const [filter, setFilter] = useState<EnquiryStatus | 'Open' | 'All'>('Open');
  const list = (q.data ?? []).filter((e) =>
    filter === 'All' ? true : filter === 'Open' ? e.status !== 'Closed' : e.status === filter
  );

  return (
    <DashboardShell eyebrow="Customers" title="Enquiries" subtitle="Price, size and customisation requests from the store." nav={adminNav}>
      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto">
        {(['Open', ...statuses, 'All'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            aria-pressed={filter === s}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium ${
              filter === s ? 'border-brand bg-brand-soft text-ink' : 'border-line text-ink-2 hover:border-brand'
            }`}
          >
            {s} ({(q.data ?? []).filter((e) => (s === 'All' ? true : s === 'Open' ? e.status !== 'Closed' : e.status === s)).length})
          </button>
        ))}
      </div>
      {q.isLoading ? (
        <PageLoader />
      ) : q.error ? (
        <ErrorNotice error={q.error} />
      ) : list.length === 0 ? (
        <EmptyState title="Nothing here" text="New enquiries from the store will appear here." />
      ) : (
        <ul className="space-y-3">
          {list.map((e) => (
            <EnquiryRow key={e.id} enquiry={e} />
          ))}
        </ul>
      )}
    </DashboardShell>
  );
}

function EnquiryRow({ enquiry: e }: { enquiry: Enquiry }) {
  const { byId } = useCatalogue();
  const { notify } = useApp();
  const queryClient = useQueryClient();
  const [note, setNote] = useState(e.adminNote);
  const p = e.productId ? byId(e.productId) : undefined;
  const digits = e.phone.replace(/\D/g, '');
  const waNumber = digits.length === 10 ? `91${digits}` : digits;

  const update = async (patch: { status?: EnquiryStatus; adminNote?: string }) => {
    try {
      await api.updateEnquiry(e.id, patch);
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      queryClient.invalidateQueries({ queryKey: qk.stats });
      if (patch.status) notify(`Marked as ${patch.status}`);
    } catch (err) {
      notify(friendlyError(err), 'error');
    }
  };

  return (
    <li className="rounded-xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-start gap-4">
        {p?.images[0] && <img src={p.images[0].url} alt="" className="h-16 w-16 rounded-lg object-cover" />}
        <div className="min-w-0 flex-1">
          <p className="font-medium text-ink">{e.name}</p>
          <p className="mt-0.5 text-sm text-ink-2">
            {p ? (
              <Link to={`/admin/products/${p.id}`} className="hover:text-brand">
                {p.name} · {p.sku}
              </Link>
            ) : e.productId ? (
              'Deleted product'
            ) : (
              'General enquiry'
            )}
          </p>
          <p className="mt-1 text-xs text-ink-3">
            {formatDate(e.createdAt)}
            {e.size && ` · Size ${e.size}`}
            {e.quantity > 1 && ` · Qty ${e.quantity}`}
            {e.userId ? ' · Registered customer' : ' · Guest'}
          </p>
        </div>
        <select
          value={e.status}
          onChange={(ev) => update({ status: ev.target.value as EnquiryStatus })}
          aria-label="Status"
          className={`h-9 rounded-full border-0 px-3 text-xs font-medium outline-none ${enquiryTone[e.status]}`}
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      {e.message && <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-sm text-ink-2">{e.message}</p>}
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <a href={`tel:${e.phone}`} className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-ink-2 hover:border-brand">
          <PhoneIcon className="h-3.5 w-3.5 text-gold" /> {e.phone}
        </a>
        {waNumber && (
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${e.name}, thank you for your enquiry${p ? ` about ${p.name}` : ''} at Sanskruti Jewels.`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-ink-2 hover:border-brand"
          >
            <MessageCircleIcon className="h-3.5 w-3.5 text-gold" /> WhatsApp
          </a>
        )}
        {e.email && (
          <a href={`mailto:${e.email}`} className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-ink-2 hover:border-brand">
            <MailIcon className="h-3.5 w-3.5 text-gold" /> {e.email}
          </a>
        )}
      </div>
      <input
        value={note}
        onChange={(ev) => setNote(ev.target.value)}
        onBlur={() => note !== e.adminNote && update({ adminNote: note })}
        placeholder="Internal note (only admins see this)"
        aria-label="Internal note"
        className={`${inputClass} mt-3 h-10`}
      />
    </li>
  );
}
