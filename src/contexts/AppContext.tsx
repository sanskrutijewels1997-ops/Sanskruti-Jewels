import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { friendlyError } from '../lib/format';
import { haptic } from '../lib/native';
import { qk } from '../lib/queries';
import { useAuth } from './AuthContext';
import type { Product, SavedList } from '../types';

export interface ToastAction {
  label: string;
  to: string;
}

interface Toast {
  id: number;
  message: string;
  tone: 'success' | 'info' | 'error';
  action?: ToastAction;
}

interface AppState {
  wishlist: string[];
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (id: string) => void;
  lists: SavedList[];
  createList: (name: string, occasion: string) => Promise<SavedList | null>;
  renameList: (id: string, name: string) => void;
  deleteList: (id: string) => void;
  setListItem: (listId: string, productId: string, on: boolean) => void;
  updateListNote: (id: string, note: string) => void;
  toasts: Toast[];
  notify: (message: string, tone?: Toast['tone'], action?: ToastAction) => void;
  dismissToast: (id: number) => void;
  enquiryProduct: Product | null;
  /** Opens the enquiry form; pass null for a general enquiry. */
  openEnquiry: (p: Product | null) => void;
  enquiryOpen: boolean;
  closeEnquiry: () => void;
  listPicker: Product | null;
  openListPicker: (p: Product) => void;
  closeListPicker: () => void;
  recentlyViewed: string[];
  markViewed: (id: string) => void;
  /** Sends a guest to the login page, returning them here afterwards. */
  requireLogin: (reason: string) => void;
}

const AppContext = createContext<AppState | null>(null);
const RECENT_KEY = 'sanskruti-recently-viewed';

let toastId = 0;

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [enquiryProduct, setEnquiryProduct] = useState<Product | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [listPicker, setListPicker] = useState<Product | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(readRecent);

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recentlyViewed));
    } catch {
      // Storage unavailable (private mode); recently viewed just won't persist.
    }
  }, [recentlyViewed]);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const notify = useCallback((message: string, tone: Toast['tone'] = 'success', action?: ToastAction) => {
    const id = ++toastId;
    // Snackbars replace each other rather than stacking, like native apps.
    setToasts([{ id, message, tone, action }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), action ? 4000 : 2800);
  }, []);

  const requireLogin = useCallback(
    (reason: string) => {
      notify(reason, 'info');
      navigate(`/login?next=${encodeURIComponent(location.pathname + location.search)}`);
    },
    [navigate, notify, location.pathname, location.search]
  );

  // ---- wishlist -----------------------------------------------------------

  const wishlistQuery = useQuery({
    queryKey: qk.wishlist(userId),
    queryFn: () => api.listWishlist(userId),
    enabled: !!userId
  });
  const wishlist = useMemo(() => (userId ? wishlistQuery.data ?? [] : []), [userId, wishlistQuery.data]);

  const wishlistMutation = useMutation({
    mutationFn: ({ productId, on }: { productId: string; on: boolean }) =>
      api.setWishlisted(userId, productId, on),
    onMutate: async ({ productId, on }) => {
      const key = qk.wishlist(userId);
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<string[]>(key) ?? [];
      queryClient.setQueryData<string[]>(key, on ? [productId, ...prev] : prev.filter((x) => x !== productId));
      return { prev };
    },
    onError: (e, _vars, ctx) => {
      if (ctx) queryClient.setQueryData(qk.wishlist(userId), ctx.prev);
      notify(friendlyError(e), 'error');
    }
  });

  const toggleWishlist = useCallback(
    (productId: string) => {
      if (!userId) {
        requireLogin('Sign in to save pieces to your wishlist');
        return;
      }
      const on = !wishlist.includes(productId);
      haptic();
      wishlistMutation.mutate({ productId, on });
      if (on) notify('Added to wishlist', 'success', { label: 'View', to: '/wishlist' });
      else notify('Removed from wishlist', 'info');
    },
    [userId, wishlist, wishlistMutation, notify, requireLogin]
  );

  // ---- saved lists --------------------------------------------------------

  const listsQuery = useQuery({
    queryKey: qk.lists(userId),
    queryFn: () => api.listSavedLists(userId),
    enabled: !!userId
  });
  const lists = useMemo(() => (userId ? listsQuery.data ?? [] : []), [userId, listsQuery.data]);

  const refreshLists = useCallback(
    () => queryClient.invalidateQueries({ queryKey: qk.lists(userId) }),
    [queryClient, userId]
  );

  /** Applies an optimistic change to the cached lists, then runs the request. */
  const mutateLists = useCallback(
    async (update: (l: SavedList[]) => SavedList[], request: () => Promise<unknown>, done?: string) => {
      const key = qk.lists(userId);
      const prev = queryClient.getQueryData<SavedList[]>(key) ?? [];
      queryClient.setQueryData<SavedList[]>(key, update(prev));
      try {
        await request();
        if (done) notify(done);
      } catch (e) {
        queryClient.setQueryData(key, prev);
        notify(friendlyError(e), 'error');
      } finally {
        void refreshLists();
      }
    },
    [queryClient, userId, notify, refreshLists]
  );

  // ---- context value ------------------------------------------------------

  const value = useMemo<AppState>(
    () => ({
      wishlist,
      isWishlisted: (id) => wishlist.includes(id),
      toggleWishlist,
      lists,
      createList: async (name, occasion) => {
        if (!userId) {
          requireLogin('Sign in to create a list');
          return null;
        }
        try {
          const list = await api.createSavedList(userId, name, occasion);
          await refreshLists();
          notify(`List “${name}” created`);
          return list;
        } catch (e) {
          notify(friendlyError(e), 'error');
          return null;
        }
      },
      renameList: (id, name) =>
        void mutateLists(
          (ls) => ls.map((l) => (l.id === id ? { ...l, name } : l)),
          () => api.updateSavedList(id, { name }),
          'List renamed'
        ),
      deleteList: (id) =>
        void mutateLists(
          (ls) => ls.filter((l) => l.id !== id),
          () => api.deleteSavedList(id),
          'List deleted'
        ),
      setListItem: (listId, productId, on) =>
        void mutateLists(
          (ls) =>
            ls.map((l) =>
              l.id !== listId
                ? l
                : {
                    ...l,
                    productIds: on
                      ? [productId, ...l.productIds.filter((p) => p !== productId)]
                      : l.productIds.filter((p) => p !== productId)
                  }
            ),
          () => api.setListItem(listId, productId, on),
          on ? 'Added to list' : 'Removed from list'
        ),
      updateListNote: (id, note) =>
        void mutateLists(
          (ls) => ls.map((l) => (l.id === id ? { ...l, note } : l)),
          () => api.updateSavedList(id, { note })
        ),
      toasts,
      notify,
      dismissToast,
      enquiryProduct,
      enquiryOpen,
      openEnquiry: (p) => {
        setEnquiryProduct(p);
        setEnquiryOpen(true);
      },
      closeEnquiry: () => setEnquiryOpen(false),
      listPicker,
      openListPicker: (p) => {
        if (!userId) {
          requireLogin('Sign in to save pieces to a list');
          return;
        }
        setListPicker(p);
      },
      closeListPicker: () => setListPicker(null),
      recentlyViewed,
      markViewed: (id) => setRecentlyViewed((r) => [id, ...r.filter((x) => x !== id)].slice(0, 12)),
      requireLogin
    }),
    [
      wishlist,
      toggleWishlist,
      lists,
      userId,
      requireLogin,
      refreshLists,
      notify,
      mutateLists,
      toasts,
      dismissToast,
      enquiryProduct,
      enquiryOpen,
      listPicker,
      recentlyViewed
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
