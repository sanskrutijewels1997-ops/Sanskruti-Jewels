import React, { useEffect, useState } from 'react';
import { CheckCircle2Icon, MessageCircleIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { BRAND } from '../data/brand';
import { api } from '../lib/api';
import { friendlyError } from '../lib/format';
import { BottomSheet } from './BottomSheet';
import { ErrorNotice, Field, Spinner, inputClass, primaryButton } from './ui';

const empty = { name: '', phone: '', email: '', size: '', quantity: '1', message: '' };

export function EnquirySheet() {
  const { enquiryOpen, enquiryProduct: product, closeEnquiry } = useApp();
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!enquiryOpen) return;
    setSent(false);
    setError(null);
    setForm({
      ...empty,
      name: profile?.fullName ?? '',
      phone: profile?.phone ?? '',
      email: profile?.email ?? user?.email ?? '',
      size: product?.size ?? ''
    });
  }, [enquiryOpen, product, profile, user]);

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number so we can reach you.');
      return;
    }
    setBusy(true);
    try {
      await api.createEnquiry(user?.id ?? null, {
        productId: product?.id ?? null,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        size: form.size.trim(),
        quantity: Math.max(1, Number(form.quantity) || 1),
        message: form.message.trim()
      });
      setSent(true);
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  const whatsappText = encodeURIComponent(
    product ? `Hi, I'd like to know more about ${product.name} (${product.sku}).` : 'Hi, I have a question.'
  );

  return (
    <BottomSheet
      open={enquiryOpen}
      onClose={closeEnquiry}
      title={sent ? undefined : product ? 'Enquire about this piece' : 'Get in touch'}
      className="sm:max-w-lg"
      footer={
        !sent && (
          <>
            <button type="submit" form="enquiry-form" disabled={busy} className={`w-full ${primaryButton}`}>
              {busy && <Spinner />}
              Send enquiry
            </button>
            {BRAND.whatsapp && (
              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=${whatsappText}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex h-9 items-center justify-center gap-2 text-xs font-semibold text-ink-2"
              >
                <MessageCircleIcon className="h-4 w-4 text-success" /> Chat on WhatsApp instead
              </a>
            )}
          </>
        )
      }
    >
      {sent ? (
        <div className="px-6 py-10 text-center">
          <CheckCircle2Icon className="mx-auto h-12 w-12 text-success" />
          <h2 className="mt-4 font-display text-3xl font-semibold text-ink">Thank you!</h2>
          <p className="mx-auto mt-2 max-w-xs text-sm text-ink-2">
            We've received your enquiry and will contact you on {form.phone} shortly.
          </p>
          <button type="button" onClick={closeEnquiry} className={`mt-7 w-full max-w-xs ${primaryButton}`}>
            Done
          </button>
        </div>
      ) : (
        <form id="enquiry-form" onSubmit={submit} className="space-y-4 px-5 py-4">
          {product ? (
            <div className="flex items-center gap-3 rounded-xl bg-surface-2 p-2.5">
              {product.images[0] && <img src={product.images[0].url} alt="" className="h-14 w-14 rounded-lg object-cover" />}
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-medium text-ink">{product.name}</p>
                <p className="text-xs text-ink-3">{product.sku}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-2">Ask about a custom design, today's gold rate, or anything else.</p>
          )}
          <Field label="Your name">
            <input required value={form.name} onChange={set('name')} className={inputClass} autoComplete="name" />
          </Field>
          <Field label="Phone">
            <input required type="tel" inputMode="tel" value={form.phone} onChange={set('phone')} className={inputClass} autoComplete="tel" />
          </Field>
          <Field label="Email (optional)">
            <input type="email" inputMode="email" value={form.email} onChange={set('email')} className={inputClass} autoComplete="email" />
          </Field>
          {product && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Size">
                <input value={form.size} onChange={set('size')} className={inputClass} />
              </Field>
              <Field label="Quantity">
                <input type="number" inputMode="numeric" min={1} value={form.quantity} onChange={set('quantity')} className={inputClass} />
              </Field>
            </div>
          )}
          <Field label="Message">
            <textarea
              rows={3}
              value={form.message}
              onChange={set('message')}
              placeholder="Today's price, occasion, budget, customisation…"
              className={`${inputClass} h-auto resize-none py-3`}
            />
          </Field>
          {error && <ErrorNotice error={error} />}
        </form>
      )}
    </BottomSheet>
  );
}
