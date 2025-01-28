import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0834ce',
        secondary: '#fafae8',
        link: '#0caadc',
        placeholder: '#a9a9a9',
        danger: 'rgb(231, 59, 59)',
        inactive: '#969696',
        'placeholder-2': 'rgba(33, 37, 41, 0.75)',
        gray: '#f0f0f0',
        'gray-1': '#667085',
        'gray-2': '#E4E7EC',
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

