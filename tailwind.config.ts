import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05050A',
          900: '#0A0A0F',
          800: '#0F0F17',
          700: '#15151F',
          600: '#1C1C28',
          500: '#262633'
        },
        accent: {
          blue: '#3B82F6',
          violet: '#8B5CF6',
          emerald: '#10B981',
          rouge: '#C1272D'
        },
        bone: '#F5F5F7',
        ash: '#A1A1AA'
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
          'radial-gradient(ellipse at top, rgba(59,130,246,0.18), transparent 60%)',
        'aurora':
          'conic-gradient(from 180deg at 50% 50%, #3B82F6 0deg, #8B5CF6 120deg, #10B981 240deg, #3B82F6 360deg)'
      }
    }
  },
  plugins: []
};

export default config;
