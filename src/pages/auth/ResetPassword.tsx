import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { friendlyError } from '../../lib/format';
import { ErrorNotice, Field, PageLoader, Spinner, inputClass, primaryButton } from '../../components/ui';
import { AuthCard } from './AuthCard';

/** Landing page for the email reset link; Supabase signs the user in from the URL token. */
export function ResetPassword() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) return <PageLoader />;

  if (!user) {
    return (
      <AuthCard title="Link expired" subtitle="This reset link is invalid or has expired. Request a new one.">
        <button type="button" onClick={() => navigate('/forgot-password')} className={`w-full ${primaryButton}`}>
          Request a new link
        </button>
      </AuthCard>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Use at least 8 characters for your password.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await api.updatePassword(password);
      navigate('/account', { replace: true });
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthCard title="Choose a new password">
      <form onSubmit={submit} className="space-y-4">
        <Field label="New password" hint="At least 8 characters">
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </Field>
        {error && <ErrorNotice error={error} />}
        <button type="submit" disabled={busy} className={`w-full ${primaryButton}`}>
          {busy && <Spinner />} Save password
        </button>
      </form>
    </AuthCard>
  );
}
