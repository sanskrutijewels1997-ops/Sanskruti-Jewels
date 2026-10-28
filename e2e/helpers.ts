import { expect, type Page } from '@playwright/test';

export const ADMIN = {
  email: process.env.E2E_ADMIN_EMAIL ?? 'admin@sanskruti.demo',
  password: process.env.E2E_ADMIN_PASSWORD ?? 'admin123'
};
export const CUSTOMER = {
  email: process.env.E2E_CUSTOMER_EMAIL ?? 'customer@sanskruti.demo',
  password: process.env.E2E_CUSTOMER_PASSWORD ?? 'customer123'
};

/** Fails the test on any uncaught page error or console error. */
export function failOnErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`);
  });
  return () => expect(errors, errors.join('\n')).toEqual([]);
}

export async function signIn(page: Page, who: { email: string; password: string }, next = '/account') {
  await page.goto(`/login?next=${encodeURIComponent(next)}`);
  await page.getByLabel('Email').fill(who.email);
  await page.getByLabel('Password').fill(who.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL((u) => u.pathname === next);
}

/** A unique suffix so tests can run repeatedly against a persistent database. */
export const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
