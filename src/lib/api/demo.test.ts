import { beforeEach, describe, expect, it } from 'vitest';
import { DEMO_ACCOUNTS, createDemoBackend } from './demo';
import { seedCategories, seedCollections, seedProducts } from '../../data/seed';
import type { ProductInput } from '../../types';

const api = createDemoBackend();
const asAdmin = () => api.signIn(DEMO_ACCOUNTS.admin.email, DEMO_ACCOUNTS.admin.password);
const asCustomer = () => api.signIn(DEMO_ACCOUNTS.customer.email, DEMO_ACCOUNTS.customer.password);

function input(over: Partial<ProductInput> = {}): ProductInput {
  return {
    sku: 'SJ-9001',
    slug: 'test-ring-9001',
    name: 'Test Ring',
    description: '',
    categoryId: null,
    collectionId: null,
    style: 'Modern',
    metal: 'Gold',
    purity: '22K',
    weightMin: 2,
    weightMax: 3,
    make: 'Handmade',
    grossWeight: 3,
    stoneWeight: 0,
    netWeight: 3,
    quantity: 2,
    stone: '',
    size: '',
    availability: 'Ready Stock',
    price: null,
    showPrice: false,
    specifications: [],
    isNew: true,
    isFeatured: false,
    isPublished: true,
    images: [{ url: '/images/gold-ring.jpg', storagePath: null }],
    ...over
  };
}

beforeEach(async () => {
  await api.signOut();
});

describe('seed data', () => {
  it('loads the starter catalogue', async () => {
    expect(await api.listProducts()).toHaveLength(seedProducts.length);
    expect(await api.listCategories()).toHaveLength(seedCategories.length);
    expect(await api.listCollections()).toHaveLength(seedCollections.length);
  });

  it('links every seeded product to its category and keeps image order', async () => {
    const products = await api.listProducts();
    expect(products.every((p) => p.categoryId)).toBe(true);
    expect(products[0].images.map((i) => i.sortOrder)).toEqual(products[0].images.map((_, i) => i));
  });
});

describe('auth', () => {
  it('rejects a wrong password and accepts the right one', async () => {
    await expect(api.signIn(DEMO_ACCOUNTS.customer.email, 'nope')).rejects.toThrow('Invalid login credentials');
    await asCustomer();
    expect((await api.getUser())?.email).toBe(DEMO_ACCOUNTS.customer.email);
  });

  it('signs up a new customer and refuses duplicates', async () => {
    const seen: (string | null)[] = [];
    const stop = api.onAuthChange((u) => seen.push(u?.email ?? null));
    await api.signUp({ email: 'New@Example.com', password: 'secret12', fullName: 'Asha', phone: '1' });
    stop();
    const user = await api.getUser();
    expect(user?.email).toBe('new@example.com');
    expect((await api.getProfile(user!.id))?.role).toBe('customer');
    expect(seen).toEqual(['new@example.com']);
    await expect(api.signUp({ email: 'new@example.com', password: 'secret12', fullName: '', phone: '' })).rejects.toThrow('already registered');
  });

  it('enforces a minimum password length', async () => {
    await expect(api.signUp({ email: 'a@b.c', password: '123', fullName: '', phone: '' })).rejects.toThrow('at least 6');
  });

  it('lets a signed-in user change their password', async () => {
    await asCustomer();
    await api.updatePassword('newpass99');
    await api.signOut();
    await expect(api.signIn(DEMO_ACCOUNTS.customer.email, DEMO_ACCOUNTS.customer.password)).rejects.toThrow();
    await api.signIn(DEMO_ACCOUNTS.customer.email, 'newpass99');
  });
});

describe('permissions (mirror the database RLS rules)', () => {
  it('blocks guests and customers from every admin action', async () => {
    for (const login of [async () => undefined, asCustomer]) {
      await api.signOut();
      await login();
      await expect(api.saveProduct(input())).rejects.toThrow('Admins only');
      await expect(api.deleteProduct('x')).rejects.toThrow('Admins only');
      await expect(api.saveCategory({ slug: 'x', name: 'X', imageUrl: null, parentId: null, sortOrder: 0 })).rejects.toThrow('Admins only');
      await expect(api.listCustomers()).rejects.toThrow('Admins only');
      await expect(api.listAllEnquiries()).rejects.toThrow('Admins only');
      await expect(api.adminStats()).rejects.toThrow('Admins only');
      await expect(api.setRole('x', 'admin')).rejects.toThrow('Admins only');
    }
  });

  it('hides drafts from everyone except admins', async () => {
    await asAdmin();
    await api.saveProduct(input({ isPublished: false }));
    expect((await api.listProducts()).some((p) => p.sku === 'SJ-9001')).toBe(true);
    await api.signOut();
    expect((await api.listProducts()).some((p) => p.sku === 'SJ-9001')).toBe(false);
  });

  it("refuses to touch another user's wishlist or profile", async () => {
    await asCustomer();
    await expect(api.listWishlist('someone-else')).rejects.toThrow('Not signed in');
    await expect(api.updateProfile('someone-else', { fullName: 'x' })).rejects.toThrow('Not signed in');
  });
});

describe('admin catalogue management', () => {
  beforeEach(asAdmin);

  it('creates, updates and deletes a product', async () => {
    const created = await api.saveProduct(input());
    expect(created.id).toBeTruthy();
    expect(created.images[0]).toMatchObject({ url: '/images/gold-ring.jpg', sortOrder: 0 });

    const updated = await api.saveProduct({ ...input({ name: 'Renamed', images: [] }), id: created.id });
    expect(updated.name).toBe('Renamed');
    expect(updated.images).toEqual([]);

    await api.deleteProduct(created.id);
    expect((await api.listProducts()).find((p) => p.id === created.id)).toBeUndefined();
  });

  it('rejects a duplicate SKU or slug', async () => {
    await api.saveProduct(input());
    await expect(api.saveProduct(input({ slug: 'other' }))).rejects.toThrow('duplicate key');
    await expect(api.saveProduct(input({ sku: 'SJ-9002' }))).rejects.toThrow('duplicate key');
  });

  it('returns copies, so callers cannot mutate stored rows', async () => {
    const [first] = await api.listProducts();
    first.name = 'Mutated';
    const again = (await api.listProducts()).find((p) => p.id === first.id);
    expect(again?.name).not.toBe('Mutated');
  });

  it('un-links products when their category or collection is deleted', async () => {
    const [cat] = await api.listCategories();
    const [col] = await api.listCollections();
    await api.deleteCategory(cat.id);
    await api.deleteCollection(col.id);
    const products = await api.listProducts();
    expect(products.some((p) => p.categoryId === cat.id || p.collectionId === col.id)).toBe(false);
  });

  it('creates and renames categories and collections, rejecting duplicate slugs', async () => {
    const cat = await api.saveCategory({ slug: 'anklets', name: 'Anklets', imageUrl: null, parentId: null, sortOrder: 99 });
    await api.saveCategory({ ...cat, name: 'Payal' });
    expect((await api.listCategories()).find((c) => c.id === cat.id)?.name).toBe('Payal');
    await expect(api.saveCategory({ slug: 'anklets', name: 'Dup', imageUrl: null, parentId: null, sortOrder: 0 })).rejects.toThrow('already exists');

    const col = await api.saveCollection({ slug: 'festive', name: 'Festive', tagline: 't', imageUrl: null, sortOrder: 9 });
    await api.saveCollection({ ...col, tagline: 'Diwali' });
    expect((await api.listCollections()).find((c) => c.id === col.id)?.tagline).toBe('Diwali');
    await expect(api.saveCollection({ slug: 'festive', name: 'x', tagline: '', imageUrl: null, sortOrder: 0 })).rejects.toThrow('already exists');
  });

  it('keeps sub-categories one level deep and deletes them with their parent', async () => {
    const all = await api.listCategories();
    const rings = all.find((c) => c.slug === 'rings')!;
    const gents = all.find((c) => c.slug === 'gents-rings')!;
    expect(gents.parentId).toBe(rings.id);
    await expect(api.saveCategory({ slug: 'deep', name: 'Deep', imageUrl: null, parentId: gents.id, sortOrder: 0 })).rejects.toThrow('one level deep');
    await expect(api.saveCategory({ ...rings, parentId: all.find((c) => c.slug === 'tika')!.id })).rejects.toThrow('cannot become a sub-category');
    await expect(api.saveCategory({ ...gents, parentId: gents.id })).rejects.toThrow('own parent');

    const productInGents = (await api.listProducts()).find((p) => p.categoryId === gents.id)!;
    await api.deleteCategory(rings.id);
    const after = await api.listCategories();
    expect(after.some((c) => c.id === rings.id || c.parentId === rings.id)).toBe(false);
    expect((await api.listProducts()).find((p) => p.id === productInGents.id)?.categoryId).toBeNull();
  });

  it('inlines uploaded images as data URLs', async () => {
    const res = await api.uploadImage(new Blob(['abc'], { type: 'image/png' }), 'products');
    expect(res.url).toMatch(/^data:image\/png;base64,/);
    expect(res.storagePath).toBeNull();
    await api.removeImages(['ignored']);
  });

  it('promotes a customer to admin', async () => {
    const customers = await api.listCustomers();
    const customer = customers.find((c) => c.email === DEMO_ACCOUNTS.customer.email)!;
    await api.setRole(customer.id, 'admin');
    expect((await api.getProfile(customer.id))?.role).toBe('admin');
  });

  it('reports stats', async () => {
    const stats = await api.adminStats();
    expect(stats.products).toBe(seedProducts.length);
    expect(stats.customers).toBe(1);
    expect(stats.byCategory.reduce((s, c) => s + c.count, 0)).toBe(seedProducts.length);
  });
});

describe('customer features', () => {
  let userId = '';
  let productId = '';

  beforeEach(async () => {
    await asCustomer();
    userId = (await api.getUser())!.id;
    productId = (await api.listProducts())[0].id;
  });

  it('adds and removes wishlist items without duplicates', async () => {
    await api.setWishlisted(userId, productId, true);
    await api.setWishlisted(userId, productId, true);
    expect(await api.listWishlist(userId)).toEqual([productId]);
    await api.setWishlisted(userId, productId, false);
    expect(await api.listWishlist(userId)).toEqual([]);
  });

  it('manages saved lists and their items', async () => {
    const list = await api.createSavedList(userId, 'Wedding', 'Nov');
    await api.setListItem(list.id, productId, true);
    await api.updateSavedList(list.id, { note: 'Budget 5L', name: 'Wedding shortlist' });
    let [saved] = await api.listSavedLists(userId);
    expect(saved).toMatchObject({ name: 'Wedding shortlist', note: 'Budget 5L', productIds: [productId] });
    await api.setListItem(list.id, productId, false);
    [saved] = await api.listSavedLists(userId);
    expect(saved.productIds).toEqual([]);
    await api.deleteSavedList(list.id);
    expect(await api.listSavedLists(userId)).toEqual([]);
  });

  it("cannot edit someone else's list", async () => {
    const list = await api.createSavedList(userId, 'Mine', '');
    await asAdmin();
    await expect(api.updateSavedList(list.id, { name: 'hacked' })).rejects.toThrow('List not found');
    await expect(api.setListItem(list.id, productId, true)).rejects.toThrow('List not found');
  });

  it('records enquiries that the customer and admins can see', async () => {
    await api.createEnquiry(userId, { productId, name: 'Ananya', phone: '9876543210', email: '', size: '7', quantity: 1, message: 'Price?' });
    const mine = await api.listMyEnquiries(userId);
    expect(mine).toHaveLength(1);
    expect(mine[0]).toMatchObject({ status: 'New', adminNote: '' });

    await asAdmin();
    const [all] = await api.listAllEnquiries();
    await api.updateEnquiry(all.id, { status: 'Contacted', adminNote: 'Called' });
    expect((await api.listAllEnquiries())[0]).toMatchObject({ status: 'Contacted', adminNote: 'Called' });
    expect((await api.adminStats()).enquiriesOpen).toBe(1);
  });

  it('counts views and updates the profile', async () => {
    const before = (await api.listProducts())[0].views;
    await api.recordView(productId);
    expect((await api.listProducts())[0].views).toBe(before + 1);
    const p = await api.updateProfile(userId, { city: 'Nashik' });
    expect(p.city).toBe('Nashik');
  });
});
