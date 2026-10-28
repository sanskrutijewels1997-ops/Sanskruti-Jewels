import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { SiteLayout } from './components/SiteLayout';
import { RequireAdmin, RequireAuth } from './components/Guards';
import { Home } from './pages/Home';
import { Catalogue } from './pages/Catalogue';
import { ProductDetail } from './pages/ProductDetail';
import { Collections } from './pages/Collections';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { Account } from './pages/account/Account';
import { Wishlist } from './pages/account/Wishlist';
import { SavedLists } from './pages/account/SavedLists';
import { MyEnquiries } from './pages/account/MyEnquiries';
import { PageLoader } from './components/ui';
import { NotFound } from './pages/NotFound';

// Admin screens are split into their own chunk; shoppers never download them.
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts').then((m) => ({ default: m.AdminProducts })));
const ProductEditor = lazy(() => import('./pages/admin/ProductEditor').then((m) => ({ default: m.ProductEditor })));
const AdminTaxonomy = lazy(() => import('./pages/admin/AdminTaxonomy').then((m) => ({ default: m.AdminTaxonomy })));
const AdminEnquiries = lazy(() => import('./pages/admin/AdminEnquiries').then((m) => ({ default: m.AdminEnquiries })));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers').then((m) => ({ default: m.AdminCustomers })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, refetchOnWindowFocus: false, retry: 1 }
  }
});

const customer = (el: React.ReactNode) => <RequireAuth>{el}</RequireAuth>;
const admin = (el: React.ReactNode) => (
  <RequireAdmin>
    <Suspense fallback={<PageLoader />}>{el}</Suspense>
  </RequireAdmin>
);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <Routes>
              <Route element={<SiteLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/catalogue" element={<Catalogue />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/collections" element={<Collections />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                <Route path="/account" element={customer(<Account />)} />
                <Route path="/wishlist" element={customer(<Wishlist />)} />
                <Route path="/lists" element={customer(<SavedLists />)} />
                <Route path="/account/enquiries" element={customer(<MyEnquiries />)} />

                <Route path="/admin" element={admin(<AdminDashboard />)} />
                <Route path="/admin/products" element={admin(<AdminProducts />)} />
                <Route path="/admin/products/new" element={admin(<ProductEditor />)} />
                <Route path="/admin/products/:id" element={admin(<ProductEditor />)} />
                <Route path="/admin/categories" element={admin(<AdminTaxonomy kind="categories" />)} />
                <Route path="/admin/collections" element={admin(<AdminTaxonomy kind="collections" />)} />
                <Route path="/admin/enquiries" element={admin(<AdminEnquiries />)} />
                <Route path="/admin/customers" element={admin(<AdminCustomers />)} />

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
