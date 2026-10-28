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
