// Serves /product/:slug with the product's name, description and cover photo in the
// Open Graph tags, so a shared link shows the jewellery in WhatsApp, iMessage, etc.
// Link previewers don't run JavaScript, so the tags have to be in the HTML itself.
// The page is otherwise the normal app shell (dist/index.html).

export const config = { runtime: 'edge' };

interface ProductRow {
  name: string;
  description: string;
  product_images: { url: string; sort_order: number }[] | null;
}

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function findProduct(slug: string): Promise<ProductRow | null> {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const query = new URLSearchParams({
    slug: `eq.${slug}`,
    is_published: 'eq.true',
    select: 'name,description,product_images(url,sort_order)',
    limit: '1'
  });
  try {
    const res = await fetch(`${url}/rest/v1/products?${query}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!res.ok) return null;
    const rows = (await res.json()) as ProductRow[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export default async function handler(req: Request): Promise<Response> {
  const reqUrl = new URL(req.url);
  const origin = reqUrl.origin;
  const slug = reqUrl.searchParams.get('slug') ?? '';

  const [shellRes, product] = await Promise.all([fetch(`${origin}/index.html`), slug ? findProduct(slug) : null]);
  let html = await shellRes.text();

  if (product) {
    const cover = [...(product.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)[0]?.url;
    const title = `${product.name} | Sanskruti Jewels`;
    const description = (product.description || 'Hallmarked gold jewellery from Sanskruti Jewels. Enquire for today’s price.').slice(0, 200);
    const pageUrl = `${origin}/product/${encodeURIComponent(slug)}`;
    const tags = [
      `<meta property="og:type" content="product" />`,
      `<meta property="og:url" content="${escape(pageUrl)}" />`,
      `<meta property="og:title" content="${escape(title)}" />`,
      `<meta property="og:description" content="${escape(description)}" />`,
      cover ? `<meta property="og:image" content="${escape(new URL(cover, origin).href)}" />` : '',
      `<meta name="twitter:card" content="${cover ? 'summary_large_image' : 'summary'}" />`
    ].join('\n    ');
    html = html
      .replace(/\s*<meta property="og:[^>]*>/g, '')
      .replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
      .replace('</head>', `    ${tags}\n  </head>`);
  }

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400'
    }
  });
}
