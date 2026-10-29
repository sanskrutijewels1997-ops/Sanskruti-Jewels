import { BRAND } from '../data/brand';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const img = size === 'lg' ? 'h-14 w-14' : size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  return (
    <span className="flex items-center gap-2">
      <img src={BRAND.logo} alt="" className={`${img} object-contain`} />
      <span className="flex flex-col leading-none">
        <span className={`font-display font-semibold tracking-tight text-ink ${size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-[22px]'}`}>
          Sanskruti
        </span>
        <span className="eyebrow mt-0.5 text-[8.5px] text-gold">Jewels</span>
      </span>
    </span>
  );
}

/** Seal-style "Since 1977" badge shown beside the logo. */
export function SinceBadge({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const box = size === 'sm' ? 'h-11 w-11' : 'h-12 w-12';
  return (
    <span
      className={`flex ${box} shrink-0 flex-col items-center justify-center rounded-full border-2 border-gold bg-gold-wash leading-none text-gold shadow-[inset_0_0_0_2px_rgb(var(--surface))]`}
      aria-label={`Since ${BRAND.since}`}
      role="img"
    >
      <span className="text-[7.5px] font-bold uppercase tracking-[0.18em]">Since</span>
      <span className="mt-0.5 font-display text-[15px] font-bold">{BRAND.since}</span>
    </span>
  );
}

/** Slim maroon strip carrying the slogan. */
export function BrandStrip({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-brand text-brand-on ${className}`}>
      <p className="flex h-8 items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em]">
        {BRAND.slogan.replace(/\.$/, '').split('. ').join(' · ')}
      </p>
    </div>
  );
}
