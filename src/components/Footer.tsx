import { Link } from 'react-router-dom';
import { BRAND } from '../data/brand';
import { Logo } from './Logo';

/** Desktop-only footer; the phone app has the tab bar instead. */
export function Footer() {
  return (
    <footer className="mt-16 hidden border-t border-line bg-surface lg:block">
      <div className="mx-auto flex max-w-site items-start justify-between gap-10 px-6 py-10">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-ink-3">{BRAND.slogan}</p>
        </div>
        <nav className="grid grid-cols-2 gap-x-16 gap-y-2 text-sm text-ink-2" aria-label="Footer">
          <Link to="/catalogue" className="hover:text-brand">Shop all</Link>
          <Link to="/wishlist" className="hover:text-brand">Wishlist</Link>
          <Link to="/categories" className="hover:text-brand">Categories</Link>
          <Link to="/lists" className="hover:text-brand">My lists</Link>
          <Link to="/catalogue?filter=new" className="hover:text-brand">New arrivals</Link>
          <Link to="/account/enquiries" className="hover:text-brand">My enquiries</Link>
        </nav>
        <p className="text-xs text-ink-3">© {new Date().getFullYear()} {BRAND.name}</p>
      </div>
    </footer>
  );
}
