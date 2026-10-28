import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckIcon, ChevronLeftIcon } from 'lucide-react';
import { orderStages, orders } from '../data/collections';
import { productById } from '../data/products';
import { supplierById } from '../data/suppliers';
import { statusTone } from './Orders';

export function OrderDetail() {
  const { id } = useParams();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="mx-auto max-w-site px-5 py-32 text-center lg:px-10">
        <h1 className="font-display text-4xl text-charcoal">Order not found</h1>
        <Link
          to="/orders"
          className="mt-8 inline-block rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white hover:bg-gold">
          
          Back to orders
        </Link>
      </div>);

  }

  const product = productById(order.productId);
  const supplier = supplierById(order.supplierId);

  return (
    <div className="mx-auto max-w-site px-5 py-10 lg:px-10">
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-sm text-charcoal-muted hover:text-gold">
        
        <ChevronLeftIcon className="h-4 w-4" />
        All orders
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-line bg-white p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-gold">{order.id}</p>
              <h1 className="mt-2 font-display text-4xl text-charcoal">{product?.name}</h1>
              <p className="mt-2 text-sm text-charcoal-muted">
                {supplier?.name} · {supplier?.city} · Qty {order.quantity}
              </p>
            </div>
            <span className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${statusTone[order.status]}`}>
              {order.status}
            </span>
          </div>

          <div className="mt-7 flex gap-5">
            {product &&
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-36 w-36 rounded-xl object-cover" />

            }
            <dl className="grid flex-1 grid-cols-2 gap-4 text-sm">
              {[
              ['Product ID', order.productId],
              ['Order value', order.value],
              ['Placed on', order.placed],
              ['Estimated delivery', order.eta],
              ['Purity', product?.purity ?? '—'],
              ['Availability', product?.availability ?? '—']].
              map(([k, v]) =>
              <div key={k}>
                  <dt className="text-xs text-charcoal-faint">{k}</dt>
                  <dd className="mt-0.5 text-charcoal">{v}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-7">
          <h2 className="font-display text-2xl text-charcoal">Production timeline</h2>
          <ol className="mt-6 space-y-0">
            {orderStages.map((stage, i) => {
              const done = i <= order.stageIndex;
              const current = i === order.stageIndex;
              return (
                <li key={stage} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] ${
                      done ?
                      'border-gold bg-gold text-white' :
                      'border-line bg-white text-charcoal-faint'}`
                      }>
                      
                      {done ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    {i < orderStages.length - 1 &&
                    <span
                      className={`w-px flex-1 ${i < order.stageIndex ? 'bg-gold' : 'bg-line'}`} />

                    }
                  </div>
                  <div className="pb-7">
                    <p
                      className={`text-sm ${
                      current ? 'font-medium text-charcoal' : done ? 'text-charcoal-soft' : 'text-charcoal-faint'}`
                      }>
                      
                      {stage}
                    </p>
                    {current &&
                    <p className="mt-0.5 text-xs text-gold">Current stage · updated today</p>
                    }
                  </div>
                </li>);

            })}
          </ol>
        </div>
      </div>
    </div>);

}