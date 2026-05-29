/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: {
          50: '#fef3f2',
          100: '#fee5e3',
          200: '#fdd1cc',
          300: '#fbb4a9',
          400: '#f78870',
          500: '#f25a3c',
          600: '#d63c22',
          700: '#b32a1b',
          800: '#962318',
          900: '#7d1d16',
        },
        secondary: {
          50: '#f3f7fb',
          100: '#e6eff8',
          200: '#cde0f1',
          300: '#b5d0e9',
          400: '#8db0db',
          500: '#6590ce',
          600: '#4e70b4',
          700: '#41589a',
          800: '#354680',
          900: '#2b3866',
        },
        // Semantic colors
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'md-custom': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg-custom': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: theme('colors.primary.600'),
              },
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
