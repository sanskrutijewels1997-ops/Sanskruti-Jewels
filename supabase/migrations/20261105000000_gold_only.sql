-- Sanskruti deals only in gold. Starter pieces marked "Diamond" are gold set with diamonds.
-- Safe to re-run, and runs before the seed in setup.sql.

update public.products set metal = 'Gold' where metal = 'Diamond';
