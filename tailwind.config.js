export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        // Page backgrounds — deep black tones
        ivory: {
          DEFAULT: '#0A0908',
          deep: '#11100D',
          dark: '#1E1B16',
        },
        // Text tones — white family
        charcoal: {
          DEFAULT: '#FFFFFF',
          soft: '#EDE8DF',
          muted: '#C2BAAD',
          faint: '#8F877B',
        },
        // Raised surfaces (cards, panels, inputs)
        white: '#15130F',
        gold: {
          DEFAULT: '#C9A24D',
          light: '#E2C275',
          pale: '#5C4A26',
          wash: '#241D12',
        },
        line: '#2C2820',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.22em',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -12px rgba(0,0,0,0.6)',
        lift: '0 18px 44px -18px rgba(201,162,77,0.28)',
        panel: '0 24px 60px -24px rgba(0,0,0,0.85)',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      maxWidth: {
        site: '1440px',
      },
    },
  },
}
