import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { BottomTabBar, TAB_ROOTS } from './BottomTabBar';
import { DesktopNav } from './DesktopNav';
import { Footer } from './Footer';
import { Toaster } from './Toaster';
import { EnquirySheet } from './EnquirySheet';
import { ListPickerSheet } from './ListPickerSheet';

export function AppShell() {
  const { pathname } = useLocation();
  const isTabRoot = TAB_ROOTS.includes(pathname);
  const isAdmin = pathname.startsWith('/admin');

  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-bg">
      <DesktopNav />
      {/* key restarts the enter animation on every screen change */}
      <main key={pathname} className={`animate-page flex-1 ${isTabRoot ? 'pb-[calc(64px+env(safe-area-inset-bottom))] lg:pb-0' : ''}`}>
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
      {isTabRoot && <BottomTabBar />}
      <EnquirySheet />
      <ListPickerSheet />
      <Toaster />
      <ScrollRestoration />
    </div>
  );
}
