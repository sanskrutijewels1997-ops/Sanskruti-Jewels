import { FolderHeartIcon, GemIcon, HeartIcon, MessageSquareIcon, RefreshCwIcon, ShieldCheckIcon } from 'lucide-react';

const reasons = [
  { icon: ShieldCheckIcon, title: 'Hallmarked & certified', text: 'Every gold piece is BIS hallmarked with HUID, and diamonds come with independent certification.' },
  { icon: GemIcon, title: 'Handcrafted heritage', text: 'Kundan, polki, temple and nakshi work by karigars who have practised their craft for generations.' },
  { icon: HeartIcon, title: 'Save your favourites', text: 'Tap the heart on any piece to keep it in your wishlist — on the web and in our app.' },
  { icon: FolderHeartIcon, title: 'Plan with lists', text: 'Make lists for a wedding, an anniversary or a gift, add notes, and come back any time.' },
  { icon: MessageSquareIcon, title: 'Enquire in one tap', text: "Ask for today's price, sizing or customisation and our team will call you back." },
  { icon: RefreshCwIcon, title: 'Lifetime exchange', text: 'Upgrade your jewellery whenever you like with our transparent exchange policy.' }
];

export function WhyUs() {
  return (
    <section id="why-us" className="border-t border-line bg-ivory-deep py-16 lg:py-20">
      <div className="mx-auto max-w-site px-5 lg:px-10">
        <div className="max-w-2xl">
          <p className="eyebrow text-gold">Why Sanskruti Jewels</p>
          <h2 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl">Crafted with care, chosen with ease</h2>
        </div>
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.title} className="border-t border-line pt-6">
              <r.icon className="h-5 w-5 text-gold" aria-hidden="true" />
              <h3 className="mt-4 font-display text-2xl text-charcoal">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
