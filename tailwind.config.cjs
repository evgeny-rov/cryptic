/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-10deg)' },
          '50%': { transform: 'rotate(10deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.1s ease-in 3',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities, addVariant }) {
      addUtilities({
        '.gutter': {
          'scrollbar-gutter': 'stable',
        },
        '.gutter-both': {
          'scrollbar-gutter': 'stable both-edges',
        },
        '.gutter-auto': {
          'scrollbar-gutter': 'auto',
        },
      });
      addVariant('supports-gutter', '@supports (scrollbar-gutter: stable)');
    }),
  ],
};
