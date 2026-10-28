import { beforeAll, describe, expect, it } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { anon, makeUser, publishedProductId, run, service } from './helpers';

let admin: Awaited<ReturnType<typeof makeUser>>;
let alice: Awaited<ReturnType<typeof makeUser>>;
let bob: Awaited<ReturnType<typeof makeUser>>;
let productId: string;

beforeAll(async () => {
  [admin, alice, bob] = await Promise.all([makeUser('admin', 'admin'), makeUser('alice'), makeUser('bob')]);
  productId = await publishedProductId();
});

const tinyJpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);

describe('profiles', () => {
  it('are created on sign-up from the user metadata', async () => {
    const { data } = await alice.client.from('profiles').select('*').eq('id', alice.id).single();
    expect(data).toMatchObject({ email: alice.email, full_name: 'Test alice', phone: '9000000000', role: 'customer' });
  });

  it('can be edited by their owner, but not the role or email', async () => {
    const ok = await alice.client.from('profiles').update({ city: 'Pune' }).eq('id', alice.id).select().single();
    expect(ok.error).toBeNull();
    expect(ok.data?.city).toBe('Pune');
    const role = await alice.client.from('profiles').update({ role: 'admin' }).eq('id', alice.id);
    expect(role.error?.message).toMatch('Only admins can change role or email');
    const email = await alice.client.from('profiles').update({ email: 'x@y.z' }).eq('id', alice.id);
    expect(email.error?.message).toMatch('Only admins');
  });

  it("are private: customers see only their own, admins see everyone's", async () => {
    const mine = await alice.client.from('profiles').select('id');
    expect(mine.data?.map((r) => r.id)).toEqual([alice.id]);
    const theirs = await alice.client.from('profiles').update({ city: 'Hacked' }).eq('id', bob.id).select();
    expect(theirs.data).toEqual([]);
    const all = await admin.client.from('profiles').select('id').in('id', [alice.id, bob.id]);
    expect(all.data).toHaveLength(2);
  });

  it('let admins promote other users', async () => {
    const carol = await makeUser('carol');
    const res = await admin.client.from('profiles').update({ role: 'admin' }).eq('id', carol.id).select('role').single();
    expect(res.data?.role).toBe('admin');
  });
});

describe('catalogue', () => {
  it('is readable by guests, but only published products', async () => {
    const sku = `RLS-${run}`;
    const draft = await admin.client.from('products').insert({ sku, slug: `rls-${run}`, name: 'Draft piece', is_published: false }).select('id').single();
    expect(draft.error).toBeNull();
    const guestView = await anon().from('products').select('id').eq('sku', sku);
    expect(guestView.data).toEqual([]);
    const adminView = await admin.client.from('products').select('id').eq('sku', sku);
    expect(adminView.data).toHaveLength(1);
    await admin.client.from('products').delete().eq('id', draft.data!.id);
  });

  it.each([
    ['guest', () => anon()],
    ['customer', () => alice.client]
  ])('rejects writes from a %s', async (_who, client) => {
    const c = (client as () => SupabaseClient)();
    const ins = await c.from('products').insert({ sku: `X-${run}`, slug: `x-${run}`, name: 'x' });
    expect(ins.error?.message).toMatch(/row-level security/);
    const upd = await c.from('products').update({ name: 'hacked' }).eq('id', productId).select();
    expect(upd.data ?? []).toEqual([]);
    const del = await c.from('products').delete().eq('id', productId).select();
    expect(del.data ?? []).toEqual([]);
    const cat = await c.from('categories').insert({ slug: `c-${run}`, name: 'c' });
    expect(cat.error).not.toBeNull();
    const img = await c.from('product_images').insert({ product_id: productId, url: 'x' });
    expect(img.error).not.toBeNull();
  });

  it('counts views for published products only, even from guests', async () => {
    const before = (await service.from('products').select('views').eq('id', productId).single()).data!.views;
    const res = await anon().rpc('record_product_view', { p_product_id: productId });
    expect(res.error).toBeNull();
    const after = (await service.from('products').select('views').eq('id', productId).single()).data!.views;
    expect(after).toBe(before + 1);
  });

  it('replaces product images atomically and reports orphaned storage paths', async () => {
    const p = await admin.client.from('products').insert({ sku: `IMG-${run}`, slug: `img-${run}`, name: 'Img test' }).select('id').single();
    const id = p.data!.id;
    const first = await admin.client.rpc('replace_product_images', {
      p_product_id: id,
      p_images: [{ url: 'a', storage_path: 'products/a.jpg' }, { url: 'b', storage_path: 'products/b.jpg' }]
    });
    expect(first.data).toEqual([]);
    const second = await admin.client.rpc('replace_product_images', {
      p_product_id: id,
      p_images: [{ url: 'b', storage_path: 'products/b.jpg' }, { url: 'c', storage_path: null }]
    });
    expect(second.data).toEqual(['products/a.jpg']);
    const rows = await admin.client.from('product_images').select('url, sort_order').eq('product_id', id).order('sort_order');
    expect(rows.data).toEqual([{ url: 'b', sort_order: 0 }, { url: 'c', sort_order: 1 }]);
    // Customers can't use it: deletes are filtered to nothing by RLS, inserts are refused.
    await alice.client.rpc('replace_product_images', { p_product_id: id, p_images: [] });
    const denied = await alice.client.rpc('replace_product_images', { p_product_id: id, p_images: [{ url: 'evil', storage_path: null }] });
    expect(denied.error?.message).toMatch(/row-level security/);
    const still = await admin.client.from('product_images').select('url').eq('product_id', id).order('sort_order');
    expect(still.data?.map((r) => r.url)).toEqual(['b', 'c']);
    await admin.client.from('products').delete().eq('id', id);
  });
});

describe('storage', () => {
  it('lets admins upload product images that are publicly readable', async () => {
    const path = `products/test-${run}.jpg`;
    const up = await admin.client.storage.from('product-images').upload(path, tinyJpeg, { contentType: 'image/jpeg' });
    expect(up.error).toBeNull();
    const url = admin.client.storage.from('product-images').getPublicUrl(path).data.publicUrl;
    expect((await fetch(url)).status).toBe(200);
    const rm = await admin.client.storage.from('product-images').remove([path]);
    expect(rm.error).toBeNull();
  });

  it('blocks uploads from customers and guests', async () => {
    for (const c of [alice.client, anon()]) {
      const up = await c.storage.from('product-images').upload(`products/hack-${run}.jpg`, tinyJpeg, { contentType: 'image/jpeg' });
      expect(up.error).not.toBeNull();
    }
  });
});

describe('wishlists and saved lists', () => {
  it('are private to their owner', async () => {
    expect((await alice.client.from('wishlist_items').insert({ user_id: alice.id, product_id: productId })).error).toBeNull();
    const forged = await alice.client.from('wishlist_items').insert({ user_id: bob.id, product_id: productId });
    expect(forged.error?.message).toMatch(/row-level security/);
    expect((await bob.client.from('wishlist_items').select('*').eq('user_id', alice.id)).data).toEqual([]);
    expect((await anon().from('wishlist_items').select('*')).data).toEqual([]);

    const list = await alice.client.from('saved_lists').insert({ user_id: alice.id, name: 'Wedding' }).select('id').single();
    expect(list.error).toBeNull();
    expect((await alice.client.from('saved_list_items').insert({ list_id: list.data!.id, product_id: productId })).error).toBeNull();
    // Bob can neither see nor add to Alice's list
    expect((await bob.client.from('saved_lists').select('id').eq('id', list.data!.id)).data).toEqual([]);
    const sneak = await bob.client.from('saved_list_items').insert({ list_id: list.data!.id, product_id: productId });
    expect(sneak.error).not.toBeNull();
  });
});

describe('enquiries', () => {
  it('can be submitted by guests but not read back, or pre-set as handled', async () => {
    const guest = anon();
    expect((await guest.from('enquiries').insert({ name: 'Guest', phone: '9811111111', message: `guest-${run}` })).error).toBeNull();
    expect((await guest.from('enquiries').select('id')).data).toEqual([]);
    const preset = await guest.from('enquiries').insert({ name: 'x', phone: '1', status: 'Closed' });
    expect(preset.error).not.toBeNull();
    const spoof = await guest.from('enquiries').insert({ name: 'x', phone: '1', user_id: alice.id });
    expect(spoof.error).not.toBeNull();
  });

  it('are visible to their customer, managed only by admins', async () => {
    const msg = `alice-${run}`;
    await alice.client.from('enquiries').insert({ user_id: alice.id, name: 'Alice', phone: '9000000000', message: msg });
    const mine = await alice.client.from('enquiries').select('id, message');
    expect(mine.data?.map((e) => e.message)).toEqual([msg]);
    expect((await bob.client.from('enquiries').select('id')).data).toEqual([]);

    const id = mine.data![0].id;
    const selfClose = await alice.client.from('enquiries').update({ status: 'Closed' }).eq('id', id).select();
    expect(selfClose.data).toEqual([]);
    const handled = await admin.client.from('enquiries').update({ status: 'Contacted', admin_note: 'Called' }).eq('id', id).select('status').single();
    expect(handled.data?.status).toBe('Contacted');
  });
});

describe('admin_stats', () => {
  it('is admin-only', async () => {
    expect((await alice.client.rpc('admin_stats')).error?.message).toMatch('Admins only');
    const ok = await admin.client.rpc('admin_stats');
    expect(ok.error).toBeNull();
    expect(ok.data.products).toBeGreaterThan(0);
  });
});
