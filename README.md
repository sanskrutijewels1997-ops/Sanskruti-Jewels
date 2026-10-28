# Sanskruti Jewels

Jewellery storefront with customer accounts and an admin console. It runs as a web app on
Vercel today and ships to iOS and Android from the same codebase with Capacitor.

- **Customers:** browse and filter the catalogue, wishlist, saved lists (e.g. "Wedding
  shortlist") with notes, recently viewed, enquiries about price/size/customisation, profile.
- **Admins:** dashboard; product create/edit with multi-photo upload (auto-compressed,
  reorderable, cover image), specifications plus custom spec rows, price or "price on
  request", draft/publish; categories and collections with cover images; enquiry inbox
  with status and internal notes; customer list with admin promotion.

### App experience

The UI is built mobile-first, following shopping apps such as Myntra and CaratLane and
Baymard's product-list research:

- Bottom tab bar (Home · Categories · Wishlist · Profile); pushed screens get a back button
  and hide the tabs.
- Home: tap-to-search bar, story-style category circles, swipeable banners, product rails.
- Product list: split **Sort | Filter** bar pinned to the bottom. Filters open a full-screen
  sheet with facets on the left and live result counts, plus removable applied-filter chips.
  Filters live in the URL, so Back returns to the same filtered list and scroll position.
- Product page: edge-to-edge swipe gallery, collapsible details, sticky Wishlist / Enquire bar.
- Bottom sheets (drag to close), snackbars with actions, light/dark theme that follows the
  phone, and a manual switch under Profile → Appearance.
- Native touches through Capacitor: Android back button closes sheets first, haptic tap on
  wishlist, status bar matched to the theme. Desktop gets a top nav and wider grids.

## Stack

| Layer | Choice |
| --- | --- |
| UI | React 18, TypeScript, Vite, Tailwind, Framer Motion |
| Data fetching | TanStack Query |
| Backend | [Supabase](https://supabase.com): Postgres, Auth, Storage. No custom server. |
| Security | Postgres Row Level Security (see `supabase/migrations`) |
| Web hosting | Vercel (`vercel.json`) |
| Mobile | Capacitor 7 (`android/`, `ios/`) |

Roles are enforced in the database, not just the UI. Customers can only read and write
their own wishlist, lists and enquiries. Only admins can write catalogue data or upload
images, and nobody can promote themselves to admin.

## Running locally

```bash
npm install
```

```bash
npm run dev
```

With no Supabase env vars the app runs in **demo mode**. Data is seeded from
`src/data/seed.ts` and kept in browser localStorage, and a banner shows the demo logins
(`admin@sanskruti.demo` / `admin123`, `customer@sanskruti.demo` / `customer123`). Demo
mode is for previews only: data isn't shared between devices.

### Local Supabase (optional, needs Docker)

```bash
npx supabase start
```

```bash
npx supabase db reset
```

Copy the printed API URL and anon key into `.env.local` (see `.env.example`).

## Going live

### 1. Supabase

1. Create a project at supabase.com (pick the Mumbai region for Indian customers).
2. Set up the database. The easiest way is the SQL editor:
   - Open **SQL Editor → New query**, so the editor is empty.
   - Open [`supabase/setup.sql`](supabase/setup.sql) on GitHub, click **Raw**, select all and copy.
   - Paste it into the empty query and click **Run**. You should see `Success`.

   This one file creates the tables, security rules and image storage bucket, and loads the
   38 starter products. It's safe to run again if anything goes wrong part-way.

   If you prefer the CLI:
   ```bash
   npx supabase link --project-ref <your-project-ref>
   ```
   ```bash
   npx supabase db push
   ```
   ```bash
   psql "<connection string>" -f supabase/seed.sql
   ```
3. **Authentication → URL Configuration:** set the Site URL to your Vercel domain. Add
   `https://<your-domain>/reset-password` and `capacitor://localhost` to the redirect URLs.
4. Sign up on the site with your own email, then make yourself admin in the SQL editor:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```
   After that you can promote other staff from **Admin → Customers**.

### 2. Vercel

Import the repo in Vercel (it auto-detects Vite). Add these environment variables:

| Variable | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | Project Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Project Settings → API → `anon` public key |
| `VITE_WHATSAPP_NUMBER` | optional, e.g. `919876543210`; adds WhatsApp buttons |
| `VITE_CONTACT_EMAIL` | optional, shown in the footer |

The anon key is safe to ship in the browser because RLS protects the data. Never put the
`service_role` key in a `VITE_` variable.

### 3. iOS and Android (Capacitor)

The native projects are committed in `android/` and `ios/`. Set the same `VITE_*` values
in `.env.production.local` before building, because they're baked into the bundle.

```bash
npm run cap:android
```

```bash
npm run cap:ios
```

Each script builds the web app, syncs it into the native project and opens Android Studio
or Xcode. iOS needs a Mac with Xcode and CocoaPods (`cd ios/App && pod install` the first
time). App ID: `com.sanskrutijewels.app`.

Icons and splash screens are generated from `resources/` with
`npx @capacitor/assets generate`.

## Project layout

```
src/
  lib/api/        backend interface + Supabase and demo implementations
  lib/queries.ts  TanStack Query hooks (catalogue, keys)
  contexts/       AuthContext (session, profile, role), AppContext (wishlist, lists, modals)
  pages/          storefront, auth/, account/, admin/
  components/     layout, product card, modals, admin image uploader
  data/seed.ts    starter catalogue (demo mode + seed.sql source)
supabase/
  migrations/     schema, RLS policies, storage bucket, RPCs
  seed.sql        starter catalogue, generated by `npm run seed:sql`
  setup.sql       migrations + seed in one file for the SQL editor (generated)
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | dev server |
| `npm run build` | type-check and production build |
| `npm run lint` | ESLint |
| `npm run seed:sql` | regenerate `supabase/seed.sql` and `supabase/setup.sql` |
| `npm run cap:android` / `cap:ios` | build, sync and open the native IDE |
