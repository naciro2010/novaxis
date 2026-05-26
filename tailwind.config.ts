import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        // Dark navy profond (identité Novaxium)
        ink: {
          950: '#05070D',
          900: '#090C15',
          800: '#0E121C',
          700: '#141926',
          600: '#1B2132',
          500: '#232A3D'
        },
        accent: {
          // Or / champagne / bronze : accent signature de Novaxium
          gold: '#C9A24C',
          champagne: '#E4C77E',
          bronze: '#9A7B30',
          // Émeraude conservée pour les états fonctionnels (conforme, sécurité, en ligne)
          emerald: '#10B981',
          // Rouge du drapeau marocain (souveraineté)
          rouge: '#C1272D'
        },
        bone: '#F5F5F7',
        ash: '#9A9AA6'
      },
      fontFamily: {
        display: ['var(--font-satoshi)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace']
      },
      letterSpacing: {
        tightest: '-0.04em',
        ultra: '-0.06em'
      },
      animation: {
        'spin-slow': 'spin 18s linear infinite',
        marquee: 'marquee 40s linear infinite'
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
