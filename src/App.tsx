import React, { Suspense, lazy } from 'react';
import { Outlet, RouterProvider, createBrowserRouter, type RouteObject } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { AppShell } from './components/AppShell';
import { RequireAdmin, RequireAuth } from './components/Guards';
import { PageLoader } from './components/ui';
import { Home } from './pages/Home';
import { Categories } from './pages/Categories';
import { Catalogue } from './pages/Catalogue';
import { Search } from './pages/Search';
import { ProductDetail } from './pages/ProductDetail';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { Profile } from './pages/account/Profile';
import { EditProfile } from './pages/account/EditProfile';
import { Wishlist } from './pages/account/Wishlist';
import { SavedLists } from './pages/account/SavedLists';
import { ListDetail } from './pages/account/ListDetail';
import { MyEnquiries } from './pages/account/MyEnquiries';
import { NotFound } from './pages/NotFound';

// Admin screens are split into their own chunk; shoppers never download them.
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts').then((m) => ({ default: m.AdminProducts })));
const ProductEditor = lazy(() => import('./pages/admin/ProductEditor').then((m) => ({ default: m.ProductEditor })));
const AdminTaxonomy = lazy(() => import('./pages/admin/AdminTaxonomy').then((m) => ({ default: m.AdminTaxonomy })));
const AdminEnquiries = lazy(() => import('./pages/admin/AdminEnquiries').then((m) => ({ default: m.AdminEnquiries })));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers').then((m) => ({ default: m.AdminCustomers })));

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60_000, refetchOnWindowFocus: false, retry: 1 }
    }
  });

const queryClient = createQueryClient();

const customer = (el: React.ReactNode) => <RequireAuth>{el}</RequireAuth>;
const admin = (el: React.ReactNode) => (
  <RequireAdmin>
    <Suspense fallback={<PageLoader />}>{el}</Suspense>
  </RequireAdmin>
);

/** Providers need the router (for navigation), so they live inside the root route. */
function Root() {
  return (
    <AuthProvider>
      <AppProvider>
        <Outlet />
      </AppProvider>
    </AuthProvider>
  );
}

/** Route table, exported so tests can mount it in a memory router. */
export const routes: RouteObject[] = [
  {
    element: <Root />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/', element: <Home /> },
          { path: '/categories', element: <Categories /> },
          { path: '/collections', element: <Categories initialTab="collections" /> },
          { path: '/catalogue', element: <Catalogue /> },
          { path: '/search', element: <Search /> },
          { path: '/product/:slug', element: <ProductDetail /> },
          { path: '/wishlist', element: <Wishlist /> },
          { path: '/account', element: <Profile /> },

          { path: '/login', element: <Login /> },
          { path: '/register', element: <Register /> },
          { path: '/forgot-password', element: <ForgotPassword /> },
          { path: '/reset-password', element: <ResetPassword /> },

          { path: '/account/edit', element: customer(<EditProfile />) },
          { path: '/account/enquiries', element: customer(<MyEnquiries />) },
          { path: '/lists', element: customer(<SavedLists />) },
          { path: '/lists/:id', element: customer(<ListDetail />) },

          { path: '/admin', element: admin(<AdminDashboard />) },
          { path: '/admin/products', element: admin(<AdminProducts />) },
          { path: '/admin/products/new', element: admin(<ProductEditor />) },
          { path: '/admin/products/:id', element: admin(<ProductEditor />) },
          { path: '/admin/categories', element: admin(<AdminTaxonomy kind="categories" />) },
          { path: '/admin/collections', element: admin(<AdminTaxonomy kind="collections" />) },
          { path: '/admin/enquiries', element: admin(<AdminEnquiries />) },
          { path: '/admin/customers', element: admin(<AdminCustomers />) },

          { path: '*', element: <NotFound /> }
        ]
      }
    ]
  }
];

/** Opt in to React Router v7 behaviour now (also silences the upgrade warnings). */
export const routerFuture = {
  v7_relativeSplatPath: true,
  v7_fetcherPersist: true,
  v7_normalizeFormMethod: true,
  v7_partialHydration: true,
  v7_skipActionErrorRevalidation: true
} as const;

const router = createBrowserRouter(routes, { future: routerFuture });

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </QueryClientProvider>
  );
}
