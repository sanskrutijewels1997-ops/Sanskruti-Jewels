import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp, signInAs } from '../utils';
import { api } from '../../lib/api';
import { DEMO_ACCOUNTS } from '../../lib/api/demo';
import { seedProducts } from '../../data/seed';

describe('Sign in / sign up', () => {
  it('shows a friendly error for a wrong password', async () => {
    const user = userEvent.setup();
    renderApp('/login');
    await user.type(await screen.findByLabelText('Email'), DEMO_ACCOUNTS.customer.email);
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByText('Incorrect email or password.')).toBeInTheDocument();
  });

  it('returns to the page in ?next after signing in', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/login?next=/wishlist');
    await user.type(await screen.findByLabelText('Email'), DEMO_ACCOUNTS.customer.email);
    await user.type(screen.getByLabelText('Password'), DEMO_ACCOUNTS.customer.password);
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/wishlist'));
  });

  it('never redirects off-site after login', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/login?next=//evil.example');
    await user.type(await screen.findByLabelText('Email'), DEMO_ACCOUNTS.customer.email);
    await user.type(screen.getByLabelText('Password'), DEMO_ACCOUNTS.customer.password);
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/account'));
  });

  it('validates the password length and creates an account', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/register');
    await user.type(await screen.findByLabelText('Full name'), 'Riya Patil');
    await user.type(screen.getByLabelText('Email'), 'riya@example.com');
    await user.type(screen.getByLabelText('Password'), 'short');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    expect(await screen.findByText(/at least 8 characters/)).toBeInTheDocument();
    await user.type(screen.getByLabelText('Password'), 'enough123');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/account'));
    expect(await screen.findByText('Riya Patil')).toBeInTheDocument();
  });

  it('sends a password reset link', async () => {
    const user = userEvent.setup();
    renderApp('/forgot-password');
    await user.type(await screen.findByLabelText('Email'), 'x@example.com');
    await user.click(screen.getByRole('button', { name: 'Send reset link' }));
    expect(await screen.findByText(/a reset link is on its way/)).toBeInTheDocument();
  });

  it('shows the expired state on reset-password without a session', async () => {
    renderApp('/reset-password');
    expect(await screen.findByText('Link expired')).toBeInTheDocument();
  });
});

describe('Guards', () => {
  it('sends guests to login for account screens', async () => {
    const { router } = renderApp('/account/enquiries');
    await waitFor(() => expect(router.state.location.pathname).toBe('/login'));
    expect(router.state.location.search).toContain(encodeURIComponent('/account/enquiries'));
  });

  it('blocks customers from the admin console', async () => {
    await signInAs('customer');
    renderApp('/admin');
    expect(await screen.findByRole('heading', { name: 'Admins only' })).toBeInTheDocument();
  });
});

describe('Wishlist', () => {
  it('asks guests to sign in', async () => {
    renderApp('/wishlist');
    expect(await screen.findByText('Save the pieces you love')).toBeInTheDocument();
  });

  it('adds from the list, shows a snackbar, and removes from the wishlist tab', async () => {
    await signInAs('customer');
    const user = userEvent.setup();
    const { router } = renderApp('/catalogue');
    const first = (await screen.findAllByRole('article'))[0];
    await user.click(within(first).getByRole('button', { name: 'Add to wishlist' }));
    expect(await screen.findByText('Added to wishlist')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'View' }));
    expect(router.state.location.pathname).toBe('/wishlist');
    expect(await screen.findByText('1 item')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^Remove .* from wishlist$/ }));
    expect(await screen.findByText('Your wishlist is empty')).toBeInTheDocument();
  });
});

describe('Profile', () => {
  it('shows sign-in options to guests', async () => {
    renderApp('/account');
    expect(await screen.findByText('Welcome to Sanskruti Jewels')).toBeInTheDocument();
    expect(screen.getByText('Demo mode')).toBeInTheDocument();
  });

  it('switches theme, edits the profile and signs out', async () => {
    await signInAs('customer');
    const user = userEvent.setup();
    const { router } = renderApp('/account');
    expect(await screen.findByText('Ananya Kulkarni')).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'Dark' }));
    expect(document.documentElement.dataset.theme).toBe('dark');

    await user.click(screen.getByRole('link', { name: 'Edit profile' }));
    const city = await screen.findByLabelText('City');
    await waitFor(() => expect(city).toHaveValue('Pune'));
    await user.clear(city);
    await user.type(city, 'Nashik');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/account'));
    const me = await api.getUser();
    expect((await api.getProfile(me!.id))?.city).toBe('Nashik');

    await user.click(await screen.findByRole('button', { name: 'Sign out' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/'));
    expect(await api.getUser()).toBeNull();
  });

  it('shows the admin console entry only to admins', async () => {
    await signInAs('admin');
    renderApp('/account');
    expect(await screen.findByRole('link', { name: 'Admin console' })).toBeInTheDocument();
  });
});

describe('Lists', () => {
  it('creates a list, saves a product to it and edits the note', async () => {
    await signInAs('customer');
    const user = userEvent.setup();
    const { router } = renderApp('/lists');
    await user.click(await screen.findByRole('button', { name: 'Create your first list' }));
    await user.type(await screen.findByLabelText('List name'), 'Wedding shortlist');
    await user.click(screen.getByRole('button', { name: 'Create list' }));
    await waitFor(() => expect(router.state.location.pathname).toMatch(/^\/lists\/.+/));
    expect(await screen.findByText('Nothing here yet')).toBeInTheDocument();

    // Save a product to it from the product page
    const p = seedProducts[1];
    await router.navigate(`/product/${p.slug}`);
    await user.click(await screen.findByRole('button', { name: 'Save to list' }));
    await user.click(await screen.findByRole('button', { name: /Wedding shortlist/ }));
    expect(await screen.findByText('Added to list')).toBeInTheDocument();

    await router.navigate(-1);
    const card = await screen.findByRole('article');
    expect(within(card).getByText(p.name)).toBeInTheDocument();
    const note = screen.getByPlaceholderText(/Budget, sizes/);
    await user.type(note, 'Budget 5L');
    await user.tab();
    const me = await api.getUser();
    await waitFor(async () => expect((await api.listSavedLists(me!.id))[0].note).toBe('Budget 5L'));
  });
});

describe('My enquiries', () => {
  it('lists my enquiries with status', async () => {
    await signInAs('customer');
    const me = await api.getUser();
    const product = (await api.listProducts())[0];
    await api.createEnquiry(me!.id, { productId: product.id, name: 'A', phone: '9999999999', email: '', size: '', quantity: 2, message: 'Need it by Diwali' });
    renderApp('/account/enquiries');
    expect(await screen.findByText('Need it by Diwali')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText(/Qty 2/)).toBeInTheDocument();
  });
});
