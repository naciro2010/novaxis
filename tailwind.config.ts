import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        // Encre profonde — near-black à sous-ton violet/indigo (esprit Revolut, premium & sobre)
        ink: {
          950: '#050510',
          900: '#0A0A18',
          800: '#101023',
          700: '#17172E',
          600: '#20203A',
          500: '#2B2B48'
        },
        accent: {
          // Signature Novaxium : iris électrique → indigo → violet clair (dégradé premium type Revolut).
          // Les clés historiques (gold/champagne/bronze) sont conservées pour compatibilité,
          // mais repointées vers la nouvelle palette froide.
          gold: '#7C5CFF', // iris — accent primaire
          champagne: '#A78BFF', // violet clair — surbrillance
          bronze: '#5B4DE0', // indigo profond — fond de dégradé
          iris: '#7C5CFF',
          electric: '#4D7CFF', // bleu électrique
          violet: '#A78BFF',
          magenta: '#F45C9C', // rose magenta — pointe de dégradé
          // Émeraude conservée pour les états fonctionnels (conforme, sécurité, en ligne)
          emerald: '#34D399',
          // Rouge du drapeau marocain (souveraineté)
          rouge: '#C1272D'
        },
        // Palette fonctionnelle pour la data-viz et les états (distincte de l'iris décoratif).
        data: {
          blue: '#4D7CFF',
          sky: '#38BDF8',
          green: '#34D399',
          amber: '#F59E0B',
          rose: '#F45C9C',
          violet: '#A78BFF'
        },
        bone: '#F5F6FB',
        ash: '#9A9AB0'
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
      backgroundImage: {
        // Dégradé signature (esprit Revolut) — réutilisable partout.
        'brand-gradient': 'linear-gradient(120deg, #4D7CFF 0%, #7C5CFF 45%, #A78BFF 75%, #F45C9C 100%)',
        'brand-radial': 'radial-gradient(circle at 50% 0%, rgba(124,92,255,0.18), transparent 60%)'
      },
      animation: {
        'spin-slow': 'spin 18s linear infinite',
        marquee: 'marquee 40s linear infinite',
        // Animations type Revolut : dégradés en mouvement, lueurs flottantes, brillance.
        'gradient-pan': 'gradient-pan 7s ease infinite',
        'aurora-1': 'aurora-1 22s ease-in-out infinite',
        'aurora-2': 'aurora-2 28s ease-in-out infinite',
        float: 'float 9s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 5s ease-in-out infinite',
        shimmer: 'shimmer 2.6s linear infinite'
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        'gradient-pan': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' }
        },
        'aurora-1': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)', opacity: '0.55' },
          '50%': { transform: 'translate3d(6%,-4%,0) scale(1.18)', opacity: '0.8' }
        },
        'aurora-2': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1.05)', opacity: '0.45' },
          '50%': { transform: 'translate3d(-7%,5%,0) scale(0.9)', opacity: '0.7' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' }
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.08)' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(120%)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
