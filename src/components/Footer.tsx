import { Link } from 'react-router-dom';
import { MailIcon, MessageCircleIcon } from 'lucide-react';
import { BRAND } from '../data/brand';
import { Logo } from './Header';

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'All Jewellery', to: '/catalogue' },
      { label: 'New Arrivals', to: '/catalogue?filter=new' },
      { label: 'Collections', to: '/collections' },
      { label: 'Bridal', to: '/catalogue?collection=bridal' }
    ]
  },
  {
    title: 'Your Account',
    links: [
      { label: 'My Account', to: '/account' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'My Lists', to: '/lists' },
      { label: 'My Enquiries', to: '/account/enquiries' }
    ]
  }
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-site px-5 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo size="lg" />
            <p className="mt-4 font-display text-lg italic text-charcoal-muted">{BRAND.slogan}</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-charcoal-muted">
              Hallmarked gold, certified diamonds and heirloom craftsmanship — explore our
              collection, save your favourites and enquire about any piece.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="eyebrow text-charcoal-faint">{col.title}</h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-charcoal-soft transition-colors duration-150 ease-luxe hover:text-gold"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="eyebrow text-charcoal-faint">Get in touch</h3>
            <ul className="mt-5 space-y-3 text-sm text-charcoal-soft">
              {BRAND.whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${BRAND.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-gold"
                  >
                    <MessageCircleIcon className="h-4 w-4 text-gold" /> WhatsApp us
                  </a>
                </li>
              )}
              {BRAND.email && (
                <li>
                  <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2 hover:text-gold">
                    <MailIcon className="h-4 w-4 text-gold" /> {BRAND.email}
                  </a>
                </li>
              )}
              <li className="text-charcoal-muted">
                Questions about a piece? Tap “Enquire” on any product and we'll get back to you.
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-xs text-charcoal-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p>BIS hallmarked gold · Certified diamonds · Lifetime exchange</p>
        </div>
      </div>
    </footer>
  );
}
