import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { routerFuture, routes } from '../App';
import { api } from '../lib/api';
import { DEMO_ACCOUNTS } from '../lib/api/demo';

/** Mounts the whole app (real routes, providers and demo backend) at `path`. */
export function renderApp(path = '/') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createMemoryRouter(routes, { initialEntries: [path], future: routerFuture });
  const utils = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </QueryClientProvider>
  );
  return { ...utils, router, queryClient };
}

/** Signs in through the demo backend before rendering, like a returning user. */
export async function signInAs(who: 'admin' | 'customer') {
  const acc = DEMO_ACCOUNTS[who];
  await api.signIn(acc.email, acc.password);
}
