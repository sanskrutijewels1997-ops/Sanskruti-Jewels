import { BRAND } from '../data/brand';

function upsertLink(rel: string, href: string, sizes?: string) {
  const selector = sizes ? `link[rel="${rel}"][sizes="${sizes}"]` : `link[rel="${rel}"]`;
  let link = document.head.querySelector<HTMLLinkElement>(selector);
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    if (sizes) link.sizes.value = sizes;
    document.head.appendChild(link);
  }
  link.href = href;
}

function upsertMeta(name: string, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

export function installHomeScreenIcon() {
  const icon = BRAND.logo;

  // iOS "Add to Home Screen"
  upsertLink('apple-touch-icon', icon);
  upsertLink('apple-touch-icon', icon, '180x180');
  // Browser tab + Android fallback
  upsertLink('icon', icon);
  upsertLink('shortcut icon', icon);

  upsertMeta('apple-mobile-web-app-title', BRAND.name);
  upsertMeta('application-name', BRAND.name);
  upsertMeta('apple-mobile-web-app-capable', 'yes');
  upsertMeta('mobile-web-app-capable', 'yes');
  upsertMeta('apple-mobile-web-app-status-bar-style', 'black');
  upsertMeta('theme-color', '#0A0908');

  // Android / Chrome install manifest
  const manifest = {
    name: BRAND.name,
    short_name: BRAND.name,
    start_url: window.location.origin + '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#0A0908',
    icons: [
    { src: icon, sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: icon, sizes: '512x512', type: 'image/png', purpose: 'any' }]

  };
  const blob = new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' });
  upsertLink('manifest', URL.createObjectURL(blob));

  document.title = `${BRAND.name} — ${BRAND.slogan}`;
}