import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toaster } from './Toaster';
import { QuickViewModal } from './QuickViewModal';
import { QuoteModal } from './QuoteModal';
import { CollectionPickerModal } from './CollectionPickerModal';

const appRoutes = ['/dashboard', '/orders', '/admin', '/supplier/dashboard', '/supplier/add-product'];

export function SiteLayout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash]);

  const isApp = appRoutes.some((r) => pathname.startsWith(r));

  return (
    <div className="flex min-h-screen w-full flex-col bg-ivory">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isApp && <Footer />}
      <QuickViewModal />
      <QuoteModal />
      <CollectionPickerModal />
      <Toaster />
    </div>);

}