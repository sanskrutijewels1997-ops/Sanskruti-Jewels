import { NavLink } from 'react-router-dom';
import { HeartIcon, HomeIcon, LayoutGridIcon, UserIcon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const TAB_ROOTS = ['/', '/categories', '/wishlist', '/account'];

const tabs = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/categories', label: 'Categories', icon: LayoutGridIcon },
  { to: '/wishlist', label: 'Wishlist', icon: HeartIcon },
  { to: '/account', label: 'Profile', icon: UserIcon }
];

export function BottomTabBar() {
  const { wishlist } = useApp();
  return (
    <nav
      aria-label="Main"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface lg:hidden"
    >
      <ul className="grid h-tabbar grid-cols-4">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end
              replace
              className={({ isActive }) =>
                `pressable relative flex h-full flex-col items-center justify-center gap-1 text-[11px] ${
                  isActive ? 'font-semibold text-brand' : 'font-medium text-ink-3'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-brand" aria-hidden="true" />}
                  <span className="relative">
                    <Icon
                      className={`h-[22px] w-[22px] ${isActive && to === '/wishlist' ? 'fill-brand' : ''}`}
                      strokeWidth={isActive ? 2.3 : 1.8}
                    />
                    {to === '/wishlist' && wishlist.length > 0 && (
                      <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-on">
                        {wishlist.length}
                      </span>
                    )}
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
