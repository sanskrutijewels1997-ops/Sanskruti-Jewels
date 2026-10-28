/**
 * Creates (or reuses) the admin and customer accounts the Playwright suite signs in with
 * when it runs against a Supabase-backed build. Run with: npx tsx tests/db/create-e2e-users.ts
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
const sb = createClient(url, key, { auth: { persistSession: false } });

const users = [
  { email: process.env.E2E_ADMIN_EMAIL ?? 'e2e-admin@test.local', password: process.env.E2E_ADMIN_PASSWORD ?? 'password123', role: 'admin', name: 'E2E Admin' },
  { email: process.env.E2E_CUSTOMER_EMAIL ?? 'e2e-customer@test.local', password: process.env.E2E_CUSTOMER_PASSWORD ?? 'password123', role: 'customer', name: 'E2E Customer' }
];

for (const u of users) {
  const created = await sb.auth.admin.createUser({ email: u.email, password: u.password, email_confirm: true, user_metadata: { full_name: u.name } });
  if (created.error && !/already/i.test(created.error.message)) throw created.error;
  const { error } = await sb.from('profiles').update({ role: u.role }).eq('email', u.email);
  if (error) throw error;
  console.log(`${u.role}: ${u.email}`);
}
