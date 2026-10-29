-- Sub-categories: a category can sit under one parent (one level deep).
-- Safe to re-run (part of setup.sql).

alter table public.categories
  add column if not exists parent_id uuid references public.categories (id) on delete cascade;

create index if not exists categories_parent_idx on public.categories (parent_id);

alter table public.categories drop constraint if exists categories_not_own_parent;
alter table public.categories add constraint categories_not_own_parent check (parent_id is null or parent_id <> id);

-- Keep the tree one level deep: a parent can't itself have a parent, and a category
-- that already has sub-categories can't be moved under another one.
create or replace function public.categories_one_level()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.parent_id is not null then
    if exists (select 1 from categories where id = new.parent_id and parent_id is not null) then
      raise exception 'Sub-categories can only be one level deep';
    end if;
    if exists (select 1 from categories where parent_id = new.id) then
      raise exception 'A category with sub-categories cannot become a sub-category';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists categories_one_level on public.categories;
create trigger categories_one_level
  before insert or update of parent_id on public.categories
  for each row execute function public.categories_one_level();
