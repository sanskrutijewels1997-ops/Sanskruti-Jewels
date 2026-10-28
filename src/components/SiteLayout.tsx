import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toaster } from './Toaster';
import { QuickViewModal } from './QuickViewModal';
import { EnquiryModal } from './EnquiryModal';
import { ListPickerModal } from './ListPickerModal';
import { DemoBanner } from './DemoBanner';

const appRoutes = ['/account', '/admin', '/wishlist', '/lists'];

export function SiteLayout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash]);

  const isApp = appRoutes.some((r) => pathname.startsWith(r));

  return (
    <div className="flex min-h-screen w-full flex-col bg-ivory">
      <DemoBanner />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isApp && <Footer />}
      <QuickViewModal />
      <EnquiryModal />
      <ListPickerModal />
      <Toaster />
    </div>
  );
}
