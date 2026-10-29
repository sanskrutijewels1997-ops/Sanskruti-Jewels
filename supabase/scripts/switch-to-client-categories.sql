-- OPTIONAL one-off: move an existing database from the original starter categories
-- (Necklaces, Earrings, Bangles, …) to the client's category tree.
--
-- Run this AFTER the latest setup.sql, in the Supabase SQL editor. It only touches the
-- original starter data:
--   1. moves the starter products (by their SJ-… SKU) into the new categories;
--   2. unpublishes the starter products that fit no new category (bangles, bracelets,
--      chains, kids) — they are hidden, not deleted, so you can re-categorise them;
--   3. deletes the old starter categories. Any of YOUR products still in one of those
--      old categories will become uncategorised (they are not deleted) — re-assign them in
--      Admin → Products afterwards.
-- It is safe to run more than once.

begin;

with remap(sku, slug) as (
  values
    ('SJ-102847', 'short-necklace'),
    ('SJ-102853', 'long-necklace'),
    ('SJ-102861', 'coimbatore-zumka'),
    ('SJ-102872', 'gents-rings'),
    ('SJ-102884', 'casting-ladies-rings'),
    ('SJ-102925', 'pendant'),
    ('SJ-102938', 'rajkot-vati'),
    ('SJ-102944', 'kada'),
    ('SJ-102957', 'short-necklace'),
    ('SJ-102968', 'laxmi-har'),
    ('SJ-102979', 'earring'),
    ('SJ-102994', 'long-necklace'),
    ('SJ-103002', 'karwari-tops'),
    ('SJ-103021', 'pendant'),
    ('SJ-103038', 'karwari-vati'),
    ('SJ-103044', 'short-necklace'),
    ('SJ-103063', 'karwari-zumka'),
    ('SJ-103071', 'ladies-rings'),
    ('SJ-103096', 'ladies-rings'),
    ('SJ-103117', 'tika'),
    ('SJ-103126', 'casting-gents-rings'),
    ('SJ-103139', 'long-necklace'),
    ('SJ-103147', 'laxmi-har'),
    ('SJ-103155', 'casting-lockets'),
    ('SJ-103168', 'short-necklace'),
    ('SJ-103186', 'couple-band'),
    ('SJ-103203', 'long-necklace')
)
update public.products p
set category_id = c.id
from remap r
join public.categories c on c.slug = r.slug
where p.sku = r.sku;

update public.products
set is_published = false
where sku in ('SJ-102890', 'SJ-102903', 'SJ-102911', 'SJ-102986', 'SJ-103015', 'SJ-103057', 'SJ-103085', 'SJ-103108', 'SJ-103174', 'SJ-103195', 'SJ-103217');

delete from public.categories
where slug in ('necklaces', 'earrings', 'bangles', 'bracelets', 'chains', 'pendants', 'mangalsutras', 'jewellery-sets', 'bridal', 'mens', 'kids');

commit;
