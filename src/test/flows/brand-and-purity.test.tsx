import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '../utils';
import { seedProducts } from '../../data/seed';
import { MELTING_92, purities, purityShortcuts } from '../../data/options';

const count = (purity: string) => seedProducts.filter((p) => p.purity === purity).length;

describe('Brand', () => {
  it('shows the slogan and the Since 1977 badge at the top of Home', async () => {
    renderApp('/');
    // Phone strip + desktop strip are both in the DOM under jsdom
    expect((await screen.findAllByText('Sell More · Stock Less')).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('img', { name: 'Since 1977' }).length).toBeGreaterThan(0);
  });
});

describe('Purity shortcuts', () => {
  it('offers 92 Melting in the admin purity list', () => {
    expect(purities).toContain(MELTING_92);
    expect(purityShortcuts.map((s) => s.label)).toEqual(['92 Melting', '22 Carat']);
  });

  it('shows both shortcuts on Home with live counts and opens the filtered list', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/');
    const nav = await screen.findByRole('navigation', { name: 'Shop by purity' });
    const melting = within(nav).getByRole('link', { name: /92 Melting/ });
    await waitFor(() => expect(melting).toHaveTextContent(`${count(MELTING_92)} designs`));
    expect(within(nav).getByRole('link', { name: /22 Carat/ })).toHaveTextContent(`${count('22K')} designs`);

    await user.click(melting);
    expect(router.state.location.pathname).toBe('/catalogue');
    expect(router.state.location.search).toBe(`?purity=${encodeURIComponent(MELTING_92)}`);
    expect(await screen.findByRole('heading', { name: '92 Melting', level: 1 })).toBeInTheDocument();
    expect(await screen.findByText(`${count(MELTING_92)} items`)).toBeInTheDocument();
  });

  it('lets shoppers switch between the two purities from the list chips', async () => {
    const user = userEvent.setup();
    const { router } = renderApp(`/catalogue?purity=${encodeURIComponent(MELTING_92)}`);
    await screen.findByText(`${count(MELTING_92)} items`);
    const chip92 = screen.getByRole('button', { name: '92 Melting' });
    expect(chip92).toHaveAttribute('aria-pressed', 'true');

    // Toggle 92 off and 22 on
    await user.click(chip92);
    await user.click(screen.getByRole('button', { name: '22 Carat' }));
    await waitFor(() => expect(router.state.location.search).toBe('?purity=22K'));
    expect(await screen.findByRole('heading', { name: '22 Carat', level: 1 })).toBeInTheDocument();
    expect(await screen.findByText(`${count('22K')} items`)).toBeInTheDocument();
  });

  it('scopes search suggestions and results to the chosen purity', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/search');
    await user.type(await screen.findByRole('searchbox'), 'bridal');
    const all = seedProducts.filter((p) => /bridal/i.test(`${p.name} ${p.description} ${p.style}`)).length;
    expect(await screen.findByRole('button', { name: `See all ${all} results` })).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: '92 Melting' }));
    const scoped = seedProducts.filter((p) => p.purity === MELTING_92 && /bridal/i.test(`${p.name} ${p.description} ${p.style}`)).length;
    expect(scoped).toBeLessThan(all);
    await user.click(await screen.findByRole('button', { name: `See all ${scoped} results` }));
    expect(router.state.location.search).toBe(`?q=bridal&purity=${encodeURIComponent(MELTING_92).replace(/%20/g, '+')}`);
    expect(await screen.findByText(`${scoped} ${scoped === 1 ? 'item' : 'items'}`)).toBeInTheDocument();
  });
});
