import { describe, expect, it } from 'vitest';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp, signInAs } from '../utils';
import { api } from '../../lib/api';
import { seedCategories, seedProducts } from '../../data/seed';

const search = (router: ReturnType<typeof renderApp>['router']) => router.state.location.search;

describe('Home', () => {
  it('shows category shortcuts and rails', async () => {
    renderApp('/');
    expect(await screen.findByRole('heading', { name: 'New Arrivals' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Trending Now' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Curated Collections' })).not.toBeInTheDocument();
    const cats = screen.getByRole('navigation', { name: 'Categories' });
    expect(await within(cats).findByText('Short Necklace')).toBeInTheDocument();
    // Only main categories appear as circles, not sub-categories
    expect(within(cats).queryByText('Gents Rings')).not.toBeInTheDocument();
    // Bottom tab bar is present on tab roots
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
  });

  it('opens the custom design enquiry', async () => {
    const user = userEvent.setup();
    renderApp('/');
    await user.click(await screen.findByRole('button', { name: 'Request a custom design' }));
    expect(await screen.findByRole('dialog', { name: 'Get in touch' })).toBeInTheDocument();
  });
});

describe('Categories', () => {
  it('lists main categories with their type and design counts', async () => {
    renderApp('/categories');
    expect(await screen.findByText('All Jewellery')).toBeInTheDocument();
    const rings = await screen.findByRole('link', { name: /^Rings/ });
    expect(rings).toHaveAttribute('href', '/catalogue?category=rings');
    expect(rings).toHaveTextContent('3 types');
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('redirects old collection links to Categories', async () => {
    const { router } = renderApp('/collections');
    await waitFor(() => expect(router.state.location.pathname).toBe('/categories'));
  });
});

describe('Product list', () => {
  it('filters by the category in the URL and shows the count', async () => {
    renderApp('/catalogue?category=rings');
    expect(await screen.findByRole('heading', { name: 'Rings', level: 1 })).toBeInTheDocument();
    // "Rings" includes its sub-categories
    const ringSubs = seedCategories.filter((c) => c.parent === 'rings').map((c) => c.slug);
    const rings = seedProducts.filter((p) => p.category === 'rings' || ringSubs.includes(p.category)).length;
    expect(await screen.findByText(`${rings} items`)).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(rings);
  });

  it('applies a quick filter chip and removes it from the applied chips', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/catalogue');
    await screen.findByText(`${seedProducts.length} items`);
    await user.click(screen.getByRole('button', { name: 'Gold' }));
    expect(search(router)).toContain('metal=Gold');
    const gold = seedProducts.filter((p) => p.metal === 'Gold').length;
    expect(await screen.findByText(`${gold} items`)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove filter Gold' }));
    expect(search(router)).not.toContain('metal=');
  });

  it('sorts from the sort sheet', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/catalogue');
    await screen.findByText(`${seedProducts.length} items`);
    await user.click(screen.getAllByRole('button', { name: /Sort/ })[0]);
    await user.click(await screen.findByRole('radio', { name: 'Price: Low to High' }));
    expect(search(router)).toContain('sort=price-asc');
    // Priced items come first
    const first = screen.getAllByRole('article')[0];
    expect(within(first).getByText(/₹/)).toBeInTheDocument();
  });

  it('shows live counts in the filter sheet and applies the selection', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/catalogue');
    await screen.findByText(`${seedProducts.length} items`);
    await user.click(screen.getAllByRole('button', { name: /Filter/ })[0]);
    const sheet = await screen.findByRole('dialog', { name: 'Filters' });
    await user.click(within(sheet).getByRole('tab', { name: 'Metal' }));
    const diamond = seedProducts.filter((p) => p.metal === 'Diamond').length;
    const option = within(sheet).getByRole('checkbox', { name: new RegExp(`Diamond\\s*${diamond}`) });
    await user.click(option);
    await user.click(within(sheet).getByRole('button', { name: `Show ${diamond} items` }));
    await waitFor(() => expect(search(router)).toContain('metal=Diamond'));
    expect(await screen.findByText(`${diamond} items`)).toBeInTheDocument();
  });

  it('shows an empty state that clears everything', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/catalogue?q=zzzz');
    expect(await screen.findByText('No designs found')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(search(router)).toBe('');
  });

  it('loads more items', async () => {
    const user = userEvent.setup();
    renderApp('/catalogue');
    await screen.findByText(`${seedProducts.length} items`);
    expect(screen.getAllByRole('article')).toHaveLength(24);
    await user.click(screen.getByRole('button', { name: 'Load more' }));
    expect(screen.getAllByRole('article')).toHaveLength(seedProducts.length);
  });
});

describe('Search', () => {
  it('suggests results and remembers the search', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/search');
    await user.type(await screen.findByRole('searchbox'), 'jhumka');
    expect(await screen.findByText('Pearl Drop Temple Jhumkas')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /See all \d+ results/ }));
    expect(router.state.location.pathname).toBe('/catalogue');
    expect(search(router)).toBe('?q=jhumka');
    expect(JSON.parse(localStorage.getItem('sanskruti-recent-searches')!)).toEqual(['jhumka']);
  });

  it('says when nothing matches', async () => {
    const user = userEvent.setup();
    renderApp('/search');
    await user.type(await screen.findByRole('searchbox'), 'unobtainium');
    expect(await screen.findByText(/No matches for/)).toBeInTheDocument();
  });
});

describe('Product page', () => {
  const p = seedProducts[0];

  it('shows details, specs and price on request', async () => {
    renderApp(`/product/${p.slug}`);
    expect(await screen.findByRole('heading', { name: p.name, level: 1 })).toBeInTheDocument();
    expect(screen.getAllByText('Price on request').length).toBeGreaterThan(0);
    expect(screen.getByText(`SKU ${p.sku}`)).toBeInTheDocument();
    expect(screen.getByText(p.specifications[0].value)).toBeInTheDocument();
    // Core trade specs are listed
    const specs = screen.getByText('Product category').closest('dl')!;
    for (const [label, value] of [
      ['Make', p.make],
      ['Purity', p.purity],
      ['Gross weight', `${p.grossWeight} g`],
      ['Stone weight', `${p.stoneWeight} g`],
      ['Net weight', `${p.netWeight} g`],
      ['Qty', String(p.quantity)]
    ]) {
      expect(within(specs).getByText(label).nextElementSibling).toHaveTextContent(value);
    }
  });

  it('shows a not-found state for unknown products', async () => {
    renderApp('/product/does-not-exist');
    expect(await screen.findByText('Design not found')).toBeInTheDocument();
  });

  it('sends guests to sign in when they tap the wishlist', async () => {
    const user = userEvent.setup();
    const { router } = renderApp(`/product/${p.slug}`);
    await screen.findByRole('heading', { name: p.name, level: 1 });
    await user.click(screen.getAllByRole('button', { name: /wishlist/i })[0]);
    expect(router.state.location.pathname).toBe('/login');
    expect(search(router)).toContain(encodeURIComponent(`/product/${p.slug}`));
  });

  it('submits an enquiry that admins can see', async () => {
    const user = userEvent.setup();
    renderApp(`/product/${p.slug}`);
    await screen.findByRole('heading', { name: p.name, level: 1 });
    await user.click(screen.getAllByRole('button', { name: 'Enquire now' })[0]);
    const sheet = await screen.findByRole('dialog', { name: 'Enquire about this piece' });
    await user.type(within(sheet).getByLabelText('Your name'), 'Meera');
    await user.type(within(sheet).getByLabelText('Phone'), '12345');
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));
    expect(await screen.findByText(/valid phone number/)).toBeInTheDocument();
    await user.clear(within(sheet).getByLabelText('Phone'));
    await user.type(within(sheet).getByLabelText('Phone'), '9876543210');
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));
    expect(await screen.findByText('Thank you!')).toBeInTheDocument();

    await signInAs('admin');
    const [enquiry] = await api.listAllEnquiries();
    expect(enquiry).toMatchObject({ name: 'Meera', phone: '9876543210', userId: null, status: 'New' });
  });

  it('closes sheets with Escape', async () => {
    const user = userEvent.setup();
    renderApp(`/product/${p.slug}`);
    await screen.findByRole('heading', { name: p.name, level: 1 });
    await user.click(screen.getAllByRole('button', { name: 'Enquire now' })[0]);
    await screen.findByRole('dialog');
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
