-- Client clarified two category names: "Aring" is Earring and "Karda" is Kada.
-- Renames them in place (products and images stay attached). Safe to re-run, and runs
-- before the seed in setup.sql so re-running it never creates duplicates.

update public.categories
set name = 'Earring', slug = 'earring'
where slug = 'aring'
  and not exists (select 1 from public.categories where slug = 'earring');

update public.categories
set name = 'Kada', slug = 'kada'
where slug = 'karda'
  and not exists (select 1 from public.categories where slug = 'kada');
