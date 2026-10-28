import { defineConfig } from 'vitest/config';

/**
 * Database suite: runs against a real Supabase (local `supabase start` or CI) and checks
 * the row-level security rules plus the app's Supabase adapter end to end.
 * Needs SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/db/**/*.test.ts'],
    testTimeout: 30_000,
    hookTimeout: 60_000,
    fileParallelism: false
  }
});
