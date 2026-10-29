import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { renderApp, signInAs } from '../utils';
import { api } from '../../lib/api';
import { ImageUploader, type UploadedImage } from '../../components/admin/ImageUploader';
import { pushBackHandler } from '../../lib/native';
import { seedProducts } from '../../data/seed';

describe('Image uploader', () => {
  function Harness({ initial = [] as UploadedImage[] }) {
    const [images, setImages] = useState(initial);
    const uploads = useRef(new Set<string>());
    return (
      <>
        <ImageUploader images={images} onChange={setImages} folder="products" sessionUploads={uploads} onError={() => undefined} />
        <output data-testid="urls">{images.map((i) => i.url.slice(0, 15)).join('|')}</output>
      </>
    );
  }

  it('uploads picked photos, then reorders and removes them', async () => {
    await signInAs('admin');
    const user = userEvent.setup();
    const { container } = render(<Harness initial={[{ url: '/a.jpg', storagePath: null }]} />);
    const input = container.querySelector('input[type=file]') as HTMLInputElement;
    await user.upload(input, new File(['png'], 'b.png', { type: 'image/png' }));
    await waitFor(() => expect(screen.getByTestId('urls').textContent).toMatch(/^\/a\.jpg\|data:image\/png/));

    await user.click(screen.getByRole('button', { name: 'Make cover image' }));
    expect(screen.getByTestId('urls').textContent).toMatch(/^data:image\/png.*\|\/a\.jpg$/);
    await user.click(screen.getAllByRole('button', { name: 'Move right' })[0]);
    expect(screen.getByTestId('urls').textContent).toMatch(/^\/a\.jpg\|/);
    await user.click(screen.getByRole('button', { name: 'Remove image 1' }));
    expect(screen.getByTestId('urls').textContent).toMatch(/^data:image\/png/);
  });

  it('accepts dropped files and ignores non-images', async () => {
    await signInAs('admin');
    render(<Harness />);
    const zone = screen.getByText('Drop photos here').parentElement!;
    fireEvent.dragOver(zone);
    fireEvent.drop(zone, { dataTransfer: { files: [new File(['t'], 'notes.txt', { type: 'text/plain' }), new File(['j'], 'c.jpg', { type: 'image/jpeg' })] } });
    await waitFor(() => expect(screen.getByTestId('urls').textContent).toMatch(/^data:image\/jpeg/));
    expect(screen.getAllByRole('button', { name: /Remove image/ })).toHaveLength(1);
  });
});

describe('Back button stack', () => {
  it('runs the most recently opened handler and can unregister', () => {
    const calls: string[] = [];
    const offA = pushBackHandler(() => calls.push('a'));
    const offB = pushBackHandler(() => calls.push('b'));
    offB();
    offA();
    offA(); // idempotent
    expect(calls).toEqual([]);
  });
});

describe('List detail', () => {
  it('renames, shares and deletes a list', async () => {
    await signInAs('customer');
    const me = await api.getUser();
    const product = (await api.listProducts())[0];
    const list = await api.createSavedList(me!.id, 'Gifts', 'Diwali');
    await api.setListItem(list.id, product.id, true);
    vi.spyOn(window, 'prompt').mockReturnValue('Diwali gifts');
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();
    const { router } = renderApp(`/lists/${list.id}`);

    expect(await screen.findByRole('heading', { name: 'Gifts' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Share list' }));
    expect(await navigator.clipboard.readText()).toContain(product.name); // user-event's clipboard stub
    expect(await screen.findByText(/List copied/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'More options' }));
    await user.click(await screen.findByRole('button', { name: 'Rename list' }));
    expect(await screen.findByRole('heading', { name: 'Diwali gifts' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: `Remove ${product.name} from list` }));
    expect(await screen.findByText('Nothing here yet')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'More options' }));
    await user.click(await screen.findByRole('button', { name: 'Delete list' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/lists'));
    expect(await screen.findByText('No lists yet')).toBeInTheDocument();
  });

  it('shows not-found for an unknown list', async () => {
    await signInAs('customer');
    renderApp('/lists/nope');
    expect(await screen.findByText('List not found')).toBeInTheDocument();
  });
});

describe('Search history', () => {
  it('re-runs and clears recent searches', async () => {
    localStorage.setItem('sanskruti-recent-searches', JSON.stringify(['kundan']));
    const user = userEvent.setup();
    const { router } = renderApp('/search');
    await user.click(await screen.findByRole('button', { name: /kundan/ }));
    expect(router.state.location.search).toBe('?q=kundan');
    await router.navigate('/search');
    await user.click(await screen.findByRole('button', { name: 'Clear' }));
    expect(screen.queryByText('Recent searches')).not.toBeInTheDocument();
    expect(localStorage.getItem('sanskruti-recent-searches')).toBe('[]');
  });

  it('clears the input and runs suggested searches', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/search');
    const box = await screen.findByRole('searchbox');
    await user.type(box, 'abc');
    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(box).toHaveValue('');
    await user.click(screen.getByRole('button', { name: 'Temple' }));
    expect(router.state.location.search).toBe('?q=Temple');
  });
});

describe('Filter sheet extras', () => {
  it('applies weight and new-only filters and clears all', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/catalogue');
    await screen.findByText(`${seedProducts.length} items`);
    await user.click(screen.getAllByRole('button', { name: /Filter/ })[0]);
    const sheet = await screen.findByRole('dialog', { name: 'Filters' });
    await user.click(within(sheet).getByRole('tab', { name: 'Weight' }));
    await user.click(within(sheet).getByRole('button', { name: 'Under 10 g' }));
    await user.click(within(sheet).getByRole('tab', { name: 'New Arrivals' }));
    await user.click(within(sheet).getByRole('checkbox', { name: 'Show only new arrivals' }));
    const expected = seedProducts.filter((p) => p.isNew && p.grossWeight <= 10).length;
    await user.click(within(sheet).getByRole('button', { name: new RegExp(`Show ${expected} item`) }));
    await waitFor(() => expect(router.state.location.search).toContain('maxw=10'));
    expect(router.state.location.search).toContain('filter=new');

    await user.click(screen.getAllByRole('button', { name: /Filter/ })[0]);
    const again = await screen.findByRole('dialog', { name: 'Filters' });
    await user.click(within(again).getByRole('button', { name: 'Clear all' }));
    await user.click(within(again).getByRole('button', { name: `Show ${seedProducts.length} items` }));
    await waitFor(() => expect(router.state.location.search).toBe(''));
  });
});

describe('Misc screens', () => {
  it('renders a 404 for unknown routes', async () => {
    renderApp('/definitely/not/here');
    expect(await screen.findByText('This page has moved or never existed')).toBeInTheDocument();
  });

  it('lists general enquiries without a product', async () => {
    await signInAs('customer');
    const me = await api.getUser();
    await api.createEnquiry(me!.id, { productId: null, name: 'A', phone: '9999999999', email: '', size: '', quantity: 1, message: 'Custom bangle' });
    renderApp('/account/enquiries');
    expect(await screen.findByText('General enquiry')).toBeInTheDocument();
  });

  it('goes back to the fallback when opened directly', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/account/enquiries');
    await waitFor(() => expect(router.state.location.pathname).toBe('/login'));
    await user.click(await screen.findByRole('button', { name: 'Back' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/account'));
  });
});

describe('Products created before the trade-spec fields existed', () => {
  async function legacyProduct() {
    await signInAs('admin');
    const [p] = await api.listProducts();
    const { images, id, views: _v, createdAt: _c, updatedAt: _u, ...rest } = p;
    void _v;
    void _c;
    void _u;
    return api.saveProduct({
      ...rest,
      id,
      make: '',
      grossWeight: null,
      stoneWeight: null,
      netWeight: null,
      quantity: null,
      weightMin: 60,
      weightMax: 70,
      images: images.map((i) => ({ url: i.url, storagePath: i.storagePath }))
    });
  }

  it('hides the missing specs and falls back to the weight range', async () => {
    const p = await legacyProduct();
    renderApp(`/product/${p.slug}`);
    const specs = (await screen.findByText('Product category')).closest('dl')!;
    expect(within(specs).queryByText('Qty')).not.toBeInTheDocument();
    expect(within(specs).queryByText('Gross weight')).not.toBeInTheDocument();
    expect(within(specs).getByText('Weight range').nextElementSibling).toHaveTextContent('60–70 g');
  });

  it('asks the admin to fill them in on the next save', async () => {
    const p = await legacyProduct();
    const user = userEvent.setup();
    renderApp(`/admin/products/${p.id}`);
    await waitFor(() => expect(screen.getByLabelText('Product name')).toHaveValue(p.name));
    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(await screen.findByText('Make is required.')).toBeInTheDocument();
    expect(screen.getByText(/Gross weight is required/)).toBeInTheDocument();
    expect(screen.getByText(/Quantity must be a whole number/)).toBeInTheDocument();
  });
});
