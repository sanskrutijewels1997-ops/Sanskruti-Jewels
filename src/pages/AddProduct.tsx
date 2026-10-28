import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3Icon,
  BoxesIcon,
  FileTextIcon,
  ImagePlusIcon,
  LayoutDashboardIcon,
  PackageIcon,
  PlusIcon,
  UploadCloudIcon,
  UserIcon,
  XIcon } from
'lucide-react';
import { DashboardShell, type NavItem } from '../components/DashboardShell';
import { useApp } from '../contexts/AppContext';
import { IMG } from '../data/images';
import { filterCategories, materials, purities } from '../data/categories';

const nav: NavItem[] = [
{ label: 'Overview', to: '/supplier/dashboard', icon: LayoutDashboardIcon },
{ label: 'My Catalogue', to: '/supplier/dashboard?tab=catalogue', icon: BoxesIcon },
{ label: 'Add Product', to: '/supplier/add-product', icon: PlusIcon },
{ label: 'Bulk Upload', to: '/supplier/add-product', icon: UploadCloudIcon },
{ label: 'Quote Requests', to: '/supplier/dashboard?tab=quotes', icon: FileTextIcon },
{ label: 'Orders', to: '/orders', icon: PackageIcon },
{ label: 'Analytics', to: '/supplier/dashboard?tab=analytics', icon: BarChart3Icon },
{ label: 'Profile', to: '/supplier/dashboard?tab=profile', icon: UserIcon }];


const startingImages = [IMG.goldNecklace, IMG.bridalSet, IMG.temple];

export function AddProduct() {
  const { notify } = useApp();
  const [images, setImages] = useState<string[]>(startingImages);
  const [dragging, setDragging] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const publish = (draft: boolean) => {
    if (!draft && !name.trim()) {
      setError('Product name is required before publishing.');
      return;
    }
    setError('');
    notify(draft ? 'Saved as draft' : 'Product published to your catalogue');
  };

  return (
    <DashboardShell
      eyebrow="Supplier portal · Rajmandir Jewels"
      title="Add Product"
      subtitle="Publish a design to 12,000+ verified retailers across India."
      nav={nav}
      actions={
      <Link to="/supplier/dashboard" className="text-sm text-charcoal-muted hover:text-gold">
          Back to overview
        </Link>
      }>
      
      <form
        onSubmit={(e) => {
          e.preventDefault();
          publish(false);
        }}
        className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        
        <div className="space-y-6">
          <Section title="Product Images" hint="First image becomes the catalogue thumbnail.">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                setImages((prev) => [...prev, IMG.diamondRing]);
                notify('1 image added');
              }}
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors duration-150 ease-luxe ${
              dragging ? 'border-gold bg-gold-wash' : 'border-line bg-ivory'}`
              }>
              
              <ImagePlusIcon className="h-6 w-6 text-gold" />
              <p className="mt-3 text-sm font-medium text-charcoal">
                Drag & drop product images or video
              </p>
              <p className="mt-1 text-xs text-charcoal-muted">
                JPG or PNG up to 8 MB · front, side, close-up and model shots
              </p>
              <button
                type="button"
                onClick={() => {
                  setImages((prev) => [...prev, IMG.jhumka]);
                  notify('1 image added');
                }}
                className="mt-5 rounded-full border border-charcoal px-5 py-2.5 text-xs font-semibold text-charcoal transition-colors duration-150 ease-luxe hover:bg-charcoal hover:text-white">
                
                Browse files
              </button>
            </div>

            {images.length > 0 &&
            <ul className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
                {images.map((img, i) =>
              <li key={img + i} className="group relative overflow-hidden rounded-lg border border-line">
                    <img src={img} alt="" className="aspect-square w-full object-cover" />
                    <button
                  type="button"
                  onClick={() => setImages(images.filter((_, x) => x !== i))}
                  aria-label="Remove image"
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/95 text-charcoal-muted opacity-0 transition-opacity duration-150 ease-luxe hover:text-red-600 group-hover:opacity-100">
                  
                      <XIcon className="h-3.5 w-3.5" />
                    </button>
                  </li>
              )}
              </ul>
            }
          </Section>

          <Section title="Basic Details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Product Name">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rajwadi Antique Bridal Choker"
                  className={input} />
                
              </Field>
              <Field label="Product ID">
                <input defaultValue="KYJ-103228" className={input} />
              </Field>
              <Field label="Category">
                <select className={input} defaultValue="Necklace">
                  {filterCategories.map((c) =>
                  <option key={c}>{c}</option>
                  )}
                </select>
              </Field>
              <Field label="Subcategory">
                <input placeholder="Choker / Haaram / Collar" className={input} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Collection">
                  <input placeholder="Bridal Collection" className={input} />
                </Field>
              </div>
            </div>
          </Section>

          <Section title="Jewellery Details">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Metal">
                <select className={input}>
                  {materials.map((m) =>
                  <option key={m}>{m}</option>
                  )}
                </select>
              </Field>
              <Field label="Purity">
                <select className={input} defaultValue="22K">
                  {purities.map((p) =>
                  <option key={p}>{p}</option>
                  )}
                </select>
              </Field>
              <Field label="Gross Weight (g)">
                <input type="number" placeholder="68" className={input} />
              </Field>
              <Field label="Net Weight (g)">
                <input type="number" placeholder="62" className={input} />
              </Field>
              <Field label="Diamond Weight (ct)">
                <input type="number" step="0.01" placeholder="0.00" className={input} />
              </Field>
              <Field label="Size">
                <input placeholder="16 inch adjustable" className={input} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Stone Details">
                  <input placeholder="Kundan polki with ruby & emerald accents" className={input} />
                </Field>
              </div>
              <Field label="Length">
                <input placeholder="16 in" className={input} />
              </Field>
            </div>
          </Section>

          <Section title="Commercial Details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Availability">
                <select className={input}>
                  <option>Ready Stock</option>
                  <option>Made to Order</option>
                </select>
              </Field>
              <Field label="MOQ (pieces)">
                <input type="number" defaultValue={1} className={input} />
              </Field>
              <Field label="Manufacturing Time">
                <input placeholder="21–28 days" className={input} />
              </Field>
              <Field label="B2B Pricing Visibility">
                <select className={input}>
                  <option>Visible to verified retailers only</option>
                  <option>On quotation request</option>
                  <option>Hidden — negotiate directly</option>
                </select>
              </Field>
            </div>
          </Section>
        </div>

        <aside className="lg:sticky lg:top-[140px] lg:h-fit">
          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="font-display text-2xl text-charcoal">Catalogue preview</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-line">
              <img
                src={images[0] ?? IMG.goldNecklace}
                alt=""
                className="aspect-square w-full object-cover" />
              
              <div className="p-4">
                <p className="text-[11px] text-charcoal-faint">KYJ-103228</p>
                <p className="mt-1 font-display text-lg text-charcoal">
                  {name || 'Untitled design'}
                </p>
                <p className="mt-1 text-xs text-charcoal-muted">Necklace · 22K · 62–74 g</p>
              </div>
            </div>

            {error &&
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
                {error}
              </p>
            }

            <button
              type="submit"
              className="mt-5 w-full rounded-full bg-charcoal px-5 py-3.5 text-sm font-medium text-white transition-colors duration-150 ease-luxe hover:bg-gold">
              
              Publish Product
            </button>
            <button
              type="button"
              onClick={() => publish(true)}
              className="mt-2 w-full rounded-full border border-line px-5 py-3.5 text-sm font-medium text-charcoal transition-colors duration-150 ease-luxe hover:border-gold">
              
              Save as Draft
            </button>
            <p className="mt-4 text-xs leading-relaxed text-charcoal-faint">
              Published designs are reviewed by 25Carat within 4 hours before going live to
              retailers.
            </p>
          </div>
        </aside>
      </form>
    </DashboardShell>);

}

const input =
'h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-charcoal outline-none transition-colors duration-150 ease-luxe focus:border-gold';

function Section({
  title,
  hint,
  children




}: {title: string;hint?: string;children: React.ReactNode;}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-6">
      <h2 className="font-display text-2xl text-charcoal">{title}</h2>
      {hint && <p className="mt-1 text-xs text-charcoal-muted">{hint}</p>}
      <div className="mt-5">{children}</div>
    </section>);

}

function Field({ label, children }: {label: string;children: React.ReactNode;}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-charcoal-muted">{label}</span>
      {children}
    </label>);

}