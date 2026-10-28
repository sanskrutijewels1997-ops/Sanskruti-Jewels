import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MailCheckIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { friendlyError } from '../../lib/format';
import { ErrorNotice, Field, Spinner, inputClass, primaryButton } from '../../components/ui';
import { AuthCard, safeNext } from './AuthCard';

export function Register() {
  const { signUp, user } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const next = safeNext(params.get('next'));
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    if (user) navigate(next, { replace: true });
  }, [user, next, navigate]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password.length < 8) {
      setError('Use at least 8 characters for your password.');
      return;
    }
    setBusy(true);
    try {
      const { needsConfirmation } = await signUp({
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
        phone: form.phone.trim()
      });
      if (needsConfirmation) setCheckEmail(true);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  if (checkEmail) {
    return (
      <AuthCard title="Check your inbox">
        <div className="text-center">
          <MailCheckIcon className="mx-auto h-10 w-10 text-gold" />
          <p className="mt-4 text-sm text-charcoal-muted">
            We've sent a confirmation link to <strong className="text-charcoal">{form.email}</strong>. Open it to
            activate your account, then sign in.
          </p>
          <Link to="/login" className={`mt-7 ${primaryButton}`}>
            Go to sign in
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Create your account" subtitle="Save favourites, build lists and track your enquiries.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name">
          <input required autoComplete="name" value={form.fullName} onChange={set('fullName')} className={inputClass} />
        </Field>
        <Field label="Phone">
          <input type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} className={inputClass} />
        </Field>
        <Field label="Email">
          <input type="email" required autoComplete="email" value={form.email} onChange={set('email')} className={inputClass} />
        </Field>
        <Field label="Password" hint="At least 8 characters">
          <input
            type="password"
            required
            autoComplete="new-password"
            value={form.password}
            onChange={set('password')}
            className={inputClass}
          />
        </Field>
        {error && <ErrorNotice error={error} />}
        <button type="submit" disabled={busy} className={`w-full ${primaryButton}`}>
          {busy && <Spinner />} Create account
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-charcoal-muted">
        Already have an account?{' '}
        <Link to={`/login?next=${encodeURIComponent(next)}`} className="font-medium text-gold hover:text-gold-light">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
