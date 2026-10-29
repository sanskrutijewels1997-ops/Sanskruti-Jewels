import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp, signInAs } from '../utils';
import { api } from '../../lib/api';
import { BRAND } from '../../data/brand';
import { seedCategories, seedProducts } from '../../data/seed';

const subsOf = (slug: string) => seedCategories.filter((c) => c.parent === slug).map((c) => c.slug);
const countIn = (slug: string) => seedProducts.filter((p) => p.category === slug || subsOf(slug).includes(p.category)).length;

describe("Client's category tree", () => {
  it('has the 16 main categories in order, with their sub-categories', () => {
    const main = seedCategories.filter((c) => !c.parent).map((c) => c.name);
    expect(main).toEqual([
      'Short Necklace',
      'Long Necklace',
      'Pendant',
      'Rings',
      'Kan Chains',
      'Earring',
      'Tops',
      'Tika',
      'Nath',
      'Vati',
      'Sui Dhaga',
      'Rajkot Vali',
      'Locket',
      'Laxmi Har',
      'Zumka',
      'Casting Rings'
    ]);
    const names = (slug: string) => seedCategories.filter((c) => c.parent === slug).map((c) => c.name);
    expect(names('rings')).toEqual(['Gents Rings', 'Ladies Rings', 'Kada']);
    expect(names('tops')).toEqual(['Karwari Tops', 'Bangali Tops']);
    expect(names('vati')).toEqual(['Rajkot Vati', 'Karwari Vati']);
    expect(names('rajkot-vali')).toEqual(['Vali', 'U V Vali', 'Singapore Vali', 'Ball Vali']);
    expect(names('locket')).toEqual(['Casting Lockets', 'Patra Lockets']);
    expect(names('zumka')).toEqual(['Coimbatore Zumka', 'Karwari Zumka']);
    expect(names('casting-rings')).toEqual(['Gents Rings', 'Ladies Rings', 'Couple Band']);
  });

  it('shows main categories with type counts on the Categories tab', async () => {
    renderApp('/categories');
    const rings = await screen.findByRole('link', { name: /^Rings/ });
    expect(rings).toHaveTextContent(`3 types · ${countIn('rings')} designs`);
    expect(screen.queryByRole('link', { name: /^Gents Rings/ })).not.toBeInTheDocument();
  });

  it('switches between sub-categories with tabs on the product list', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/catalogue?category=rings');
    const tabs = await screen.findByRole('navigation', { name: 'Rings types' });
    expect(within(tabs).getByRole('button', { name: 'All Rings' })).toHaveAttribute('aria-current', 'true');
    expect(await screen.findByText(`${countIn('rings')} items`)).toBeInTheDocument();

    await user.click(within(tabs).getByRole('button', { name: 'Ladies Rings' }));
    expect(router.state.location.search).toBe('?category=ladies-rings');
    const ladies = seedProducts.filter((p) => p.category === 'ladies-rings').length;
    expect(await screen.findByText(`Rings · ${ladies} items`)).toBeInTheDocument();
    // Siblings stay reachable from a sub-category
    expect(within(screen.getByRole('navigation', { name: 'Rings types' })).getByRole('button', { name: 'Ladies Rings' })).toHaveAttribute('aria-current', 'true');
  });

  it('shows the full category path on the product page', async () => {
    const p = seedProducts.find((x) => x.category === 'karwari-zumka')!;
    renderApp(`/product/${p.slug}`);
    const specs = (await screen.findByText('Product category')).closest('dl')!;
    expect(within(specs).getByText('Product category').nextElementSibling).toHaveTextContent('Zumka › Karwari Zumka');
  });

  it('lists sub-categories under their parent in the filter sheet with rolled-up counts', async () => {
    const user = userEvent.setup();
    renderApp('/catalogue');
    await screen.findByText(`${seedProducts.length} items`);
    await user.click(screen.getAllByRole('button', { name: /Filter/ })[0]);
    const sheet = await screen.findByRole('dialog', { name: 'Filters' });
    expect(within(sheet).getByRole('checkbox', { name: new RegExp(`^Zumka\\s*${countIn('zumka')}$`) })).toBeInTheDocument();
    expect(within(sheet).getByRole('checkbox', { name: /^Karwari Zumka/ })).toHaveClass('pl-6');
  });
});

describe('Admin sub-categories', () => {
  it('adds a sub-category from the parent row and groups the product form picker', async () => {
    await signInAs('admin');
    const user = userEvent.setup();
    renderApp('/admin/categories');
    await user.click(await screen.findByRole('button', { name: 'Add sub-category to Nath' }));
    expect(await screen.findByRole('dialog', { name: 'New sub-category' })).toBeInTheDocument();
    expect(screen.getByLabelText('Parent category')).toHaveDisplayValue('Nath');
    await user.type(screen.getByLabelText('Name'), 'Bridal Nath');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('Saved “Bridal Nath”')).toBeInTheDocument();
    const cats = await api.listCategories();
    const nath = cats.find((c) => c.slug === 'nath')!;
    expect(cats.find((c) => c.slug === 'bridal-nath')?.parentId).toBe(nath.id);
  });

  it('keeps a category with sub-categories as a main category', async () => {
    await signInAs('admin');
    const user = userEvent.setup();
    renderApp('/admin/categories');
    await user.click(await screen.findByRole('button', { name: 'Edit Rings' }));
    expect(await screen.findByLabelText('Parent category')).toBeDisabled();
  });
});

describe('Home intro', () => {
  it('introduces the business with the quality and punctuality promise', async () => {
    renderApp('/');
    const intro = await screen.findByRole('region', { name: BRAND.intro.title });
    expect(within(intro).getByText(/uncompromising quality and punctuality/)).toBeInTheDocument();
    expect(within(intro).getByText(/completely tension-free/)).toBeInTheDocument();
    for (const pillar of ['Quality', 'Punctuality', 'Trust', 'Tension-free']) {
      expect(within(intro).getByText(pillar)).toBeInTheDocument();
    }
    expect(within(intro).getByText(new RegExp(`Since 1977 · ${new Date().getFullYear() - 1977} years of trust`))).toBeInTheDocument();
  });
});
