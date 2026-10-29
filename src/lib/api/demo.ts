import { seedCategories, seedCollections, seedProducts } from '../../data/seed';
import type {
  Category,
  Collection,
  Enquiry,
  Product,
  Profile,
  SavedList
} from '../../types';
import type { AuthUser, Backend } from './types';

/**
 * Browser-local backend used when VITE_SUPABASE_URL is not set. Everything lives in
 * localStorage, so it is only for previews: nothing is shared between devices and
 * passwords are stored in plain text. It mirrors the permission rules of the real
 * schema so the UI behaves the same way.
 */

// Bump when the seed shape changes so browsers re-seed instead of loading stale data.
const KEY = 'sanskruti-demo-db-v2';

interface DemoUser {
  id: string;
  email: string;
  password: string;
}

interface DB {
  users: DemoUser[];
  profiles: Profile[];
  session: string | null;
  categories: Category[];
  collections: Collection[];
  products: Product[];
  wishlist: { userId: string; productId: string; createdAt: string }[];
  lists: (Omit<SavedList, 'productIds'> & { userId: string })[];
  listItems: { listId: string; productId: string; createdAt: string }[];
  enquiries: Enquiry[];
}

export const DEMO_ACCOUNTS = {
  admin: { email: 'admin@sanskruti.demo', password: 'admin123' },
  customer: { email: 'customer@sanskruti.demo', password: 'customer123' }
};

const uid = () => crypto.randomUUID();
const now = () => new Date().toISOString();

function seed(): DB {
  const ids = new Map(seedCategories.map((c) => [c.slug, uid()]));
  const categories: Category[] = seedCategories.map((c, i) => ({
    id: ids.get(c.slug)!,
    slug: c.slug,
    name: c.name,
    parentId: c.parent ? ids.get(c.parent)! : null,
    imageUrl: c.image,
    sortOrder: i
  }));
  const collections: Collection[] = seedCollections.map((c, i) => ({
    id: uid(),
    slug: c.slug,
    name: c.name,
    tagline: c.tagline,
    imageUrl: c.image,
    sortOrder: i
  }));
  const products: Product[] = seedProducts.map((p) => {
    const created = new Date(Date.now() - p.ageDays * 86400000).toISOString();
    return {
      id: uid(),
      sku: p.sku,
      slug: p.slug,
      name: p.name,
      description: p.description,
      categoryId: categories.find((c) => c.slug === p.category)?.id ?? null,
      collectionId: collections.find((c) => c.slug === p.collection)?.id ?? null,
      style: p.style,
      metal: p.metal,
      purity: p.purity,
      weightMin: p.weightMin,
      weightMax: p.weightMax,
      make: p.make,
      grossWeight: p.grossWeight,
      stoneWeight: p.stoneWeight,
      netWeight: p.netWeight,
      quantity: p.quantity,
      stone: p.stone,
      size: p.size,
      availability: p.availability,
      price: p.price,
      showPrice: p.showPrice,
      specifications: p.specifications,
      isNew: p.isNew,
      isFeatured: p.isFeatured,
      isPublished: true,
      views: p.views,
      images: p.images.map((url, i) => ({ id: uid(), url, storagePath: null, sortOrder: i })),
      createdAt: created,
      updatedAt: created
    };
  });
  const adminId = uid();
  const customerId = uid();
  return {
    users: [
      { id: adminId, ...DEMO_ACCOUNTS.admin },
      { id: customerId, ...DEMO_ACCOUNTS.customer }
    ],
    profiles: [
      {
        id: adminId,
        email: DEMO_ACCOUNTS.admin.email,
        fullName: 'Store Admin',
        phone: '',
        city: '',
        role: 'admin',
        createdAt: now()
      },
      {
        id: customerId,
        email: DEMO_ACCOUNTS.customer.email,
        fullName: 'Ananya Kulkarni',
        phone: '+91 98765 43210',
        city: 'Pune',
        role: 'customer',
        createdAt: now()
      }
    ],
    session: null,
    categories,
    collections,
    products,
    wishlist: [],
    lists: [],
    listItems: [],
    enquiries: []
  };
}

function load(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as DB;
  } catch {
    // Corrupt or blocked storage: fall through to a fresh seed.
  }
  return seed();
}

let db = load();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    // Quota exceeded (large uploaded images) or storage blocked: keep working in memory.
  }
}

/**
 * Simulates network latency so loading states are exercised. Returns a deep copy so
 * callers can never mutate the stored rows (a real backend never shares references).
 */
const LATENCY_MS = import.meta.env.MODE === 'test' ? 0 : 120;
const tick = <T,>(v: T) => new Promise<T>((r) => window.setTimeout(() => r(structuredClone(v)), LATENCY_MS));

function currentProfile() {
  return db.profiles.find((p) => p.id === db.session) ?? null;
}
function isAdmin() {
  return currentProfile()?.role === 'admin';
}
function requireAdmin() {
  if (!isAdmin()) throw new Error('Admins only');
}
function requireUser(userId: string) {
  if (db.session !== userId) throw new Error('Not signed in');
}

const listeners = new Set<(u: AuthUser | null) => void>();
function emitAuth() {
  const u = db.users.find((x) => x.id === db.session);
  listeners.forEach((cb) => cb(u ? { id: u.id, email: u.email } : null));
}

function blobToDataUrl(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

export function createDemoBackend(): Backend {
  return {
    mode: 'demo',

    async getUser() {
      const u = db.users.find((x) => x.id === db.session);
      return u ? { id: u.id, email: u.email } : null;
    },
    onAuthChange(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    async signIn(email, password) {
      const u = db.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
      if (!u || u.password !== password) throw new Error('Invalid login credentials');
      db.session = u.id;
      persist();
      await tick(null);
      emitAuth();
    },
    async signUp({ email, password, fullName, phone }) {
      const e = email.trim().toLowerCase();
      if (db.users.some((x) => x.email.toLowerCase() === e)) throw new Error('User already registered');
      if (password.length < 6) throw new Error('Password should be at least 6 characters');
      const id = uid();
      db.users.push({ id, email: e, password });
      db.profiles.push({ id, email: e, fullName, phone, city: '', role: 'customer', createdAt: now() });
      db.session = id;
      persist();
      await tick(null);
      emitAuth();
      return { needsConfirmation: false };
    },
    async signOut() {
      db.session = null;
      persist();
      emitAuth();
    },
    async sendPasswordReset() {
      await tick(null);
    },
    async updatePassword(password) {
      const u = db.users.find((x) => x.id === db.session);
      if (!u) throw new Error('Not signed in');
      u.password = password;
      persist();
    },

    async getProfile(userId) {
      return tick(db.profiles.find((p) => p.id === userId) ?? null);
    },
    async updateProfile(userId, patch) {
      requireUser(userId);
      const p = db.profiles.find((x) => x.id === userId);
      if (!p) throw new Error('Profile not found');
      Object.assign(p, patch);
      persist();
      return tick({ ...p });
    },
    async listCustomers() {
      requireAdmin();
      return tick([...db.profiles].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    },
    async setRole(userId, role) {
      requireAdmin();
      const p = db.profiles.find((x) => x.id === userId);
      if (p) p.role = role;
      persist();
    },

    async listProducts() {
      const admin = isAdmin();
      return tick(
        db.products
          .filter((p) => p.isPublished || admin)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      );
    },
    async listCategories() {
      return tick([...db.categories].sort((a, b) => a.sortOrder - b.sortOrder));
    },
    async listCollections() {
      return tick([...db.collections].sort((a, b) => a.sortOrder - b.sortOrder));
    },
    async recordView(productId) {
      const p = db.products.find((x) => x.id === productId);
      if (p) p.views += 1;
      persist();
    },

    async saveProduct(input) {
      requireAdmin();
      const clash = db.products.find(
        (p) => p.id !== input.id && (p.sku === input.sku || p.slug === input.slug)
      );
      if (clash) throw new Error('duplicate key value violates unique constraint (SKU or URL slug already used)');
      const images = input.images.map((img, i) => ({ id: uid(), ...img, sortOrder: i }));
      const { images: _ignored, ...fields } = input;
      void _ignored;
      let product: Product;
      if (input.id) {
        const existing = db.products.find((p) => p.id === input.id);
        if (!existing) throw new Error('Product not found');
        Object.assign(existing, fields, { images, updatedAt: now() });
        product = existing;
      } else {
        product = { ...fields, id: uid(), views: 0, images, createdAt: now(), updatedAt: now() };
        db.products.push(product);
      }
      persist();
      return tick({ ...product });
    },
    async deleteProduct(id) {
      requireAdmin();
      db.products = db.products.filter((p) => p.id !== id);
      db.wishlist = db.wishlist.filter((w) => w.productId !== id);
      db.listItems = db.listItems.filter((w) => w.productId !== id);
      persist();
    },
    async saveCategory(input) {
      requireAdmin();
      if (db.categories.some((c) => c.id !== input.id && c.slug === input.slug)) {
        throw new Error('A category with this slug already exists');
      }
      if (input.parentId) {
        if (input.parentId === input.id) throw new Error('A category cannot be its own parent');
        if (db.categories.find((c) => c.id === input.parentId)?.parentId) {
          throw new Error('Sub-categories can only be one level deep');
        }
        if (input.id && db.categories.some((c) => c.parentId === input.id)) {
          throw new Error('A category with sub-categories cannot become a sub-category');
        }
      }
      let cat = db.categories.find((c) => c.id === input.id);
      if (cat) Object.assign(cat, input);
      else {
        cat = { ...input, id: uid() };
        db.categories.push(cat);
      }
      persist();
      return tick({ ...cat });
    },
    async deleteCategory(id) {
      requireAdmin();
      // Sub-categories go with their parent (ON DELETE CASCADE in the database).
      const removed = new Set([id, ...db.categories.filter((c) => c.parentId === id).map((c) => c.id)]);
      db.categories = db.categories.filter((c) => !removed.has(c.id));
      db.products.forEach((p) => {
        if (p.categoryId && removed.has(p.categoryId)) p.categoryId = null;
      });
      persist();
    },
    async saveCollection(input) {
      requireAdmin();
      if (db.collections.some((c) => c.id !== input.id && c.slug === input.slug)) {
        throw new Error('A collection with this slug already exists');
      }
      let col = db.collections.find((c) => c.id === input.id);
      if (col) Object.assign(col, input);
      else {
        col = { ...input, id: uid() };
        db.collections.push(col);
      }
      persist();
      return tick({ ...col });
    },
    async deleteCollection(id) {
      requireAdmin();
      db.collections = db.collections.filter((c) => c.id !== id);
      db.products.forEach((p) => {
        if (p.collectionId === id) p.collectionId = null;
      });
      persist();
    },
    async uploadImage(file) {
      requireAdmin();
      return { url: await blobToDataUrl(file), storagePath: null };
    },
    async removeImages() {
      // Images are inlined as data URLs in demo mode; nothing to delete.
    },
    async adminStats() {
      requireAdmin();
      const counts = new Map<string, number>();
      db.wishlist.forEach((w) => counts.set(w.productId, (counts.get(w.productId) ?? 0) + 1));
      const byCat = new Map<string, number>();
      db.products.forEach((p) => {
        const name = db.categories.find((c) => c.id === p.categoryId)?.name ?? 'Uncategorised';
        byCat.set(name, (byCat.get(name) ?? 0) + 1);
      });
      return tick({
        products: db.products.length,
        published: db.products.filter((p) => p.isPublished).length,
        customers: db.profiles.filter((p) => p.role === 'customer').length,
        enquiriesOpen: db.enquiries.filter((e) => e.status !== 'Closed').length,
        wishlistAdds: db.wishlist.length,
        totalViews: db.products.reduce((s, p) => s + p.views, 0),
        topWishlisted: [...counts.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .flatMap(([id, count]) => {
            const p = db.products.find((x) => x.id === id);
            return p ? [{ id, name: p.name, sku: p.sku, count }] : [];
          }),
        byCategory: [...byCat.entries()]
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
      });
    },

    async listWishlist(userId) {
      requireUser(userId);
      return tick(
        db.wishlist
          .filter((w) => w.userId === userId)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .map((w) => w.productId)
      );
    },
    async setWishlisted(userId, productId, on) {
      requireUser(userId);
      db.wishlist = db.wishlist.filter((w) => !(w.userId === userId && w.productId === productId));
      if (on) db.wishlist.push({ userId, productId, createdAt: now() });
      persist();
    },

    async listSavedLists(userId) {
      requireUser(userId);
      return tick(
        db.lists
          .filter((l) => l.userId === userId)
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
          .map(({ userId: _u, ...l }) => {
            void _u;
            return {
              ...l,
              productIds: db.listItems
                .filter((i) => i.listId === l.id)
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                .map((i) => i.productId)
            };
          })
      );
    },
    async createSavedList(userId, name, occasion) {
      requireUser(userId);
      const list = { id: uid(), userId, name, occasion, note: '', updatedAt: now() };
      db.lists.push(list);
      persist();
      return { id: list.id, name, occasion, note: '', updatedAt: list.updatedAt, productIds: [] };
    },
    async updateSavedList(id, patch) {
      const l = db.lists.find((x) => x.id === id && x.userId === db.session);
      if (!l) throw new Error('List not found');
      Object.assign(l, patch, { updatedAt: now() });
      persist();
    },
    async deleteSavedList(id) {
      db.lists = db.lists.filter((x) => !(x.id === id && x.userId === db.session));
      db.listItems = db.listItems.filter((i) => i.listId !== id);
      persist();
    },
    async setListItem(listId, productId, on) {
      const l = db.lists.find((x) => x.id === listId && x.userId === db.session);
      if (!l) throw new Error('List not found');
      db.listItems = db.listItems.filter((i) => !(i.listId === listId && i.productId === productId));
      if (on) db.listItems.push({ listId, productId, createdAt: now() });
      l.updatedAt = now();
      persist();
    },

    async createEnquiry(userId, input) {
      db.enquiries.push({
        ...input,
        id: uid(),
        userId,
        status: 'New',
        adminNote: '',
        createdAt: now()
      });
      persist();
      await tick(null);
    },
    async listMyEnquiries(userId) {
      requireUser(userId);
      return tick(
        db.enquiries
          .filter((e) => e.userId === userId)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      );
    },
    async listAllEnquiries() {
      requireAdmin();
      return tick([...db.enquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    },
    async updateEnquiry(id, patch) {
      requireAdmin();
      const e = db.enquiries.find((x) => x.id === id);
      if (e) Object.assign(e, patch);
      persist();
    }
  };
}

/** Wipes the browser-local demo database and re-seeds it. */
export function resetDemoData() {
  db = seed();
  persist();
  emitAuth();
}
