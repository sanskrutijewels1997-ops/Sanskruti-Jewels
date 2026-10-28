import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronRightIcon,
  FileTextIcon,
  FolderHeartIcon,
  HeartIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MailIcon,
  MessageCircleIcon,
  MonitorSmartphoneIcon,
  MoonIcon,
  SunIcon,
  UserRoundPenIcon
} from 'lucide-react';
import { DemoNotice } from '../../components/DemoBanner';
import { PageHeader } from '../../components/PageHeader';
import { primaryButton, secondaryButton } from '../../components/ui';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { BRAND } from '../../data/brand';
import { api } from '../../lib/api';
import { qk } from '../../lib/queries';
import { getThemePref, setThemePref, type ThemePref } from '../../lib/theme';

/** Profile tab: account header, menu rows, appearance and sign out. */
export function Profile() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const { wishlist, lists, openEnquiry } = useApp();
  const navigate = useNavigate();
  const enquiries = useQuery({
    queryKey: qk.myEnquiries(user?.id ?? ''),
    queryFn: () => api.listMyEnquiries(user!.id),
    enabled: !!user
  });
  const openCount = enquiries.data?.filter((e) => e.status !== 'Closed').length ?? 0;
  const name = profile?.fullName || user?.email?.split('@')[0] || '';

  return (
    <div className="mx-auto max-w-2xl lg:px-6">
      <PageHeader title="Profile" back={false} large />

      <div className="space-y-5 px-4 py-4 lg:px-0">
        {user ? (
          <Link to="/account/edit" className="pressable flex items-center gap-4 rounded-2xl border border-line bg-surface p-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand font-display text-2xl font-semibold text-brand-on">
              {name.charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[17px] font-semibold text-ink">{name}</span>
              <span className="block truncate text-[13px] text-ink-3">{user.email}</span>
              {profile?.phone && <span className="block truncate text-[13px] text-ink-3">{profile.phone}</span>}
            </span>
            <ChevronRightIcon className="h-5 w-5 text-ink-3" />
          </Link>
        ) : (
          <div className="rounded-2xl border border-line bg-surface p-5 text-center">
            <p className="font-display text-2xl font-semibold text-ink">Welcome to {BRAND.name}</p>
            <p className="mt-1 text-sm text-ink-2">Sign in to sync your wishlist, lists and enquiries.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link to="/login?next=/account" className={primaryButton}>
                Sign in
              </Link>
              <Link to="/register?next=/account" className={secondaryButton}>
                Sign up
              </Link>
            </div>
          </div>
        )}

        {user && (
          <MenuGroup>
            <MenuRow to="/wishlist" icon={HeartIcon} label="Wishlist" value={String(wishlist.length)} />
            <MenuRow to="/lists" icon={FolderHeartIcon} label="My Lists" value={String(lists.length)} />
            <MenuRow to="/account/enquiries" icon={FileTextIcon} label="My Enquiries" value={openCount ? `${openCount} open` : undefined} />
            <MenuRow to="/account/edit" icon={UserRoundPenIcon} label="Edit profile" />
          </MenuGroup>
        )}

        {isAdmin && (
          <MenuGroup>
            <MenuRow to="/admin" icon={LayoutDashboardIcon} label="Admin console" accent />
          </MenuGroup>
        )}

        <MenuGroup title="Appearance">
          <ThemeSwitcher />
        </MenuGroup>

        <MenuGroup title="Help">
          <MenuRow icon={MessageCircleIcon} label="Ask us anything" onClick={() => openEnquiry(null)} />
          {BRAND.whatsapp && <MenuRow href={`https://wa.me/${BRAND.whatsapp}`} icon={MessageCircleIcon} label="WhatsApp us" />}
          {BRAND.email && <MenuRow href={`mailto:${BRAND.email}`} icon={MailIcon} label={BRAND.email} />}
        </MenuGroup>

        {user && (
          <MenuGroup>
            <MenuRow
              icon={LogOutIcon}
              label="Sign out"
              danger
              onClick={async () => {
                await signOut();
                navigate('/', { replace: true });
              }}
            />
          </MenuGroup>
        )}

        <DemoNotice />
        <p className="pb-4 text-center text-[11px] text-ink-3">{BRAND.name} · v{__APP_VERSION__}</p>
      </div>
    </div>
  );
}

function MenuGroup({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section>
      {title && <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-ink-3">{title}</h2>}
      <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">{children}</div>
    </section>
  );
}

function MenuRow({
  icon: Icon,
  label,
  value,
  to,
  href,
  onClick,
  danger,
  accent
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
  to?: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
  accent?: boolean;
}) {
  const inner = (
    <>
      <Icon className={`h-5 w-5 shrink-0 ${danger ? 'text-danger' : accent ? 'text-brand' : 'text-ink-2'}`} />
      <span className={`flex-1 truncate text-[15px] ${danger ? 'text-danger' : accent ? 'font-semibold text-brand' : 'text-ink'}`}>{label}</span>
      {value && <span className="text-[13px] text-ink-3">{value}</span>}
      {!danger && <ChevronRightIcon className="h-4 w-4 text-ink-3" />}
    </>
  );
  const cls = 'pressable flex w-full items-center gap-3.5 px-4 py-3.5 text-left';
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  if (href) return <a href={href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>;
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

function ThemeSwitcher() {
  const [pref, setPref] = useState<ThemePref>(getThemePref);
  const options: { value: ThemePref; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: 'system', label: 'System', icon: MonitorSmartphoneIcon },
    { value: 'light', label: 'Light', icon: SunIcon },
    { value: 'dark', label: 'Dark', icon: MoonIcon }
  ];
  return (
    <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-2 p-2">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={pref === value}
          onClick={() => {
            setPref(value);
            setThemePref(value);
          }}
          className={`pressable flex flex-col items-center gap-1.5 rounded-xl py-3 text-[12.5px] font-medium ${
            pref === value ? 'bg-brand-soft text-brand ring-1 ring-brand' : 'text-ink-2'
          }`}
        >
          <Icon className="h-5 w-5" />
          {label}
        </button>
      ))}
    </div>
  );
}
