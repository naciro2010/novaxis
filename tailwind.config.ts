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
        float: 'float 8s ease-in-out infinite',
        grain: 'grain 8s steps(10) infinite',
        shimmer: 'shimmer 2.4s linear infinite',
        marquee: 'marquee 40s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        grain: {
          '0%,100%': { transform: 'translate(0,0)' },
          '10%': { transform: 'translate(-5%,-5%)' },
          '30%': { transform: 'translate(3%,-10%)' },
          '50%': { transform: 'translate(-10%,5%)' },
          '70%': { transform: 'translate(5%,10%)' },
          '90%': { transform: 'translate(-5%,-2%)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        pulseGlow: {
          '0%,100%': { opacity: '0.4' },
          '50%': { opacity: '1' }
        }
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        'radial-glow':
          'radial-gradient(ellipse at top, rgba(201,162,76,0.16), transparent 60%)',
        'aurora':
          'conic-gradient(from 180deg at 50% 50%, #9A7B30 0deg, #C9A24C 120deg, #E4C77E 240deg, #9A7B30 360deg)'
      }
    }
  },
  plugins: []
};

export default config;
