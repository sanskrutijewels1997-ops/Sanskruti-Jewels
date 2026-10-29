import { expect, test } from '@playwright/test';
import path from 'node:path';
import { ADMIN, failOnErrors, signIn, uid } from './helpers';

const photo = (name: string) => path.resolve('public', 'images', name);

test('admin creates, publishes and unpublishes a product with photos', async ({ page }) => {
  const check = failOnErrors(page);
  await signIn(page, ADMIN);
  await page.goto('/admin');
  await expect(page.getByText('Most wishlisted')).toBeVisible();

  const name = `E2E Peacock Pendant ${uid()}`;
  await page.goto('/admin/products/new');
  await page.getByLabel('Product name').fill(name);
  await page.locator('input[type=file]').setInputFiles([photo('pendant.jpg'), photo('chain.jpg')]);
  await expect(page.getByRole('button', { name: 'Remove image 2' })).toBeVisible({ timeout: 15_000 });

  await page.getByLabel('Weight from (g)').fill('5');
  await page.getByLabel('Weight to (g)').fill('3');
  await page.getByRole('button', { name: 'Create product' }).click();
  await expect(page.getByText('Minimum weight cannot exceed maximum weight.')).toBeVisible();

  await page.getByLabel('Weight to (g)').fill('7');
  await page.getByLabel('Price (₹)').fill('45000');
  await page.getByText('Show price to customers').click();
  await page.getByLabel('Category').selectOption({ label: 'Pendants' });
  await page.getByRole('combobox', { name: 'Make', exact: true }).fill('Handmade');
  await page.getByLabel('Gross weight (g)').fill('6.4');
  await page.getByLabel('Stone weight (g)').fill('0.4');
  await expect(page.getByLabel('Net weight (g)')).toHaveValue('6');
  await page.getByLabel('Qty').fill('2');
  await page.getByRole('radio', { name: 'Yes' }).click();
  await page.getByRole('button', { name: 'Add specification' }).click();
  await page.getByLabel('Specification 2 label').fill('Gemstone');
  await page.getByLabel('Specification 2 value').fill('Emerald');
  await page.getByRole('button', { name: 'Create product' }).click();
  await expect(page).toHaveURL(/\/admin\/products\/[0-9a-f-]{36}$/);

  await page.getByRole('button', { name: 'Make cover image' }).click();
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByText('Changes saved')).toBeVisible();

  // Visible in the store
  await page.goto(`/catalogue?q=${encodeURIComponent(name)}`);
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.getByText('₹45,000').first()).toBeVisible();
  await page.getByRole('article').getByRole('link').first().click();
  // Specifications are open by default on the product page
  await expect(page.getByText('Emerald')).toBeVisible();
  await expect(page.getByText('6.4 g').first()).toBeVisible();

  // Unpublish → hidden from guests
  await page.goto('/admin/products');
  await page.getByLabel('Search products').fill(name);
  await page.getByRole('button', { name: 'Unpublish' }).click();
  await expect(page.getByText(/hidden from the store/)).toBeVisible();

  await page.goto('/account');
  await page.getByRole('button', { name: 'Sign out' }).click();
  await page.goto(`/catalogue?q=${encodeURIComponent(name)}`);
  await expect(page.getByText('No designs found')).toBeVisible();
  check();
});

test('admin manages categories, enquiries and customers', async ({ page }) => {
  const check = failOnErrors(page);
  // A guest enquiry to work with
  await page.goto('/');
  await page.getByRole('button', { name: 'Request a custom design' }).click();
  const message = `Custom ring ${uid()}`;
  await page.getByLabel('Your name').fill('Walk-in');
  await page.getByLabel('Phone').fill('9811111111');
  await page.getByLabel('Message').fill(message);
  await page.getByRole('button', { name: 'Send enquiry' }).click();
  await expect(page.getByText('Thank you!')).toBeVisible();

  await signIn(page, ADMIN);
  const cat = `Anklets ${uid()}`;
  await page.goto('/admin/categories');
  await page.getByRole('button', { name: 'Add category' }).click();
  await page.getByLabel('Name').fill(cat);
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByText(`Saved “${cat}”`)).toBeVisible();

  await page.goto('/admin/enquiries');
  const row = page.getByRole('listitem').filter({ hasText: message });
  await row.getByLabel('Status').selectOption('Contacted');
  await expect(page.getByText('Marked as Contacted')).toBeVisible();

  await page.goto('/admin/customers');
  await expect(page.getByText('Customers').first()).toBeVisible();
  check();
});
