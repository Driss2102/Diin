/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Night palette */
        night: {
          900: '#050510',
          800: '#0A0A1A',
          700: '#0D1B4B',
          600: '#0F2060',
        },
        /* Day palette */
        day: {
          50:  '#FAFCFF',
          100: '#EEF6FF',
          200: '#DAF0FF',
          300: '#B8E0FA',
          700: '#0D1B3E',
        },
        /* Accents shared */
        gold: {
          DEFAULT: '#C9A84C',
          light:   '#FFD700',
          deep:    '#8B6F2A',
        },
        /* Joyful day accent — turquoise islamique */
        turquoise: {
          DEFAULT: '#4ECDC4',
          light:   '#7EDDD7',
          deep:    '#2BA8A0',
        },
        /* Text */
        pearl:  '#F5F0E8',
        slate:  '#A8B5C8',
        /* Moods */
        mood: {
          heureux:      '#FFD700',
          triste:       '#4A90D9',
          colere:       '#C0392B',
          effraye:      '#6C3483',
          reconnaissant:'#27AE60',
          solitaire:    '#5D6D7E',
          anxieux:      '#E67E22',
          espoir:       '#00CED1',
          pardon:       '#E8A0B4',
        },
      },
      fontFamily: {
        arabic:  ['Amiri', 'Scheherazade New', 'serif'],
        display: ['Cinzel Decorative', 'Cinzel', 'serif'],
        body:    ['Cormorant Garamond', 'EB Garamond', 'Georgia', 'serif'],
        mono:    ['DM Mono', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        chip:  '12px',
        card:  '24px',
        mood:  '20px',
        modal: '32px',
        pill:  '999px',
      },
      backdropBlur: {
        card: '24px',
        modal:'40px',
        nav:  '16px',
      },
      boxShadow: {
        'glow-gold-sm': '0 0 24px rgba(201,168,76,0.25)',
        'glow-gold-md': '0 0 60px rgba(201,168,76,0.30)',
        'glow-gold-lg': '0 0 120px rgba(255,215,0,0.20)',
        'glow-teal':    '0 0 60px rgba(78,205,196,0.30)',
        'card':         '0 24px 60px rgba(0,0,0,0.45)',
      },
      animation: {
        'float':        'float 4s ease-in-out infinite',
        'twinkle':      'twinkle 6s ease-in-out infinite',
        'drift-up':     'driftUp 16s linear infinite',
        'spin-slow':    'spin 8s linear infinite',
        'gradient-rot': 'gradientRot 6s linear infinite',
        'pulse-glow':   'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-16px)' },
        },
        twinkle: {
          '0%,100%': { opacity: '0.2', transform: 'scale(1)' },
          '50%':     { opacity: '1',   transform: 'scale(1.4)' },
        },
        driftUp: {
          '0%':   { transform: 'translateY(100vh) scale(0.5)', opacity: '0' },
          '10%':  { opacity: '1' },
          '90%':  { opacity: '0.6' },
          '100%': { transform: 'translateY(-10vh) scale(1)',   opacity: '0' },
        },
        gradientRot: {
          '0%':   { '--angle': '0deg'   },
          '100%': { '--angle': '360deg' },
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 24px rgba(201,168,76,0.25)' },
          '50%':     { boxShadow: '0 0 60px rgba(201,168,76,0.50)' },
        },
      },
    },
  },
  plugins: [],
}
