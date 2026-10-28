import React, { useEffect, useState } from 'react';
import { CheckCircle2Icon, MessageCircleIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { BRAND } from '../data/brand';
import { api } from '../lib/api';
import { friendlyError } from '../lib/format';
import { Modal } from './Modal';
import { ErrorNotice, Field, Spinner, inputClass, primaryButton } from './ui';

const empty = { name: '', phone: '', email: '', size: '', quantity: '1', message: '' };

export function EnquiryModal() {
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
    <Modal open={enquiryOpen} onClose={closeEnquiry} label="Enquire" className="max-w-lg">
      <div className="p-6 sm:p-8">
        {sent ? (
          <div className="py-8 text-center">
            <CheckCircle2Icon className="mx-auto h-10 w-10 text-gold" />
            <h2 className="mt-4 font-display text-3xl text-charcoal">Thank you!</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-charcoal-muted">
              We've received your enquiry and will contact you on {form.phone} shortly.
            </p>
            <button type="button" onClick={closeEnquiry} className={`mt-7 ${primaryButton}`}>
              Continue browsing
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <p className="eyebrow text-gold">{product ? 'Enquire about' : 'Get in touch'}</p>
            <h2 className="mt-1 pr-10 font-display text-3xl leading-tight text-charcoal">
              {product?.name ?? 'How can we help?'}
            </h2>
            {product && <p className="mt-1 text-xs text-charcoal-faint">{product.sku}</p>}
            <p className="mt-3 text-sm text-charcoal-muted">
              Ask about today's price, availability, sizing or customisation.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Your name">
                <input required value={form.name} onChange={set('name')} className={inputClass} autoComplete="name" />
              </Field>
              <Field label="Phone">
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  className={inputClass}
                  autoComplete="tel"
                />
              </Field>
              <Field label="Email (optional)" className="sm:col-span-2">
                <input type="email" value={form.email} onChange={set('email')} className={inputClass} autoComplete="email" />
              </Field>
              {product && (
                <>
                  <Field label="Size">
                    <input value={form.size} onChange={set('size')} className={inputClass} />
                  </Field>
                  <Field label="Quantity">
                    <input type="number" min={1} value={form.quantity} onChange={set('quantity')} className={inputClass} />
                  </Field>
                </>
              )}
              <Field label="Message" className="sm:col-span-2">
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Occasion, budget, customisation…"
                  className={`${inputClass} h-auto resize-none py-2.5`}
                />
              </Field>
            </div>

            {error && (
              <div className="mt-4">
                <ErrorNotice error={error} />
              </div>
            )}

            <button type="submit" disabled={busy} className={`mt-6 w-full ${primaryButton}`}>
              {busy && <Spinner />}
              Send enquiry
            </button>
            {BRAND.whatsapp && (
              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=${whatsappText}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-charcoal-muted hover:text-gold"
              >
                <MessageCircleIcon className="h-4 w-4" /> Or chat with us on WhatsApp
              </a>
            )}
          </form>
        )}
      </div>
    </Modal>
  );
}
