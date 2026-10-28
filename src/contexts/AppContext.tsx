import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState } from
'react';
import { initialCollections, initialQuotes } from '../data/collections';
import type { CustomerCollection, Product, QuoteRequest } from '../types';

interface Toast {
  id: number;
  message: string;
  tone: 'success' | 'info' | 'error';
}

interface AppState {
  saved: string[];
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
  collections: CustomerCollection[];
  createCollection: (name: string, customer: string, occasion: string) => void;
  renameCollection: (id: string, name: string) => void;
  deleteCollection: (id: string) => void;
  addToCollection: (collectionId: string, productId: string) => void;
  removeFromCollection: (collectionId: string, productId: string) => void;
  updateNote: (collectionId: string, note: string) => void;
  quotes: QuoteRequest[];
  addQuote: (q: Omit<QuoteRequest, 'id' | 'status' | 'raised'>) => string;
  toasts: Toast[];
  notify: (message: string, tone?: Toast['tone']) => void;
  dismissToast: (id: number) => void;
  loggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
  quickView: Product | null;
  setQuickView: (p: Product | null) => void;
  quoteProduct: Product | null;
  setQuoteProduct: (p: Product | null) => void;
  collectionPicker: Product | null;
  setCollectionPicker: (p: Product | null) => void;
  recentlyViewed: string[];
  markViewed: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

let toastId = 0;

export function AppProvider({ children }: {children: React.ReactNode;}) {
  const [saved, setSaved] = useState<string[]>([
  'KYJ-102853',
  'KYJ-102884',
  'KYJ-103063',
  'KYJ-102938']
  );
  const [collections, setCollections] = useState<CustomerCollection[]>(initialCollections);
  const [quotes, setQuotes] = useState<QuoteRequest[]>(initialQuotes);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [quoteProduct, setQuoteProduct] = useState<Product | null>(null);
  const [collectionPicker, setCollectionPicker] = useState<Product | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([
  'KYJ-102968',
  'KYJ-103044',
  'KYJ-102911',
  'KYJ-102957',
  'KYJ-103096']
  );

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, tone: Toast['tone'] = 'success') => {
      const id = ++toastId;
      setToasts((t) => [...t, { id, message, tone }]);
      window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
    },
    []
  );

  const toggleSave = useCallback(
    (id: string) => {
      setSaved((prev) => {
        const has = prev.includes(id);
        notify(has ? 'Removed from saved designs' : 'Saved to your designs', has ? 'info' : 'success');
        return has ? prev.filter((x) => x !== id) : [...prev, id];
      });
    },
    [notify]
  );

  const value = useMemo<AppState>(
    () => ({
      saved,
      toggleSave,
      isSaved: (id: string) => saved.includes(id),
      collections,
      createCollection: (name, customer, occasion) => {
        setCollections((c) => [
        {
          id: `COL-${Math.floor(Math.random() * 9000 + 1000)}`,
          name,
          customer,
          occasion,
          productIds: [],
          note: '',
          updated: 'Just now',
          preference: 'New collection'
        },
        ...c]
        );
        notify(`Collection “${name}” created`);
      },
      renameCollection: (id, name) => {
        setCollections((c) => c.map((x) => x.id === id ? { ...x, name, updated: 'Just now' } : x));
        notify('Collection renamed');
      },
      deleteCollection: (id) => {
        setCollections((c) => c.filter((x) => x.id !== id));
        notify('Collection deleted', 'info');
      },
      addToCollection: (collectionId, productId) => {
        setCollections((c) =>
        c.map((x) =>
        x.id === collectionId && !x.productIds.includes(productId) ?
        { ...x, productIds: [productId, ...x.productIds], updated: 'Just now' } :
        x
        )
        );
        notify('Added to customer collection');
      },
      removeFromCollection: (collectionId, productId) => {
        setCollections((c) =>
        c.map((x) =>
        x.id === collectionId ?
        { ...x, productIds: x.productIds.filter((p) => p !== productId), updated: 'Just now' } :
        x
        )
        );
        notify('Removed from collection', 'info');
      },
      updateNote: (collectionId, note) => {
        setCollections((c) => c.map((x) => x.id === collectionId ? { ...x, note } : x));
      },
      quotes,
      addQuote: (q) => {
        const id = `QR-${Math.floor(Math.random() * 9000 + 1000)}`;
        setQuotes((prev) => [
        { ...q, id, status: 'Sent', raised: '22 Aug 2026' },
        ...prev]
        );
        return id;
      },
      toasts,
      notify,
      dismissToast,
      loggedIn,
      setLoggedIn,
      quickView,
      setQuickView,
      quoteProduct,
      setQuoteProduct,
      collectionPicker,
      setCollectionPicker,
      recentlyViewed,
      markViewed: (id: string) =>
      setRecentlyViewed((r) => [id, ...r.filter((x) => x !== id)].slice(0, 8))
    }),
    [
    saved,
    toggleSave,
    collections,
    quotes,
    toasts,
    notify,
    dismissToast,
    loggedIn,
    quickView,
    quoteProduct,
    collectionPicker,
    recentlyViewed]

  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}