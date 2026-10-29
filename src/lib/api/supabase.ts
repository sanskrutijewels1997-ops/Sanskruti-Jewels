import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type {
  Category,
  Collection,
  Enquiry,
  Product,
  ProductImage,
  Profile,
  SavedList
} from '../../types';
import type { AuthUser, Backend } from './types';

const BUCKET = 'product-images';

/* eslint-disable @typescript-eslint/no-explicit-any -- rows come back untyped from PostgREST */

const PRODUCT_SELECT = '*, product_images(id, url, storage_path, sort_order)';

function toImage(r: any): ProductImage {
  return { id: r.id, url: r.url, storagePath: r.storage_path, sortOrder: r.sort_order };
}

const num = (v: unknown) => (v === null || v === undefined ? null : Number(v));

function toProduct(r: any): Product {
  return {
    id: r.id,
    sku: r.sku,
    slug: r.slug,
    name: r.name,
    description: r.description,
    categoryId: r.category_id,
    collectionId: r.collection_id,
    style: r.style,
    metal: r.metal,
    purity: r.purity,
    weightMin: r.weight_min === null ? null : Number(r.weight_min),
    weightMax: r.weight_max === null ? null : Number(r.weight_max),
    make: r.make ?? '',
    grossWeight: num(r.gross_weight),
    stoneWeight: num(r.stone_weight),
    netWeight: num(r.net_weight),
    quantity: num(r.quantity),
    stone: r.stone,
    size: r.size,
    availability: r.availability,
    price: r.price === null ? null : Number(r.price),
    showPrice: r.show_price,
    specifications: r.specifications ?? [],
    isNew: r.is_new,
    isFeatured: r.is_featured,
    isPublished: r.is_published,
    views: r.views,
    images: (r.product_images ?? []).map(toImage).sort((a: ProductImage, b: ProductImage) => a.sortOrder - b.sortOrder),
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

function toProfile(r: any): Profile {
  return {
    id: r.id,
    email: r.email ?? '',
    fullName: r.full_name,
    phone: r.phone,
    city: r.city,
    role: r.role,
    createdAt: r.created_at
  };
}

function toCategory(r: any): Category {
  return { id: r.id, slug: r.slug, name: r.name, parentId: r.parent_id ?? null, imageUrl: r.image_url, sortOrder: r.sort_order };
}

function toCollection(r: any): Collection {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    tagline: r.tagline,
    imageUrl: r.image_url,
    sortOrder: r.sort_order
  };
}

function toEnquiry(r: any): Enquiry {
  return {
    id: r.id,
    userId: r.user_id,
    productId: r.product_id,
    name: r.name,
    phone: r.phone,
    email: r.email,
    size: r.size,
    quantity: r.quantity,
    message: r.message,
    status: r.status,
    adminNote: r.admin_note,
    createdAt: r.created_at
  };
}

/** Unwraps a PostgREST response, throwing its error so react-query can surface it. */
function must<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

function toAuthUser(u: { id: string; email?: string } | null | undefined): AuthUser | null {
  return u ? { id: u.id, email: u.email ?? '' } : null;
}

export function createSupabaseBackend(url: string, anonKey: string): Backend {
  const sb: SupabaseClient = createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

  const redirectTo = () => `${window.location.origin}/reset-password`;

  return {
    mode: 'supabase',

    async getUser() {
      const { data } = await sb.auth.getSession();
      return toAuthUser(data.session?.user);
    },
    onAuthChange(cb) {
      const { data } = sb.auth.onAuthStateChange((_event, session) => cb(toAuthUser(session?.user)));
      return () => data.subscription.unsubscribe();
    },
    async signIn(email, password) {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
    },
    async signUp({ email, password, fullName, phone }) {
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, phone }, emailRedirectTo: window.location.origin }
      });
      if (error) throw new Error(error.message);
      return { needsConfirmation: !data.session };
    },
    async signOut() {
      await sb.auth.signOut();
    },
    async sendPasswordReset(email) {
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: redirectTo() });
      if (error) throw new Error(error.message);
    },
    async updatePassword(password) {
      const { error } = await sb.auth.updateUser({ password });
      if (error) throw new Error(error.message);
    },

    async getProfile(userId) {
      const data = must(await sb.from('profiles').select('*').eq('id', userId).maybeSingle());
      return data ? toProfile(data) : null;
    },
    async updateProfile(userId, patch) {
      const row: Record<string, string> = {};
      if (patch.fullName !== undefined) row.full_name = patch.fullName;
      if (patch.phone !== undefined) row.phone = patch.phone;
      if (patch.city !== undefined) row.city = patch.city;
      return toProfile(must(await sb.from('profiles').update(row).eq('id', userId).select().single()));
    },
    async listCustomers() {
      const data = must(await sb.from('profiles').select('*').order('created_at', { ascending: false }));
      return (data as any[]).map(toProfile);
    },
    async setRole(userId, role) {
      must(await sb.from('profiles').update({ role }).eq('id', userId));
    },

    async listProducts() {
      const data = must(
        await sb.from('products').select(PRODUCT_SELECT).order('created_at', { ascending: false })
      );
      return (data as any[]).map(toProduct);
    },
    async listCategories() {
      const data = must(await sb.from('categories').select('*').order('sort_order').order('name'));
      return (data as any[]).map(toCategory);
    },
    async listCollections() {
      const data = must(await sb.from('collections').select('*').order('sort_order').order('name'));
      return (data as any[]).map(toCollection);
    },
    async recordView(productId) {
      await sb.rpc('record_product_view', { p_product_id: productId });
    },

    async saveProduct(input) {
      const row = {
        sku: input.sku,
        slug: input.slug,
        name: input.name,
        description: input.description,
        category_id: input.categoryId,
        collection_id: input.collectionId,
        style: input.style,
        metal: input.metal,
        purity: input.purity,
        weight_min: input.weightMin,
        weight_max: input.weightMax,
        make: input.make,
        gross_weight: input.grossWeight,
        stone_weight: input.stoneWeight,
        net_weight: input.netWeight,
        quantity: input.quantity,
        stone: input.stone,
        size: input.size,
        availability: input.availability,
        price: input.price,
        show_price: input.showPrice,
        specifications: input.specifications,
        is_new: input.isNew,
        is_featured: input.isFeatured,
        is_published: input.isPublished
      };
      const saved = input.id
        ? must(await sb.from('products').update(row).eq('id', input.id).select('id').single())
        : must(await sb.from('products').insert(row).select('id').single());
      const productId = (saved as any).id as string;

      const orphaned = must(
        await sb.rpc('replace_product_images', {
          p_product_id: productId,
          p_images: input.images.map((img) => ({
            url: img.url,
            storage_path: img.storagePath,
            alt: input.name
          }))
        })
      ) as string[];
      if (orphaned?.length) await sb.storage.from(BUCKET).remove(orphaned);

      return toProduct(
        must(await sb.from('products').select(PRODUCT_SELECT).eq('id', productId).single())
      );
    },
    async deleteProduct(id) {
      const imgs = must(
        await sb.from('product_images').select('storage_path').eq('product_id', id)
      ) as any[];
      must(await sb.from('products').delete().eq('id', id));
      const paths = imgs.map((r) => r.storage_path).filter(Boolean);
      if (paths.length) await sb.storage.from(BUCKET).remove(paths);
    },
    async saveCategory(input) {
      const row = {
        slug: input.slug,
        name: input.name,
        parent_id: input.parentId,
        image_url: input.imageUrl,
        sort_order: input.sortOrder
      };
      const q = input.id
        ? sb.from('categories').update(row).eq('id', input.id)
        : sb.from('categories').insert(row);
      return toCategory(must(await q.select().single()));
    },
    async deleteCategory(id) {
      must(await sb.from('categories').delete().eq('id', id));
    },
    async saveCollection(input) {
      const row = {
        slug: input.slug,
        name: input.name,
        tagline: input.tagline,
        image_url: input.imageUrl,
        sort_order: input.sortOrder
      };
      const q = input.id
        ? sb.from('collections').update(row).eq('id', input.id)
        : sb.from('collections').insert(row);
      return toCollection(must(await q.select().single()));
    },
    async deleteCollection(id) {
      must(await sb.from('collections').delete().eq('id', id));
    },
    async uploadImage(file, folder) {
      const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error } = await sb.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type, cacheControl: '31536000', upsert: false });
      if (error) throw new Error(error.message);
      const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
      return { url: data.publicUrl, storagePath: path };
    },
    async removeImages(paths) {
      if (paths.length) await sb.storage.from(BUCKET).remove(paths);
    },
    async adminStats() {
      const r = must(await sb.rpc('admin_stats')) as any;
      return {
        products: r.products,
        published: r.published,
        customers: r.customers,
        enquiriesOpen: r.enquiries_open,
        wishlistAdds: r.wishlist_adds,
        totalViews: r.total_views,
        topWishlisted: r.top_wishlisted,
        byCategory: r.by_category
      };
    },

    async listWishlist(userId) {
      const data = must(
        await sb
          .from('wishlist_items')
          .select('product_id')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
      ) as any[];
      return data.map((r) => r.product_id);
    },
    async setWishlisted(userId, productId, on) {
      if (on) {
        must(
          await sb
            .from('wishlist_items')
            .upsert({ user_id: userId, product_id: productId }, { ignoreDuplicates: true })
        );
      } else {
        must(
          await sb.from('wishlist_items').delete().eq('user_id', userId).eq('product_id', productId)
        );
      }
    },

    async listSavedLists(userId) {
      const data = must(
        await sb
          .from('saved_lists')
          .select('*, saved_list_items(product_id, created_at)')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
      ) as any[];
      return data.map(
        (r): SavedList => ({
          id: r.id,
          name: r.name,
          occasion: r.occasion,
          note: r.note,
          updatedAt: r.updated_at,
          productIds: (r.saved_list_items ?? [])
            .sort((a: any, b: any) => b.created_at.localeCompare(a.created_at))
            .map((i: any) => i.product_id)
        })
      );
    },
    async createSavedList(userId, name, occasion) {
      const r = must(
        await sb.from('saved_lists').insert({ user_id: userId, name, occasion }).select().single()
      ) as any;
      return { id: r.id, name: r.name, occasion: r.occasion, note: r.note, updatedAt: r.updated_at, productIds: [] };
    },
    async updateSavedList(id, patch) {
      must(await sb.from('saved_lists').update(patch).eq('id', id));
    },
    async deleteSavedList(id) {
      must(await sb.from('saved_lists').delete().eq('id', id));
    },
    async setListItem(listId, productId, on) {
      if (on) {
        must(
          await sb
            .from('saved_list_items')
            .upsert({ list_id: listId, product_id: productId }, { ignoreDuplicates: true })
        );
      } else {
        must(
          await sb.from('saved_list_items').delete().eq('list_id', listId).eq('product_id', productId)
        );
      }
      // Bump the list so it sorts to the top.
      await sb.from('saved_lists').update({ updated_at: new Date().toISOString() }).eq('id', listId);
    },

    async createEnquiry(userId, input) {
      must(
        await sb.from('enquiries').insert({
          user_id: userId,
          product_id: input.productId,
          name: input.name,
          phone: input.phone,
          email: input.email,
          size: input.size,
          quantity: input.quantity,
          message: input.message
        })
      );
    },
    async listMyEnquiries(userId) {
      const data = must(
        await sb
          .from('enquiries')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
      ) as any[];
      return data.map(toEnquiry);
    },
    async listAllEnquiries() {
      const data = must(
        await sb.from('enquiries').select('*').order('created_at', { ascending: false })
      ) as any[];
      return data.map(toEnquiry);
    },
    async updateEnquiry(id, patch) {
      const row: Record<string, string> = {};
      if (patch.status) row.status = patch.status;
      if (patch.adminNote !== undefined) row.admin_note = patch.adminNote;
      must(await sb.from('enquiries').update(row).eq('id', id));
    }
  };
}
