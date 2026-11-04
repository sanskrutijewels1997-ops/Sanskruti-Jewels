-- Recently deleted: admins can restore products, categories and enquiries for 30 days.
-- Deleting sets deleted_at; the row and its links stay in place until the app removes it
-- for good. Deleted rows are visible to admins only. Safe to re-run.

alter table public.products add column if not exists deleted_at timestamptz;
alter table public.categories add column if not exists deleted_at timestamptz;
alter table public.enquiries add column if not exists deleted_at timestamptz;

drop policy if exists "products: read published or admin" on public.products;
create policy "products: read published or admin" on public.products
  for select using ((is_published and deleted_at is null) or public.is_admin());

drop policy if exists "product_images: read if product visible" on public.product_images;
create policy "product_images: read if product visible" on public.product_images
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_id and ((p.is_published and p.deleted_at is null) or public.is_admin())
    )
  );

drop policy if exists "categories: public read" on public.categories;
create policy "categories: public read" on public.categories
  for select using (deleted_at is null or public.is_admin());

drop policy if exists "enquiries: read own or admin" on public.enquiries;
create policy "enquiries: read own or admin" on public.enquiries
  for select using ((user_id = auth.uid() and deleted_at is null) or public.is_admin());

-- The starter platinum piece no longer fits the catalogue; it can be restored for 30 days.
update public.products set deleted_at = now()
where sku = 'SJ-103186' and metal = 'Platinum' and deleted_at is null;

-- Dashboard numbers leave out anything deleted.
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
    'products', (select count(*) from products where deleted_at is null),
    'published', (select count(*) from products where is_published and deleted_at is null),
    'customers', (select count(*) from profiles where role = 'customer'),
    'enquiries_open', (select count(*) from enquiries where status <> 'Closed' and deleted_at is null),
    'wishlist_adds', (
      select count(*) from wishlist_items w
      join products p on p.id = w.product_id
      where p.deleted_at is null
    ),
    'total_views', (select coalesce(sum(views), 0) from products where deleted_at is null),
    'top_wishlisted', (
      select coalesce(json_agg(t), '[]'::json) from (
        select p.id, p.name, p.sku, count(w.*)::int as count
        from products p join wishlist_items w on w.product_id = p.id
        where p.deleted_at is null
        group by p.id order by count desc limit 5
      ) t
    ),
    'by_category', (
      select coalesce(json_agg(t), '[]'::json) from (
        select coalesce(c.name, 'Uncategorised') as name, count(p.*)::int as count
        from products p left join categories c on c.id = p.category_id and c.deleted_at is null
        where p.deleted_at is null
        group by c.name order by count desc
      ) t
    )
  );
end;
$$;
