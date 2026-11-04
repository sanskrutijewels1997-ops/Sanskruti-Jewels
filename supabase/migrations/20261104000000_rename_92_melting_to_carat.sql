-- The trade purity "92 Melting" is now called "92 Carat". Renames it on existing products.
-- Safe to re-run, and runs before the seed in setup.sql.

update public.products
set purity = '92 Carat'
where purity = '92 Melting';
