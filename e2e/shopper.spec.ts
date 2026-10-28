import { expect, test } from '@playwright/test';
import { CUSTOMER, failOnErrors, signIn, uid } from './helpers';

test('guest browses, searches and filters the catalogue', async ({ page }) => {
  const check = failOnErrors(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'New Arrivals' })).toBeVisible();

  await page.goto('/catalogue?category=rings');
  await expect(page.getByRole('heading', { name: 'Rings', level: 1 })).toBeVisible();
  await expect(page.getByRole('article').first()).toBeVisible();

  await page.goto('/search');
  await page.getByRole('searchbox').fill('jhumka');
  await page.getByRole('button', { name: /See all \d+ results/ }).click();
  await expect(page).toHaveURL(/q=jhumka/);
  await expect(page.getByRole('article')).not.toHaveCount(0);
  check();
});

test('guest is asked to sign in before saving to the wishlist, then returns', async ({ page }) => {
  await page.goto('/catalogue');
  await page.getByRole('article').first().getByRole('button', { name: 'Add to wishlist' }).click();
  await expect(page).toHaveURL(/\/login\?next=%2Fcatalogue/);
  await page.getByLabel('Email').fill(CUSTOMER.email);
  await page.getByLabel('Password').fill(CUSTOMER.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/catalogue$/);
});

test('customer wishlists, makes a list and sends an enquiry', async ({ page }) => {
  const check = failOnErrors(page);
  await signIn(page, CUSTOMER, '/catalogue');

  // Wishlist two pieces (skip any already saved by earlier runs)
  const add = page.getByRole('button', { name: 'Add to wishlist' });
  await add.first().click();
  await expect(page.getByText('Added to wishlist')).toBeVisible();
  await page.goto('/wishlist');
  await expect(page.getByRole('article')).not.toHaveCount(0);

  // Save a piece to a new list from the product page
  await page.goto('/catalogue');
  await page.getByRole('article').first().getByRole('link').first().click();
  await expect(page).toHaveURL(/\/product\//);
  const listName = `Wedding ${uid()}`;
  await page.getByRole('button', { name: 'Save to list' }).first().click();
  await page.getByRole('button', { name: 'New list' }).click();
  await page.getByLabel('New list name').fill(listName);
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('button', { name: new RegExp(listName) })).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');

  // Enquire
  const message = `Today's price please ${uid()}`;
  await page.getByRole('button', { name: 'Enquire now' }).click();
  await page.getByLabel('Your name').fill('E2E Customer');
  await page.getByLabel('Phone').fill('9876543210');
  await page.getByLabel('Message').fill(message);
  await page.getByRole('button', { name: 'Send enquiry' }).click();
  await expect(page.getByText('Thank you!')).toBeVisible();
  await page.getByRole('button', { name: 'Done' }).click();

  await page.goto('/lists');
  await page.getByText(listName).click();
  await expect(page.getByRole('article')).toHaveCount(1);

  await page.goto('/account/enquiries');
  await expect(page.getByText(message)).toBeVisible();

  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Admins only' })).toBeVisible();
  check();
});
