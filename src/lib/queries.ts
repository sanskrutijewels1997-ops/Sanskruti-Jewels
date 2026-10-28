import { useQuery } from '@tanstack/react-query';
import { api } from './api';

export const qk = {
  products: ['products'] as const,
  categories: ['categories'] as const,
  collections: ['collections'] as const,
  wishlist: (userId: string) => ['wishlist', userId] as const,
  lists: (userId: string) => ['lists', userId] as const,
  myEnquiries: (userId: string) => ['enquiries', 'mine', userId] as const,
  allEnquiries: ['enquiries', 'all'] as const,
  customers: ['customers'] as const,
  stats: ['stats'] as const
};

export function useProducts() {
  return useQuery({ queryKey: qk.products, queryFn: () => api.listProducts() });
}

export function useCategories() {
  return useQuery({ queryKey: qk.categories, queryFn: () => api.listCategories() });
}

export function useCollections() {
  return useQuery({ queryKey: qk.collections, queryFn: () => api.listCollections() });
}

/** Catalogue lookups shared by most pages. */
export function useCatalogue() {
  const products = useProducts();
  const categories = useCategories();
  const collections = useCollections();
  const all = products.data ?? [];
  return {
    loading: products.isLoading || categories.isLoading || collections.isLoading,
    error: products.error ?? categories.error ?? collections.error,
    products: all,
    published: all.filter((p) => p.isPublished),
    categories: categories.data ?? [],
    collections: collections.data ?? [],
    byId: (id: string) => all.find((p) => p.id === id),
    categoryName: (id: string | null) => categories.data?.find((c) => c.id === id)?.name ?? '',
    collectionName: (id: string | null) => collections.data?.find((c) => c.id === id)?.name ?? ''
  };
}
