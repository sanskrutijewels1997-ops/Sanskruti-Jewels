import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { friendlyError } from '../../lib/format';
import { ErrorNotice, Field, Spinner, inputClass, primaryButton } from '../../components/ui';
import { AuthCard, safeNext } from './AuthCard';

export function Login() {
  const { signIn, user } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const next = safeNext(params.get('next'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate(next, { replace: true });
  }, [user, next, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to see your wishlist, lists and enquiries.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email">
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Password">
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </Field>
        <div className="text-right">
          <Link to="/forgot-password" className="text-xs text-charcoal-muted hover:text-gold">
            Forgot password?
          </Link>
        </div>
        {error && <ErrorNotice error={error} />}
        <button type="submit" disabled={busy} className={`w-full ${primaryButton}`}>
          {busy && <Spinner />} Sign in
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-charcoal-muted">
        New here?{' '}
        <Link to={`/register?next=${encodeURIComponent(next)}`} className="font-medium text-gold hover:text-gold-light">
          Create an account
        </Link>
      </p>
    </AuthCard>
  );
}
