import { Link } from 'react-router-dom';
import { primaryButton } from '../components/ui';

export function NotFound() {
  return (
    <div className="mx-auto max-w-site px-5 py-32 text-center lg:px-10">
      <p className="eyebrow text-gold">404</p>
      <h1 className="mt-3 font-display text-4xl text-ink">This page has moved or never existed</h1>
      <Link to="/" className={`mt-8 ${primaryButton}`}>
        Back to home
      </Link>
    </div>
  );
}
