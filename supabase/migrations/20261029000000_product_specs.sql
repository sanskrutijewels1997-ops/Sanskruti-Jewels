-- Core trade specifications for every product: make, weights and quantity.
-- Safe to re-run (part of setup.sql).

alter table public.products add column if not exists make text not null default '';
alter table public.products add column if not exists gross_weight numeric(10, 3);
alter table public.products add column if not exists stone_weight numeric(10, 3);
alter table public.products add column if not exists net_weight numeric(10, 3);
-- Null = not entered yet (existing products); the admin form requires it on save.
alter table public.products add column if not exists quantity int;

alter table public.products drop constraint if exists products_weights_check;
alter table public.products add constraint products_weights_check check (
  (gross_weight is null or gross_weight >= 0)
  and (stone_weight is null or stone_weight >= 0)
  and (net_weight is null or net_weight >= 0)
  and (gross_weight is null or stone_weight is null or stone_weight <= gross_weight)
  and (gross_weight is null or net_weight is null or net_weight <= gross_weight)
);

alter table public.products drop constraint if exists products_quantity_check;
alter table public.products add constraint products_quantity_check check (quantity is null or quantity >= 0);

comment on column public.products.is_featured is 'Trending (Yes/No): shown in the Trending Now row';
