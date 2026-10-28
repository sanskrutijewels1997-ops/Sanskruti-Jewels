import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp, signInAs } from '../utils';
import { api } from '../../lib/api';
import { DEMO_ACCOUNTS } from '../../lib/api/demo';
import { seedProducts } from '../../data/seed';

beforeEach(async () => {
  await signInAs('admin');
});

describe('Admin dashboard', () => {
  it('shows store stats and latest enquiries', async () => {
    const product = (await api.listProducts())[0];
    await api.createEnquiry(null, { productId: product.id, name: 'Guest Gita', phone: '9000000000', email: '', size: '', quantity: 1, message: '' });
    renderApp('/admin');
    expect(await screen.findByText('Products by category')).toBeInTheDocument();
    expect(screen.getAllByText(String(seedProducts.length)).length).toBeGreaterThan(0);
    expect(await screen.findByText('Guest Gita')).toBeInTheDocument();
  });
});

describe('Product editor', () => {
  it('validates, then creates a draft product and opens it for editing', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/admin/products/new');
    const name = await screen.findByLabelText('Product name');
    await user.click(screen.getByRole('button', { name: 'Create product' }));
    expect(await screen.findByText('Name is required.')).toBeInTheDocument();
    expect(screen.getByText(/Add at least one photo before publishing/)).toBeInTheDocument();

    await user.type(name, 'Peacock Pendant');
    expect((screen.getByLabelText('URL slug') as HTMLInputElement).value).toMatch(/^peacock-pendant-\d+$/);
    await user.type(screen.getByLabelText('Weight from (g)'), '9');
    await user.type(screen.getByLabelText('Weight to (g)'), '4');
    await user.click(screen.getByText('Show price to customers'));
    await user.click(screen.getByText('Published (visible in store)'));
    await user.click(screen.getByRole('button', { name: 'Create product' }));
    expect(await screen.findByText('Minimum weight cannot exceed maximum weight.')).toBeInTheDocument();
    expect(screen.getByText(/Enter a price, or turn off/)).toBeInTheDocument();

    await user.clear(screen.getByLabelText('Weight to (g)'));
    await user.type(screen.getByLabelText('Weight to (g)'), '12');
    await user.type(screen.getByLabelText('Price (₹)'), '45000');
    await user.click(screen.getByRole('button', { name: 'Add specification' }));
    await user.type(screen.getByLabelText('Specification 2 label'), 'Gemstone');
    await user.type(screen.getByLabelText('Specification 2 value'), 'Emerald');
    await user.click(screen.getByRole('button', { name: 'Create product' }));

    await waitFor(() => expect(router.state.location.pathname).toMatch(/^\/admin\/products\/[0-9a-f-]{36}$/));
    const saved = (await api.listProducts()).find((p) => p.name === 'Peacock Pendant')!;
    expect(saved).toMatchObject({ isPublished: false, price: 45000, showPrice: true, weightMin: 9, weightMax: 12 });
    expect(saved.specifications).toContainEqual({ label: 'Gemstone', value: 'Emerald' });
    expect(await screen.findByRole('button', { name: 'Save changes' })).toBeInTheDocument();
  });

  it('edits an existing product', async () => {
    const user = userEvent.setup();
    const product = (await api.listProducts())[0];
    renderApp(`/admin/products/${product.id}`);
    const name = await screen.findByLabelText('Product name');
    await waitFor(() => expect(name).toHaveValue(product.name));
    await user.clear(name);
    await user.type(name, 'Renamed Choker');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(await screen.findByText('Changes saved')).toBeInTheDocument();
    expect((await api.listProducts()).find((p) => p.id === product.id)?.name).toBe('Renamed Choker');
  });

  it('reorders photos so the chosen one becomes the cover', async () => {
    const user = userEvent.setup();
    const product = (await api.listProducts())[0];
    renderApp(`/admin/products/${product.id}`);
    await screen.findByRole('button', { name: 'Remove image 2' });
    await user.click(screen.getAllByRole('button', { name: 'Make cover image' })[0]);
    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    await screen.findByText('Changes saved');
    const saved = (await api.listProducts()).find((p) => p.id === product.id)!;
    expect(saved.images[0].url).toBe(product.images[1].url);
  });

  it('shows not-found for an unknown product id', async () => {
    renderApp('/admin/products/00000000-0000-0000-0000-000000000000');
    expect((await screen.findAllByText('Product not found')).length).toBeGreaterThan(0);
  });
});

describe('Products list', () => {
  it('searches, unpublishes and deletes', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();
    const target = seedProducts[0];
    renderApp('/admin/products');
    await user.type(await screen.findByLabelText('Search products'), target.sku);
    const row = await screen.findByRole('listitem');
    await user.click(within(row).getByRole('button', { name: 'Unpublish' }));
    expect(await screen.findByText(/hidden from the store/)).toBeInTheDocument();
    expect((await api.listProducts()).find((p) => p.sku === target.sku)?.isPublished).toBe(false);

    await user.click(within(row).getByRole('button', { name: 'Delete' }));
    await waitFor(async () => expect((await api.listProducts()).some((p) => p.sku === target.sku)).toBe(false));
  });
});

describe('Categories & collections', () => {
  it('adds a category from the sheet', async () => {
    const user = userEvent.setup();
    renderApp('/admin/categories');
    await user.click((await screen.findAllByRole('button', { name: 'Add category' }))[0]);
    await user.type(await screen.findByLabelText('Name'), 'Toe Rings');
    expect(screen.getByLabelText('URL slug')).toHaveValue('toe-rings');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('Saved “Toe Rings”')).toBeInTheDocument();
    expect((await api.listCategories()).some((c) => c.slug === 'toe-rings')).toBe(true);
  });

  it('deletes a collection after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();
    renderApp('/admin/collections');
    await user.click(await screen.findByRole('button', { name: 'Delete Bridal Collection' }));
    await waitFor(async () => expect((await api.listCollections()).some((c) => c.slug === 'bridal')).toBe(false));
  });
});

describe('Enquiries & customers', () => {
  it('updates an enquiry status and note', async () => {
    const user = userEvent.setup();
    await api.createEnquiry(null, { productId: null, name: 'Walk-in', phone: '9811111111', email: 'w@x.com', size: '', quantity: 1, message: 'Custom ring' });
    renderApp('/admin/enquiries');
    expect(await screen.findByText('Custom ring')).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Status'), 'Contacted');
    expect(await screen.findByText('Marked as Contacted')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Internal note'), 'Called back');
    await user.tab();
    await waitFor(async () => expect((await api.listAllEnquiries())[0]).toMatchObject({ status: 'Contacted', adminNote: 'Called back' }));
    // "Open" filter still includes contacted enquiries; "Closed" doesn't
    await user.click(screen.getByRole('button', { name: /^Closed/ }));
    expect(await screen.findByText('Nothing here')).toBeInTheDocument();
  });

  it('promotes a customer to admin', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();
    renderApp('/admin/customers');
    const row = (await screen.findByText(new RegExp(DEMO_ACCOUNTS.customer.email))).closest('li')!;
    await user.click(within(row).getByRole('button', { name: 'Make admin' }));
    expect(await screen.findByText('Admin access granted')).toBeInTheDocument();
  });
});
