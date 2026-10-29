import { useQuery } from '@tanstack/react-query';
import { api } from './api';
import { categoryPath as pathOf } from './filters';

export const qk = {
  products: ['products'] as const,
  categories: ['categories'] as const,
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

/** Catalogue lookups shared by most pages. */
export function useCatalogue() {
  const products = useProducts();
  const categories = useCategories();
  const all = products.data ?? [];
  return {
    loading: products.isLoading || categories.isLoading,
    error: products.error ?? categories.error,
    products: all,
    published: all.filter((p) => p.isPublished),
    categories: categories.data ?? [],
    byId: (id: string) => all.find((p) => p.id === id),
    categoryName: (id: string | null) => categories.data?.find((c) => c.id === id)?.name ?? '',
    /** "Rings › Gents Rings" for sub-categories. */
    categoryPath: (id: string | null) => pathOf(id, categories.data ?? []),
    /** Main categories only, in display order. */
    topCategories: (categories.data ?? []).filter((c) => !c.parentId),
    subcategoriesOf: (id: string) => (categories.data ?? []).filter((c) => c.parentId === id)
  };
}
