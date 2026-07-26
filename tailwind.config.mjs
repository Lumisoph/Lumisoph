import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#7EC8E3',
        'primary-dark': '#E9C46A',
        'bg-light': '#FFFAF5',
        'bg-dark': '#0D0F13',
        'card-light': '#FFFFFF',
        'card-dark': 'rgba(20, 22, 28, 0.85)',
        'text-light': '#2D1B1E',
        'text-dark': '#F5F0E1',
        accent: '#E76F51',
        'accent-dark': '#F38C79',
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
