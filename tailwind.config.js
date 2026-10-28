// Colours are CSS variables (see src/index.css) so the app can follow the phone's
// light/dark setting. Names describe the role, not the colour.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'),
        surface: { DEFAULT: v('surface'), 2: v('surface-2'), 3: v('surface-3') },
        ink: { DEFAULT: v('ink'), 2: v('ink-2'), 3: v('ink-3') },
        line: v('line'),
        brand: { DEFAULT: v('brand'), on: v('on-brand'), soft: v('brand-soft') },
        gold: { DEFAULT: v('gold'), wash: v('gold-wash'), pale: v('gold-pale') },
        success: v('success'),
        danger: v('danger')
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      letterSpacing: { luxe: '0.18em' },
      boxShadow: {
        card: '0 1px 2px rgb(0 0 0 / 0.06), 0 4px 16px -8px rgb(0 0 0 / 0.12)',
        lift: '0 12px 32px -12px rgb(0 0 0 / 0.25)',
        sheet: '0 -8px 40px -12px rgb(0 0 0 / 0.35)',
        bar: '0 -1px 0 rgb(var(--line)), 0 -6px 20px -12px rgb(0 0 0 / 0.15)'
      },
      transitionTimingFunction: { luxe: 'cubic-bezier(0.23, 1, 0.32, 1)' },
      maxWidth: { site: '1280px' },
      spacing: { tabbar: '64px' }
    }
  }
};
