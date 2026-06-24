import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'ds-h1':      ['40px', { lineHeight: '48px',   fontWeight: '700' }],
        'ds-h2':      ['28px', { lineHeight: '33.6px', fontWeight: '700' }],
        'ds-h3':      ['24px', { lineHeight: '31.2px', fontWeight: '700' }],
        'ds-h4':      ['20px', { lineHeight: '28px',   fontWeight: '600' }],
        'ds-h5':      ['18px', { lineHeight: '25.2px', fontWeight: '600' }],
        'ds-body-lg': ['18px', { lineHeight: '28.8px', fontWeight: '400' }],
        'ds-body':    ['16px', { lineHeight: '25.6px', fontWeight: '400' }],
        'ds-body-sm': ['14px', { lineHeight: '21px',   fontWeight: '400' }],
        'ds-label':   ['14px', { lineHeight: '19.6px', fontWeight: '500' }],
        'ds-button':  ['16px', { lineHeight: '25.6px', fontWeight: '600' }],
        'ds-caption': ['12px', { lineHeight: '16.8px', fontWeight: '400' }],
      },
      colors: {
        primary: '#0072ce',
        'primary-50': '#e6f4fd',
        'primary-100': '#c2ecff',
        'primary-600': '#005ba5',
        'primary-800': '#002d53',
        secondary: '#fafae8',
        link: '#0caadc',
        placeholder: '#a9a9a9',
        danger: 'rgb(231, 59, 59)',
        inactive: '#969696',
        'placeholder-2': 'rgba(33, 37, 41, 0.75)',
        gray: '#f0f0f0',
        'gray-1': '#667085',
        'gray-2': '#E4E7EC',
        surface: '#f2f2f2',
        border: '#dddddd',
        'text-body': '#0d0d0d',
        'text-subtle': '#4d4d4d',
        'text-muted': '#666666',
        'purple-brand': '#30385c',
        'ds-green-100': '#f2f9ef',
        'ds-green-300': '#d0e9c7',
        'ds-green-600': '#68b34b',
        'ds-red-100': '#fff5f5',
        'ds-red-300': '#ffd6d6',
        'ds-red-700': '#e67676',
        'ds-yellow-100': '#fffbf0',
        'ds-yellow-300': '#ffefc7',
        'ds-yellow-900': '#4d3c00',
        'ds-orange-100': '#fff8f3',
        'ds-orange-300': '#ffe2c7',
        'ds-orange-700': '#e68d32',
        'ds-orange-900': '#5c3613',
        'ds-green-500': '#b6dfa8',
        'ds-green-900': '#27481e',
        'ds-red-500': '#ffc1c1',
        'ds-red-900': '#5c2929',
        'ds-yellow-500': '#ffe290',
        'ds-orange-500': '#fbcb9b',
        'ds-neutral-50': '#fafafa',
        'ds-neutral-500': '#999999',
      },
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.hide-scrollbar': {
          '::-webkit-scrollbar': { display: 'none' },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
      });
    }),
  ],
};

