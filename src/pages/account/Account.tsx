import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOutIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell, StatCard, accountNav } from '../../components/DashboardShell';
import { ProductCard } from '../../components/ProductCard';
import { ErrorNotice, Field, Panel, Spinner, inputClass, primaryButton, secondaryButton } from '../../components/ui';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { friendlyError } from '../../lib/format';
import { qk, useCatalogue } from '../../lib/queries';

export function Account() {
  const { user, profile, updateProfile, signOut, isAdmin } = useAuth();
  const { wishlist, lists, recentlyViewed, notify } = useApp();
  const { byId, categoryName } = useCatalogue();
  const navigate = useNavigate();
  const enquiries = useQuery({
    queryKey: qk.myEnquiries(user?.id ?? ''),
    queryFn: () => api.listMyEnquiries(user!.id),
    enabled: !!user
  });

  const [form, setForm] = useState({ fullName: '', phone: '', city: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) setForm({ fullName: profile.fullName, phone: profile.phone, city: profile.city });
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await updateProfile({ fullName: form.fullName.trim(), phone: form.phone.trim(), city: form.city.trim() });
      notify('Profile saved');
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  const recent = recentlyViewed
    .map((id) => byId(id))
    .filter((p): p is NonNullable<typeof p> => !!p && p.isPublished)
    .slice(0, 4);
  const firstName = profile?.fullName.split(' ')[0];

  return (
    <DashboardShell
      eyebrow={user?.email ?? ''}
      title={firstName ? `Hello, ${firstName}` : 'My Account'}
      nav={accountNav}
      actions={
        <div className="flex gap-2">
          {isAdmin && (
            <Link to="/admin" className={secondaryButton}>
              Admin console
            </Link>
          )}
          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate('/');
            }}
            className={secondaryButton}
          >
            <LogOutIcon className="h-4 w-4" /> Sign out
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <Link to="/wishlist">
          <StatCard label="Wishlist" value={String(wishlist.length)} meta="Pieces you've saved" emphasis />
        </Link>
        <Link to="/lists">
          <StatCard label="Lists" value={String(lists.length)} meta="Shortlists & occasions" />
        </Link>
        <Link to="/account/enquiries" className="col-span-2 lg:col-span-1">
          <StatCard
            label="Enquiries"
            value={String(enquiries.data?.length ?? 0)}
            meta={`${enquiries.data?.filter((e) => e.status !== 'Closed').length ?? 0} open`}
          />
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Panel title="Profile" hint="We use these details when you send an enquiry.">
          <form onSubmit={save} className="space-y-4">
            <Field label="Full name">
              <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Phone">
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
            </Field>
            <Field label="City">
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Email">
              <input value={user?.email ?? ''} disabled className={inputClass} />
            </Field>
            {error && <ErrorNotice error={error} />}
            <button type="submit" disabled={busy} className={primaryButton}>
              {busy && <Spinner />} Save changes
            </button>
          </form>
        </Panel>

        <Panel title="Recently viewed">
          {recent.length === 0 ? (
            <p className="text-sm text-charcoal-muted">
              Pieces you look at will appear here.{' '}
              <Link to="/catalogue" className="text-gold hover:text-gold-light">
                Start exploring →
              </Link>
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {recent.map((p) => (
                <ProductCard key={p.id} product={p} categoryName={categoryName(p.categoryId)} />
              ))}
            </div>
          )}
        </Panel>
      </div>
    </DashboardShell>
  );
}
