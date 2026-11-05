import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type {
  Category,
  DeletedItem,
  DeletedKind,
  Enquiry,
  Product,
  ProductImage,
  Profile,
  SavedList
} from '../../types';
import { splitExpired } from '../recovery';
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
    style: r.style,
    metal: r.metal,
    purity: r.purity,
    weightMin: r.weight_min === null ? null : Number(r.weight_min),
    weightMax: r.weight_max === null ? null : Number(r.weight_max),
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

  /** Removes a deleted item for good, along with its product photos. */
  const purge = async (kind: DeletedKind, id: string) => {
    if (kind === 'product') {
      const imgs = must(await sb.from('product_images').select('storage_path').eq('product_id', id)) as any[];
      must(await sb.from('products').delete().eq('id', id));
      const paths = imgs.map((r) => r.storage_path).filter(Boolean);
      if (paths.length) await sb.storage.from(BUCKET).remove(paths);
    } else {
      must(await sb.from(kind === 'category' ? 'categories' : 'enquiries').delete().eq('id', id));
    }
  };

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
        await sb.from('products').select(PRODUCT_SELECT).is('deleted_at', null).order('created_at', { ascending: false })
      );
      return (data as any[]).map(toProduct);
    },
    async listCategories() {
      const data = must(await sb.from('categories').select('*').is('deleted_at', null).order('sort_order').order('name'));
      return (data as any[]).map(toCategory);
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
        style: input.style,
        metal: input.metal,
        purity: input.purity,
        weight_min: input.weightMin,
        weight_max: input.weightMax,
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
      must(await sb.from('products').update({ deleted_at: new Date().toISOString() }).eq('id', id));
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
      // Sub-categories go with their parent, sharing its timestamp so they return with it.
      must(
        await sb
          .from('categories')
          .update({ deleted_at: new Date().toISOString() })
          .or(`id.eq.${id},parent_id.eq.${id}`)
          .is('deleted_at', null)
      );
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
          .select('product_id, products(deleted_at)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
      ) as any[];
      return data.filter((r) => r.products && !r.products.deleted_at).map((r) => r.product_id);
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
          .select('*, saved_list_items(product_id, created_at, products(deleted_at))')
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
            .filter((i: any) => i.products && !i.products.deleted_at)
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
          .is('deleted_at', null)
          .order('created_at', { ascending: false })
      ) as any[];
      return data.map(toEnquiry);
    },
    async listAllEnquiries() {
      const data = must(
        await sb.from('enquiries').select('*').is('deleted_at', null).order('created_at', { ascending: false })
      ) as any[];
      return data.map(toEnquiry);
    },
    async updateEnquiry(id, patch) {
      const row: Record<string, string> = {};
      if (patch.status) row.status = patch.status;
      if (patch.adminNote !== undefined) row.admin_note = patch.adminNote;
      must(await sb.from('enquiries').update(row).eq('id', id));
    },
    async deleteEnquiry(id) {
      must(await sb.from('enquiries').update({ deleted_at: new Date().toISOString() }).eq('id', id));
    },

    async listDeleted() {
      const [products, categories, enquiries] = await Promise.all([
        sb.from('products').select('id, sku, name, deleted_at, product_images(url, sort_order)').not('deleted_at', 'is', null),
        sb.from('categories').select('id, name, parent_id, image_url, deleted_at').not('deleted_at', 'is', null),
        sb.from('enquiries').select('id, name, phone, deleted_at').not('deleted_at', 'is', null)
      ]);
      const cats = must(categories) as any[];
      const deletedWithParent = (c: any) =>
        cats.some((p) => p.id === c.parent_id && new Date(p.deleted_at).getTime() === new Date(c.deleted_at).getTime());
      const items: DeletedItem[] = [
        ...(must(products) as any[]).map((p) => ({
          kind: 'product' as const,
          id: p.id,
          title: p.name,
          detail: p.sku,
          sku: p.sku,
          imageUrl: [...(p.product_images ?? [])].sort((a: any, b: any) => a.sort_order - b.sort_order)[0]?.url ?? null,
          deletedAt: p.deleted_at
        })),
        ...cats
          .filter((c) => !deletedWithParent(c))
          .map((c) => ({
            kind: 'category' as const,
            id: c.id,
            title: c.name,
            detail: cats.some((s) => s.parent_id === c.id) ? 'Includes its sub-categories' : '',
            imageUrl: c.image_url,
            deletedAt: c.deleted_at
          })),
        ...(must(enquiries) as any[]).map((e) => ({
          kind: 'enquiry' as const,
          id: e.id,
          title: e.name,
          detail: e.phone,
          imageUrl: null,
          deletedAt: e.deleted_at
        }))
      ];
      const { active, expired } = splitExpired(items);
      await Promise.all(expired.map((i) => purge(i.kind, i.id)));
      return active;
    },
    async restoreDeleted(kind, id) {
      if (kind === 'product' || kind === 'enquiry') {
        must(await sb.from(kind === 'product' ? 'products' : 'enquiries').update({ deleted_at: null }).eq('id', id));
        return;
      }
      const cat = must(await sb.from('categories').select('id, parent_id, deleted_at').eq('id', id).single()) as any;
      const targets = [cat];
      // A sub-category can't come back without its parent.
      if (cat.parent_id) {
        const parent = must(await sb.from('categories').select('id, parent_id, deleted_at').eq('id', cat.parent_id).single()) as any;
        if (parent.deleted_at) targets.push(parent);
      }
      for (const t of targets) {
        must(
          await sb
            .from('categories')
            .update({ deleted_at: null })
            .or(`id.eq.${t.id},parent_id.eq.${t.id}`)
            .eq('deleted_at', t.deleted_at)
        );
      }
    },
    purgeDeleted: purge
  };
}
