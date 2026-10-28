import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { friendlyError } from '../../lib/format';
import { ErrorNotice, Field, Spinner, inputClass, primaryButton } from '../../components/ui';
import { AuthCard } from './AuthCard';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.sendPasswordReset(email.trim());
      setSent(true);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthCard title="Reset your password" subtitle={sent ? undefined : "We'll email you a link to choose a new one."}>
      {sent ? (
        <p className="text-center text-sm text-charcoal-muted">
          If an account exists for <strong className="text-charcoal">{email}</strong>, a reset link is on its way.
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field label="Email">
            <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </Field>
          {error && <ErrorNotice error={error} />}
          <button type="submit" disabled={busy} className={`w-full ${primaryButton}`}>
            {busy && <Spinner />} Send reset link
          </button>
        </form>
      )}
      <p className="mt-6 text-center text-sm">
        <Link to="/login" className="text-charcoal-muted hover:text-gold">
          Back to sign in
        </Link>
      </p>
    </AuthCard>
  );
}
