import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      // Supabase env vars must never leak into unit tests: they run against the demo backend.
      env: { VITE_SUPABASE_URL: '', VITE_SUPABASE_ANON_KEY: '' },
      restoreMocks: true,
      testTimeout: 15000,
      coverage: {
        provider: 'v8',
        reporter: ['text-summary', 'text', 'html', 'json-summary', 'lcov'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/**/*.test.{ts,tsx}',
          'src/test/**',
          'src/index.tsx',
          'src/vite-env.d.ts',
          'src/types/**',
          'src/lib/api/types.ts',
          'src/data/seed.ts',
          // Exercised by the database suite (tests/db) against a real Supabase instead.
          'src/lib/api/supabase.ts',
          // Native-only plugin calls; no-ops in a browser.
          'src/lib/native.ts'
        ],
        // Raise these as coverage grows; CI fails if coverage drops below them.
        thresholds: { statements: 90, branches: 80, functions: 75, lines: 90 }
      }
    }
  })
);
