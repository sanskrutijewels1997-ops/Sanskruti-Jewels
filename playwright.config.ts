import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests. By default they build the app in demo mode (no Supabase) and serve it.
 * Set E2E_BASE_URL to test an already-running build instead, e.g. one wired to Supabase,
 * together with E2E_ADMIN_* / E2E_CUSTOMER_* credentials.
 */
const external = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: external ?? 'http://localhost:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] }, testIgnore: /mobile\.spec/ },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testMatch: /mobile\.spec/ }
  ],
  webServer: external
    ? undefined
    : {
        command: 'npx vite build && npx vite preview --port 4173 --strictPort',
        url: 'http://localhost:4173',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        env: { VITE_SUPABASE_URL: '', VITE_SUPABASE_ANON_KEY: '' }
      }
});
