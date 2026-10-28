import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { PageHeader, useGoBack } from '../../components/PageHeader';
import { ErrorNotice, Field, Spinner, inputClass, primaryButton } from '../../components/ui';
import { friendlyError } from '../../lib/format';

export function EditProfile() {
  const { user, profile, updateProfile } = useAuth();
  const { notify } = useApp();
  const goBack = useGoBack('/account');
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
      goBack();
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl lg:px-6">
      <PageHeader title="Edit profile" fallback="/account" />
      <form onSubmit={save} className="space-y-4 px-4 py-5 lg:px-0">
        <Field label="Full name">
          <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass} autoComplete="name" />
        </Field>
        <Field label="Phone" hint="Used when you send an enquiry">
          <input type="tel" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} autoComplete="tel" />
        </Field>
        <Field label="City">
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} autoComplete="address-level2" />
        </Field>
        <Field label="Email">
          <input value={user?.email ?? ''} disabled className={inputClass} />
        </Field>
        {error && <ErrorNotice error={error} />}
        <button type="submit" disabled={busy} className={`w-full ${primaryButton}`}>
          {busy && <Spinner />} Save changes
        </button>
      </form>
    </div>
  );
}
