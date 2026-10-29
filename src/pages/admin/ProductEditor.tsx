import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ExternalLinkIcon, PlusIcon, Trash2Icon, XIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { DashboardShell, adminNav } from '../../components/DashboardShell';
import { ImageUploader, useCleanupUnsavedUploads, type UploadedImage } from '../../components/admin/ImageUploader';
import { ProductImageFallback } from '../../components/ProductCard';
import { ErrorNotice, Field, PageLoader, Panel, Spinner, inputClass, primaryButton, secondaryButton } from '../../components/ui';
import { useApp } from '../../contexts/AppContext';
import { availabilities, makes, metals, purities, styles } from '../../data/options';
import { api } from '../../lib/api';
import { formatPrice, formatWeight, friendlyError, slugify } from '../../lib/format';
import { qk, useCatalogue } from '../../lib/queries';
import type { Availability, Product, Spec } from '../../types';

interface FormState {
  name: string;
  sku: string;
  slug: string;
  description: string;
  categoryId: string;
  collectionId: string;
  style: string;
  metal: string;
  purity: string;
  weightMin: string;
  weightMax: string;
  make: string;
  grossWeight: string;
  stoneWeight: string;
  netWeight: string;
  quantity: string;
  stone: string;
  size: string;
  availability: Availability;
  price: string;
  showPrice: boolean;
  specifications: Spec[];
  isNew: boolean;
  isFeatured: boolean;
  isPublished: boolean;
}

const blank: FormState = {
  name: '',
  sku: '',
  slug: '',
  description: '',
  categoryId: '',
  collectionId: '',
  style: '',
  metal: 'Gold',
  purity: '22K',
  weightMin: '',
  weightMax: '',
  make: '',
  grossWeight: '',
  stoneWeight: '0',
  netWeight: '',
  quantity: '1',
  stone: '',
  size: '',
  availability: 'Ready Stock',
  price: '',
  showPrice: false,
  specifications: [{ label: 'Hallmark', value: 'BIS hallmarked (HUID)' }],
  isNew: true,
  isFeatured: false,
  isPublished: true
};

function fromProduct(p: Product): FormState {
  const num = (n: number | null) => (n === null ? '' : String(n));
  return {
    name: p.name,
    sku: p.sku,
    slug: p.slug,
    description: p.description,
    categoryId: p.categoryId ?? '',
    collectionId: p.collectionId ?? '',
    style: p.style,
    metal: p.metal,
    purity: p.purity,
    weightMin: num(p.weightMin),
    weightMax: num(p.weightMax),
    make: p.make,
    grossWeight: num(p.grossWeight),
    stoneWeight: num(p.stoneWeight),
    netWeight: num(p.netWeight),
    quantity: p.quantity === null ? '' : String(p.quantity),
    stone: p.stone,
    size: p.size,
    availability: p.availability,
    price: num(p.price),
    showPrice: p.showPrice,
    specifications: p.specifications,
    isNew: p.isNew,
    isFeatured: p.isFeatured,
    isPublished: p.isPublished
  };
}

/** Next SKU after the highest numeric SJ-xxxx in use. */
function suggestSku(products: Product[]) {
  const max = products.reduce((m, p) => {
    const n = Number(p.sku.replace(/^\D+/, ''));
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 1000);
  return `SJ-${max + 1}`;
}

export function ProductEditor() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { notify } = useApp();
  const { products, categories, collections, loading } = useCatalogue();
  const existing = useMemo(() => products.find((p) => p.id === id), [products, id]);
  const { sessionUploads, markSaved } = useCleanupUnsavedUploads();

  const [form, setForm] = useState<FormState>(blank);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [slugTouched, setSlugTouched] = useState(false);
  // Net weight follows gross − stone until the admin types their own value.
  const [netTouched, setNetTouched] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Initialise once the catalogue has loaded (or immediately for a new product).
  useEffect(() => {
    if (ready || loading) return;
    if (existing) {
      setForm(fromProduct(existing));
      setImages(existing.images.map((i) => ({ url: i.url, storagePath: i.storagePath })));
      setSlugTouched(true);
      setNetTouched(true);
      setReady(true);
    } else if (isNew) {
      setForm({ ...blank, sku: suggestSku(products) });
      setReady(true);
    }
  }, [ready, loading, existing, isNew, products]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));
  const text = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    set(k, e.target.value as never);

  const setWeight = (k: 'grossWeight' | 'stoneWeight', value: string) =>
    setForm((f) => {
      const next = { ...f, [k]: value };
      const gross = Number(next.grossWeight);
      const stoneWt = Number(next.stoneWeight || 0);
      if (!netTouched && next.grossWeight !== '' && !Number.isNaN(gross) && !Number.isNaN(stoneWt)) {
        next.netWeight = String(Math.max(0, Math.round((gross - stoneWt) * 1000) / 1000));
      }
      return next;
    });

  const onName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm((f) => ({
      ...f,
      name,
      slug: slugTouched ? f.slug : slugify(`${name} ${f.sku.replace(/^\D+/, '')}`)
    }));
  };

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!form.name.trim()) errs.push('Name is required.');
    if (!form.sku.trim()) errs.push('SKU is required.');
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(form.slug)) errs.push('URL slug may only contain lowercase letters, numbers and dashes.');
    // Required trade specifications
    if (!form.categoryId) errs.push('Choose a category.');
    if (!form.make.trim()) errs.push('Make is required.');
    const gross = Number(form.grossWeight);
    const stoneWt = Number(form.stoneWeight);
    const net = Number(form.netWeight);
    if (form.grossWeight === '' || Number.isNaN(gross) || gross <= 0) errs.push('Gross weight is required and must be more than 0.');
    if (form.stoneWeight === '' || Number.isNaN(stoneWt) || stoneWt < 0) errs.push('Stone weight is required (enter 0 if there are no stones).');
    else if (gross > 0 && stoneWt > gross) errs.push('Stone weight cannot exceed gross weight.');
    if (form.netWeight === '' || Number.isNaN(net) || net < 0) errs.push('Net weight is required.');
    else if (gross > 0 && net > gross) errs.push('Net weight cannot exceed gross weight.');
    if (form.quantity === '' || !Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 0) errs.push('Quantity must be a whole number (0 or more).');

    const wMin = form.weightMin === '' ? null : Number(form.weightMin);
    const wMax = form.weightMax === '' ? null : Number(form.weightMax);
    if ((wMin !== null && (Number.isNaN(wMin) || wMin < 0)) || (wMax !== null && (Number.isNaN(wMax) || wMax < 0))) {
      errs.push('Weights must be positive numbers.');
    } else if (wMin !== null && wMax !== null && wMin > wMax) errs.push('Minimum weight cannot exceed maximum weight.');
    if (form.price !== '' && (Number.isNaN(Number(form.price)) || Number(form.price) < 0)) errs.push('Price must be a positive number.');
    if (form.showPrice && form.price === '') errs.push('Enter a price, or turn off “Show price”.');
    if (form.isPublished && images.length === 0) errs.push('Add at least one photo before publishing (or save as a draft).');
    return errs;
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (errs.length) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setBusy(true);
    try {
      const saved = await api.saveProduct({
        id: existing?.id,
        name: form.name.trim(),
        sku: form.sku.trim().toUpperCase(),
        slug: form.slug,
        description: form.description.trim(),
        categoryId: form.categoryId || null,
        collectionId: form.collectionId || null,
        style: form.style.trim(),
        metal: form.metal,
        purity: form.purity,
        weightMin: form.weightMin === '' ? null : Number(form.weightMin),
        weightMax: form.weightMax === '' ? null : Number(form.weightMax),
        make: form.make.trim(),
        grossWeight: Number(form.grossWeight),
        stoneWeight: Number(form.stoneWeight),
        netWeight: Number(form.netWeight),
        quantity: Number(form.quantity),
        stone: form.stone.trim(),
        size: form.size.trim(),
        availability: form.availability,
        price: form.price === '' ? null : Number(form.price),
        showPrice: form.showPrice,
        specifications: form.specifications
          .map((s) => ({ label: s.label.trim(), value: s.value.trim() }))
          .filter((s) => s.label && s.value),
        isNew: form.isNew,
        isFeatured: form.isFeatured,
        isPublished: form.isPublished,
        images
      });
      markSaved(images.map((i) => i.storagePath));
      // Put the saved row in the cache right away so the edit page can open it.
      queryClient.setQueryData<Product[]>(qk.products, (old = []) => [saved, ...old.filter((p) => p.id !== saved.id)]);
      queryClient.invalidateQueries({ queryKey: qk.products });
      queryClient.invalidateQueries({ queryKey: qk.stats });
      notify(isNew ? `“${saved.name}” created` : 'Changes saved');
      if (isNew) navigate(`/admin/products/${saved.id}`, { replace: true });
    } catch (err) {
      setErrors([friendlyError(err)]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!existing || !window.confirm(`Delete “${existing.name}” permanently?`)) return;
    setBusy(true);
    try {
      await api.deleteProduct(existing.id);
      queryClient.invalidateQueries({ queryKey: qk.products });
      queryClient.invalidateQueries({ queryKey: qk.stats });
      notify('Product deleted', 'info');
      navigate('/admin/products');
    } catch (err) {
      setErrors([friendlyError(err)]);
      setBusy(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!isNew && !existing) {
    return (
      <DashboardShell eyebrow="Products" title="Product not found" nav={adminNav}>
        <Link to="/admin/products" className={secondaryButton}>
          Back to products
        </Link>
      </DashboardShell>
    );
  }

  if (!ready) return <PageLoader />;

  const preview = {
    price: form.price === '' ? null : Number(form.price),
    showPrice: form.showPrice,
    weightMin: form.weightMin === '' ? null : Number(form.weightMin),
    weightMax: form.weightMax === '' ? null : Number(form.weightMax),
    grossWeight: form.grossWeight === '' ? null : Number(form.grossWeight)
  };

  return (
    <DashboardShell
      eyebrow={isNew ? 'New product' : `Editing ${existing?.sku}`}
      title={isNew ? 'Add product' : existing!.name}
      nav={adminNav}
      fallback="/admin/products"
      actions={
        existing && (
          <Link to={`/product/${existing.slug}`} target="_blank" className={secondaryButton}>
            <ExternalLinkIcon className="h-4 w-4" /> View in store
          </Link>
        )
      }
    >
      <form onSubmit={save} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]" noValidate>
        <div className="space-y-6">
          {errors.length > 0 && (
            <div className="space-y-2">
              {errors.map((e) => (
                <ErrorNotice key={e} error={e} />
              ))}
            </div>
          )}

          <Panel title="Photos" hint="The first photo is the cover shown in listings. Use ★ to make any photo the cover.">
            <ImageUploader
              images={images}
              onChange={setImages}
              folder="products"
              sessionUploads={sessionUploads}
              onError={(m) => notify(m, 'error')}
            />
          </Panel>

          <Panel title="Basics">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Product name" className="sm:col-span-2">
                <input required value={form.name} onChange={onName} className={inputClass} placeholder="Rajwadi Antique Bridal Choker" />
              </Field>
              <Field label="SKU">
                <input required value={form.sku} onChange={text('sku')} className={inputClass} />
              </Field>
              <Field label="URL slug" hint={`/product/${form.slug || '…'}`}>
                <input
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set('slug', slugify(e.target.value));
                  }}
                  className={inputClass}
                />
              </Field>
              <Field label="Collection">
                <select value={form.collectionId} onChange={text('collectionId')} className={inputClass}>
                  <option value="">— None —</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Description" className="sm:col-span-2">
                <textarea rows={4} value={form.description} onChange={text('description')} className={`${inputClass} h-auto resize-y py-2.5`} />
              </Field>
            </div>
          </Panel>

          <Panel title="Product specifications" hint="Required for every product.">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Category" required>
                <select required value={form.categoryId} onChange={text('categoryId')} className={inputClass}>
                  <option value="">Choose…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Make" required>
                <input required list="make-options" value={form.make} onChange={text('make')} className={inputClass} placeholder="Handmade" />
                <datalist id="make-options">
                  {makes.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </Field>
              <Field label="Purity" required>
                <select required value={form.purity} onChange={text('purity')} className={inputClass}>
                  {purities.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </Field>
              <Field label="Gross weight (g)" required>
                <input
                  required
                  type="number"
                  step="0.001"
                  min={0}
                  inputMode="decimal"
                  value={form.grossWeight}
                  onChange={(e) => setWeight('grossWeight', e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Stone weight (g)" required>
                <input
                  required
                  type="number"
                  step="0.001"
                  min={0}
                  inputMode="decimal"
                  value={form.stoneWeight}
                  onChange={(e) => setWeight('stoneWeight', e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Net weight (g)" required hint={netTouched ? undefined : 'Gross − stone, edit if needed'}>
                <input
                  required
                  type="number"
                  step="0.001"
                  min={0}
                  inputMode="decimal"
                  value={form.netWeight}
                  onChange={(e) => {
                    setNetTouched(true);
                    set('netWeight', e.target.value);
                  }}
                  className={inputClass}
                />
              </Field>
              <Field label="Qty" required>
                <input required type="number" step="1" min={0} inputMode="numeric" value={form.quantity} onChange={text('quantity')} className={inputClass} />
              </Field>
              <fieldset className="sm:col-span-2">
                <legend className="mb-1.5 text-xs font-medium text-ink-2">
                  Trending<span className="text-danger" aria-hidden="true"> *</span>
                </legend>
                <div role="radiogroup" aria-label="Trending" className="grid h-12 grid-cols-2 gap-1 rounded-xl bg-surface-2 p-1">
                  {[true, false].map((v) => (
                    <button
                      key={String(v)}
                      type="button"
                      role="radio"
                      aria-checked={form.isFeatured === v}
                      onClick={() => set('isFeatured', v)}
                      className={`rounded-lg text-sm font-semibold ${form.isFeatured === v ? 'bg-surface text-ink shadow-card' : 'text-ink-3'}`}
                    >
                      {v ? 'Yes' : 'No'}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </Panel>

          <Panel title="More details" hint="Optional.">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Metal">
                <select value={form.metal} onChange={text('metal')} className={inputClass}>
                  {metals.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </Field>
              <Field label="Style">
                <input list="style-options" value={form.style} onChange={text('style')} className={inputClass} />
                <datalist id="style-options">
                  {styles.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </Field>
              <Field label="Availability">
                <select value={form.availability} onChange={text('availability')} className={inputClass}>
                  {availabilities.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </Field>
              <Field label="Weight from (g)" hint="Optional range for made-to-order pieces">
                <input type="number" step="0.001" min={0} inputMode="decimal" value={form.weightMin} onChange={text('weightMin')} className={inputClass} />
              </Field>
              <Field label="Weight to (g)">
                <input type="number" step="0.001" min={0} inputMode="decimal" value={form.weightMax} onChange={text('weightMax')} className={inputClass} />
              </Field>
              <Field label="Size / length">
                <input value={form.size} onChange={text('size')} className={inputClass} placeholder="16 inch adjustable" />
              </Field>
              <Field label="Stone details" className="sm:col-span-3">
                <input value={form.stone} onChange={text('stone')} className={inputClass} placeholder="Kundan polki with ruby & emerald accents" />
              </Field>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-xs font-medium text-ink-2">Additional specifications</p>
              <ul className="space-y-2">
                {form.specifications.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <input
                      value={s.label}
                      onChange={(e) =>
                        set('specifications', form.specifications.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))
                      }
                      placeholder="Label, e.g. Finish"
                      aria-label={`Specification ${i + 1} label`}
                      className={`${inputClass} w-2/5`}
                    />
                    <input
                      value={s.value}
                      onChange={(e) =>
                        set('specifications', form.specifications.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))
                      }
                      placeholder="Value, e.g. Antique matte"
                      aria-label={`Specification ${i + 1} value`}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => set('specifications', form.specifications.filter((_, j) => j !== i))}
                      aria-label={`Remove specification ${i + 1}`}
                      className="shrink-0 rounded-lg px-2 text-ink-3 hover:text-danger"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => set('specifications', [...form.specifications, { label: '', value: '' }])}
                className="mt-3 flex items-center gap-1.5 text-xs font-medium text-brand"
              >
                <PlusIcon className="h-3.5 w-3.5" /> Add specification
              </button>
            </div>
          </Panel>

          <Panel title="Pricing" hint="Gold prices change daily — most stores show “Price on request” and quote on enquiry.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Price (₹)">
                <input type="number" min={0} step="1" inputMode="numeric" value={form.price} onChange={text('price')} className={inputClass} />
              </Field>
              <Toggle label="Show price to customers" checked={form.showPrice} onChange={(v) => set('showPrice', v)} />
            </div>
          </Panel>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-[140px] lg:h-fit">
          <Panel title="Visibility">
            <div className="space-y-3">
              <Toggle label="Published (visible in store)" checked={form.isPublished} onChange={(v) => set('isPublished', v)} />
              <Toggle label="Mark as New Arrival" checked={form.isNew} onChange={(v) => set('isNew', v)} />
            </div>
            <button type="submit" disabled={busy} className={`mt-6 w-full ${primaryButton} py-3.5`}>
              {busy && <Spinner />}
              {isNew ? 'Create product' : 'Save changes'}
            </button>
            {existing && (
              <button
                type="button"
                onClick={remove}
                disabled={busy}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm text-ink-2 hover:text-danger"
              >
                <Trash2Icon className="h-4 w-4" /> Delete product
              </button>
            )}
          </Panel>

          <Panel title="Preview">
            <div className="overflow-hidden rounded-xl border border-line">
              {images[0] ? (
                <img src={images[0].url} alt="" className="aspect-square w-full object-cover" />
              ) : (
                <ProductImageFallback className="aspect-square w-full" />
              )}
              <div className="p-4">
                <p className="text-[11px] text-ink-3">{form.sku}</p>
                <p className="mt-1 font-display text-lg text-ink">{form.name || 'Product name'}</p>
                <p className="mt-1 text-xs text-ink-2">
                  {[categories.find((c) => c.id === form.categoryId)?.name, form.purity, formatWeight(preview)].filter(Boolean).join(' · ')}
                </p>
                <p className="mt-2 text-sm text-gold">{formatPrice(preview) ?? 'Price on request'}</p>
              </div>
            </div>
          </Panel>
        </aside>
      </form>
    </DashboardShell>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-line px-3 py-2.5 text-sm text-ink-2">
      {label}
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
    </label>
  );
}
