-- Sanskruti Jewels — initial schema (safe to re-run)
-- Roles: every auth user gets a row in public.profiles with role 'customer'.
-- Admins are promoted manually (see README) and are the only ones who can
-- write catalogue data or read other people's data.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Profiles & roles
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text not null default '',
  phone text not null default '',
  city text not null default '',
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Customers may edit their own profile but never their role or email.
-- Deliberately SECURITY INVOKER so current_user is the caller's role
-- ('authenticated' over the API, 'postgres' in the SQL editor).
create or replace function public.guard_profile_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if (new.role is distinct from old.role or new.email is distinct from old.email)
     and not public.is_admin()
     and current_user not in ('postgres', 'service_role', 'supabase_admin') then
    raise exception 'Only admins can change role or email';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_guard_update on public.profiles;
create trigger profiles_guard_update
  before update on public.profiles
  for each row execute function public.guard_profile_update();

-- ---------------------------------------------------------------------------
-- Catalogue
-- ---------------------------------------------------------------------------

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text not null default '',
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  slug text not null unique,
  name text not null,
  description text not null default '',
  category_id uuid references public.categories (id) on delete set null,
  collection_id uuid references public.collections (id) on delete set null,
  style text not null default '',
  metal text not null default 'Gold',
  purity text not null default '22K',
  weight_min numeric(10, 3),
  weight_max numeric(10, 3),
  stone text not null default '',
  size text not null default '',
  availability text not null default 'Ready Stock'
    check (availability in ('Ready Stock', 'Made to Order')),
  price numeric(12, 2) check (price is null or price >= 0),
  show_price boolean not null default false,
  -- Free-form extra specifications: [{ "label": "Hallmark", "value": "BIS 916" }, ...]
  specifications jsonb not null default '[]'::jsonb
    check (jsonb_typeof(specifications) = 'array'),
  is_new boolean not null default true,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  views int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_collection_idx on public.products (collection_id);
create index if not exists products_published_idx on public.products (is_published, created_at desc);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  -- Path inside the product-images storage bucket; null for bundled seed images.
  storage_path text,
  alt text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_idx on public.product_images (product_id, sort_order);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists products_touch on public.products;
create trigger products_touch
  before update on public.products
  for each row execute function public.touch_updated_at();

-- Atomically replace a product's images with an ordered list.
-- SECURITY INVOKER, so the admin-only RLS policies on product_images apply.
-- Returns the storage paths that are no longer referenced, for the client to delete.
create or replace function public.replace_product_images(p_product_id uuid, p_images jsonb)
returns text[]
language plpgsql
set search_path = public
as $$
declare
  removed text[];
begin
  select coalesce(array_agg(storage_path), '{}') into removed
  from product_images
  where product_id = p_product_id
    and storage_path is not null
    and storage_path not in (
      select coalesce(e ->> 'storage_path', '') from jsonb_array_elements(p_images) e
    );

  delete from product_images where product_id = p_product_id;

  insert into product_images (product_id, url, storage_path, alt, sort_order)
  select p_product_id, e ->> 'url', e ->> 'storage_path', coalesce(e ->> 'alt', ''), (ord - 1)::int
  from jsonb_array_elements(p_images) with ordinality as t(e, ord);

  return removed;
end;
$$;

-- Anyone may bump the view counter of a published product, nothing else.
create or replace function public.record_product_view(p_product_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.products set views = views + 1
  where id = p_product_id and is_published;
$$;

-- ---------------------------------------------------------------------------
-- Customer data
-- ---------------------------------------------------------------------------

create table if not exists public.wishlist_items (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create index if not exists wishlist_product_idx on public.wishlist_items (product_id);

create table if not exists public.saved_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  occasion text not null default '',
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saved_lists_user_idx on public.saved_lists (user_id);

drop trigger if exists saved_lists_touch on public.saved_lists;
create trigger saved_lists_touch
  before update on public.saved_lists
  for each row execute function public.touch_updated_at();

create table if not exists public.saved_list_items (
  list_id uuid not null references public.saved_lists (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (list_id, product_id)
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  product_id uuid references public.products (id) on delete set null,
  name text not null,
  phone text not null,
  email text not null default '',
  size text not null default '',
  quantity int not null default 1 check (quantity > 0),
  message text not null default '',
  status text not null default 'New' check (status in ('New', 'Contacted', 'Closed')),
  admin_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists enquiries_status_idx on public.enquiries (status, created_at desc);
create index if not exists enquiries_user_idx on public.enquiries (user_id);

drop trigger if exists enquiries_touch on public.enquiries;
create trigger enquiries_touch
  before update on public.enquiries
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Admin reporting
-- ---------------------------------------------------------------------------

create or replace function public.admin_stats()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admins only';
  end if;
  return json_build_object(
    'products', (select count(*) from products),
    'published', (select count(*) from products where is_published),
    'customers', (select count(*) from profiles where role = 'customer'),
    'enquiries_open', (select count(*) from enquiries where status <> 'Closed'),
    'wishlist_adds', (select count(*) from wishlist_items),
    'total_views', (select coalesce(sum(views), 0) from products),
    'top_wishlisted', (
      select coalesce(json_agg(t), '[]'::json) from (
        select p.id, p.name, p.sku, count(w.*)::int as count
        from products p join wishlist_items w on w.product_id = p.id
        group by p.id order by count desc limit 5
      ) t
    ),
    'by_category', (
      select coalesce(json_agg(t), '[]'::json) from (
        select coalesce(c.name, 'Uncategorised') as name, count(p.*)::int as count
        from products p left join categories c on c.id = p.category_id
        group by c.name order by count desc
      ) t
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.saved_lists enable row level security;
alter table public.saved_list_items enable row level security;
alter table public.enquiries enable row level security;

-- profiles
drop policy if exists "profiles: read own or admin" on public.profiles;
create policy "profiles: read own or admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles: update own or admin" on public.profiles;
create policy "profiles: update own or admin" on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- categories / collections: public read, admin write
drop policy if exists "categories: public read" on public.categories;
create policy "categories: public read" on public.categories for select using (true);
drop policy if exists "categories: admin write" on public.categories;
create policy "categories: admin write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "collections: public read" on public.collections;
create policy "collections: public read" on public.collections for select using (true);
drop policy if exists "collections: admin write" on public.collections;
create policy "collections: admin write" on public.collections
  for all using (public.is_admin()) with check (public.is_admin());

-- products: published ones are public, drafts only for admins
drop policy if exists "products: read published or admin" on public.products;
create policy "products: read published or admin" on public.products
  for select using (is_published or public.is_admin());
drop policy if exists "products: admin write" on public.products;
create policy "products: admin write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "product_images: read if product visible" on public.product_images;
create policy "product_images: read if product visible" on public.product_images
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_id and (p.is_published or public.is_admin())
    )
  );
drop policy if exists "product_images: admin write" on public.product_images;
create policy "product_images: admin write" on public.product_images
  for all using (public.is_admin()) with check (public.is_admin());

-- wishlist: own rows only
drop policy if exists "wishlist: own" on public.wishlist_items;
create policy "wishlist: own" on public.wishlist_items
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- saved lists: own rows only
drop policy if exists "saved_lists: own" on public.saved_lists;
create policy "saved_lists: own" on public.saved_lists
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "saved_list_items: own" on public.saved_list_items;
create policy "saved_list_items: own" on public.saved_list_items
  for all using (
    exists (select 1 from public.saved_lists l where l.id = list_id and l.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.saved_lists l where l.id = list_id and l.user_id = auth.uid())
  );

-- enquiries: anyone (incl. guests) can submit; signed-in customers see their own;
-- admins see and manage all.
drop policy if exists "enquiries: submit" on public.enquiries;
create policy "enquiries: submit" on public.enquiries
  for insert with check (
    (user_id is null or user_id = auth.uid())
    and status = 'New' and admin_note = ''
  );
drop policy if exists "enquiries: read own or admin" on public.enquiries;
create policy "enquiries: read own or admin" on public.enquiries
  for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "enquiries: admin update" on public.enquiries;
create policy "enquiries: admin update" on public.enquiries
  for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "enquiries: admin delete" on public.enquiries;
create policy "enquiries: admin delete" on public.enquiries
  for delete using (public.is_admin());

grant execute on function public.record_product_view(uuid) to anon, authenticated;
grant execute on function public.admin_stats() to authenticated;
grant execute on function public.replace_product_images(uuid, jsonb) to authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage: product images bucket (public read, admin write)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

drop policy if exists "product-images: admin insert" on storage.objects;
create policy "product-images: admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "product-images: admin update" on storage.objects;
create policy "product-images: admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "product-images: admin delete" on storage.objects;
create policy "product-images: admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
