import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const URL = process.env.SUPABASE_URL ?? '';
export const ANON = process.env.SUPABASE_ANON_KEY ?? '';
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!URL || !ANON || !SERVICE) {
  throw new Error('Set SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY (see `npx supabase status -o env`).');
}

const opts = { auth: { persistSession: false, autoRefreshToken: false } };

/** Bypasses RLS — only for test setup, never for assertions about permissions. */
export const service = createClient(URL, SERVICE, opts);
export const anon = () => createClient(URL, ANON, opts);

export const run = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
export const PASSWORD = 'password123';

/** Creates a confirmed user (optionally an admin) and returns a signed-in client. */
export async function makeUser(label: string, role: 'customer' | 'admin' = 'customer') {
  const email = `${label}-${run}@test.local`;
  const { data, error } = await service.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: `Test ${label}`, phone: '9000000000' }
  });
  if (error) throw error;
  if (role === 'admin') {
    const res = await service.from('profiles').update({ role: 'admin' }).eq('id', data.user.id);
    if (res.error) throw res.error;
  }
  const client = anon();
  const signIn = await client.auth.signInWithPassword({ email, password: PASSWORD });
  if (signIn.error) throw signIn.error;
  return { id: data.user.id, email, client };
}

export async function publishedProductId(client: SupabaseClient = anon()) {
  const { data, error } = await client.from('products').select('id').eq('is_published', true).limit(1).single();
  if (error) throw error;
  return data.id as string;
}
