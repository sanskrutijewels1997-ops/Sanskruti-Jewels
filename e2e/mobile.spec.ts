import { expect, test } from '@playwright/test';
import { failOnErrors } from './helpers';

test('app shell: tab bar, search screen and guest wishlist prompt', async ({ page }) => {
  const check = failOnErrors(page);
  await page.goto('/');
  const tabs = page.getByRole('navigation', { name: 'Main' });
  await expect(tabs).toBeVisible();
  await page.getByRole('link', { name: /Search for necklaces/ }).click();
  await expect(page).toHaveURL(/\/search/);
  await expect(page.getByRole('searchbox')).toBeFocused();

  await page.goto('/');
  await tabs.getByRole('link', { name: 'Wishlist' }).click();
  await expect(page.getByText('Save the pieces you love')).toBeVisible();
  // No horizontal scrolling anywhere on the phone layout
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  check();
});

test('product list: sort/filter bar, filters in the URL and back restores position', async ({ page }) => {
  const check = failOnErrors(page);
  await page.goto('/catalogue');
  const count = page.getByText(/^\d+ items?$/).first();
  const total = Number((await count.innerText()).split(' ')[0]);

  await page.getByRole('button', { name: /^Filter/ }).click();
  await page.getByRole('tab', { name: 'Metal' }).click();
  await page.getByRole('checkbox', { name: /Gold/ }).click();
  await page.getByRole('button', { name: /^Show \d+ items?$/ }).click();
  await expect(page).toHaveURL(/metal=Gold/);
  const filtered = Number((await count.innerText()).split(' ')[0]);
  expect(filtered).toBeLessThan(total);

  await page.getByRole('button', { name: /^Sort/ }).click();
  await page.getByRole('radio', { name: 'Price: Low to High' }).click();
  await expect(page).toHaveURL(/sort=price-asc/);

  // Centre the card: if it sat under the pinned Sort/Filter bar, Playwright would
  // re-scroll before tapping and the saved position would differ from `before`.
  const target = page.locator('article a').nth(12);
  await target.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  const before = await page.evaluate(() => window.scrollY);
  await target.click();
  await expect(page).toHaveURL(/\/product\//);

  // Action bar pinned to the bottom of the screen
  const bar = await page.getByRole('button', { name: 'Enquire now' }).boundingBox();
  const vh = page.viewportSize()!.height;
  expect(bar!.y + bar!.height).toBeLessThanOrEqual(vh);
  expect(bar!.y).toBeGreaterThan(vh - 120);

  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page).toHaveURL(/metal=Gold.*sort=price-asc|sort=price-asc.*metal=Gold/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before - 60);
  check();
});

test('slogan, Since 1977 badge and purity shortcuts at the top of Home', async ({ page }) => {
  const check = failOnErrors(page);
  await page.goto('/');
  await expect(page.getByText('Sell More · Stock Less').filter({ visible: true })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Since 1977' }).filter({ visible: true })).toBeVisible();

  const shortcuts = page.getByRole('navigation', { name: 'Shop by purity' });
  // Both shortcuts sit in the first screenful
  const box = await shortcuts.boundingBox();
  expect(box!.y + box!.height).toBeLessThan(page.viewportSize()!.height / 2);

  await shortcuts.getByRole('link', { name: /22 Carat/ }).click();
  await expect(page).toHaveURL(/purity=22K/);
  await expect(page.getByRole('heading', { name: '22 Carat', level: 1 })).toBeVisible();
  await page.getByRole('button', { name: '22 Carat' }).click();
  await page.getByRole('button', { name: '92 Melting' }).click();
  await expect(page).toHaveURL(/purity=92(\+|%20)Melting/);
  await expect(page.getByRole('article').first()).toBeVisible();
  check();
});
