import { beforeAll, describe, expect, it } from 'vitest';
import { createSupabaseBackend } from '../../src/lib/api/supabase';
import type { Backend } from '../../src/lib/api/types';
import { ANON, PASSWORD, URL, makeUser, run } from './helpers';

/** The same adapter the app uses, pointed at the test database. */
let adminApi: Backend;
let customerApi: Backend;
let customerId = '';

beforeAll(async () => {
  const [admin, customer] = await Promise.all([makeUser('adapter-admin', 'admin'), makeUser('adapter-customer')]);
  customerId = customer.id;
  adminApi = createSupabaseBackend(URL, ANON);
  customerApi = createSupabaseBackend(URL, ANON);
  await adminApi.signIn(admin.email, PASSWORD);
  await customerApi.signIn(customer.email, PASSWORD);
});

describe('Supabase adapter', () => {
  it('maps profiles and refuses a bad password', async () => {
    const profile = await customerApi.getProfile(customerId);
    expect(profile).toMatchObject({ id: customerId, fullName: 'Test adapter-customer', role: 'customer' });
    const other = createSupabaseBackend(URL, ANON);
    await expect(other.signIn('nobody@test.local', 'wrong')).rejects.toThrow(/Invalid login credentials/);
  });

  it('lists the seeded catalogue with ordered images', async () => {
    const [products, categories, collections] = await Promise.all([
      customerApi.listProducts(),
      customerApi.listCategories(),
      customerApi.listCollections()
    ]);
    expect(products.length).toBeGreaterThanOrEqual(38);
    expect(categories.length).toBeGreaterThanOrEqual(12);
    expect(collections.length).toBeGreaterThanOrEqual(6);
    const p = products.find((x) => x.sku.startsWith('SJ-1') && x.images.length > 1)!;
    expect(p.images.map((i) => i.sortOrder)).toEqual([...p.images.map((i) => i.sortOrder)].sort((a, b) => a - b));
    expect(typeof p.weightMin).toBe('number');
  });

  it('runs the admin product lifecycle including storage uploads', async () => {
    const upload = await adminApi.uploadImage(new Blob([new Uint8Array([0xff, 0xd8, 0xff, 0xd9])], { type: 'image/jpeg' }), 'products');
    expect(upload.storagePath).toMatch(/^products\/.+\.jpg$/);
    const base = {
      sku: `AD-${run}`,
      slug: `adapter-${run}`,
      name: 'Adapter Ring',
      description: 'd',
      categoryId: null,
      collectionId: null,
      style: 'Modern',
      metal: 'Gold',
      purity: '22K',
      weightMin: 2.5,
      weightMax: 3,
      make: 'Machine Made',
      grossWeight: 3.25,
      stoneWeight: 0.25,
      netWeight: 3,
      quantity: 4,
      stone: '',
      size: '',
      availability: 'Ready Stock' as const,
      price: 12345,
      showPrice: true,
      specifications: [{ label: 'Hallmark', value: 'BIS' }],
      isNew: true,
      isFeatured: false,
      isPublished: false,
      images: [upload, { url: '/images/gold-ring.jpg', storagePath: null }]
    };
    const created = await adminApi.saveProduct(base);
    expect(created).toMatchObject({ sku: base.sku, price: 12345, weightMin: 2.5, isPublished: false, make: 'Machine Made', grossWeight: 3.25, stoneWeight: 0.25, netWeight: 3, quantity: 4 });
    expect(created.images.map((i) => i.url)).toEqual([upload.url, '/images/gold-ring.jpg']);

    // Customers can't see the draft
    expect((await customerApi.listProducts()).some((p) => p.id === created.id)).toBe(false);

    const updated = await adminApi.saveProduct({ ...base, id: created.id, name: 'Renamed', images: [{ url: '/images/gold-ring.jpg', storagePath: null }] });
    expect(updated.name).toBe('Renamed');
    expect(updated.images).toHaveLength(1);

    await expect(adminApi.saveProduct({ ...base, slug: `other-${run}` })).rejects.toThrow(/duplicate key/);
    await adminApi.deleteProduct(created.id);
    expect((await adminApi.listProducts()).some((p) => p.id === created.id)).toBe(false);
  });

  it('blocks customers from admin actions', async () => {
    await expect(customerApi.adminStats()).rejects.toThrow(/Admins only/);
    await expect(customerApi.uploadImage(new Blob(['x'], { type: 'image/jpeg' }), 'products')).rejects.toThrow();
    await expect(customerApi.saveCategory({ slug: `c-${run}`, name: 'c', imageUrl: null, sortOrder: 0 })).rejects.toThrow(/row-level security/);
  });

  it('manages categories and collections as admin', async () => {
    const cat = await adminApi.saveCategory({ slug: `cat-${run}`, name: 'Anklets', imageUrl: null, sortOrder: 50 });
    const renamed = await adminApi.saveCategory({ ...cat, name: 'Payal' });
    expect(renamed.name).toBe('Payal');
    await adminApi.deleteCategory(cat.id);
    const col = await adminApi.saveCollection({ slug: `col-${run}`, name: 'Festive', tagline: 't', imageUrl: null, sortOrder: 50 });
    expect((await adminApi.saveCollection({ ...col, tagline: 'Diwali' })).tagline).toBe('Diwali');
    await adminApi.deleteCollection(col.id);
  });

  it('round-trips wishlist, saved lists, enquiries and profile edits for a customer', async () => {
    const [p1, p2] = await customerApi.listProducts();
    await customerApi.setWishlisted(customerId, p1.id, true);
    await customerApi.setWishlisted(customerId, p1.id, true); // idempotent
    await customerApi.setWishlisted(customerId, p2.id, true);
    expect((await customerApi.listWishlist(customerId)).sort()).toEqual([p1.id, p2.id].sort());
    await customerApi.setWishlisted(customerId, p2.id, false);
    expect(await customerApi.listWishlist(customerId)).toEqual([p1.id]);

    const list = await customerApi.createSavedList(customerId, 'Gifts', 'Diwali');
    await customerApi.setListItem(list.id, p1.id, true);
    await customerApi.updateSavedList(list.id, { note: 'Budget' });
    const [saved] = (await customerApi.listSavedLists(customerId)).filter((l) => l.id === list.id);
    expect(saved).toMatchObject({ name: 'Gifts', note: 'Budget', productIds: [p1.id] });
    await customerApi.setListItem(list.id, p1.id, false);
    await customerApi.deleteSavedList(list.id);

    await customerApi.createEnquiry(customerId, { productId: p1.id, name: 'C', phone: '9000000000', email: '', size: '7', quantity: 2, message: `adapter-${run}` });
    const [enquiry] = await customerApi.listMyEnquiries(customerId);
    expect(enquiry).toMatchObject({ productId: p1.id, quantity: 2, status: 'New' });
    await adminApi.updateEnquiry(enquiry.id, { status: 'Closed', adminNote: 'done' });
    expect((await adminApi.listAllEnquiries()).find((e) => e.id === enquiry.id)).toMatchObject({ status: 'Closed', adminNote: 'done' });

    expect((await customerApi.updateProfile(customerId, { city: 'Nashik' })).city).toBe('Nashik');
    await customerApi.recordView(p1.id);
  });

  it('reports admin stats and the customer list', async () => {
    const stats = await adminApi.adminStats();
    expect(stats.products).toBeGreaterThan(0);
    expect(Array.isArray(stats.byCategory)).toBe(true);
    const customers = await adminApi.listCustomers();
    expect(customers.some((c) => c.id === customerId)).toBe(true);
  });

  it('signs out', async () => {
    const api = createSupabaseBackend(URL, ANON);
    const user = await makeUser('adapter-signout');
    await api.signIn(user.email, PASSWORD);
    expect((await api.getUser())?.email).toBe(user.email);
    await api.signOut();
    expect(await api.getUser()).toBeNull();
  });
});
