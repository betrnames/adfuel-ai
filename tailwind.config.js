/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF4ED',
          100: '#FFE6D5',
          200: '#FECCAA',
          300: '#FDAB74',
          400: '#FB8A3C',
          500: '#F97316',
          600: '#EA670C',
          700: '#C2570C',
          800: '#9A4512',
          900: '#7C3912',
        },
        navy: {
          50: '#E8EDF5',
          100: '#C5D0E6',
          200: '#9BAFD3',
          300: '#708EC0',
          400: '#4F74B1',
          500: '#2E5AA2',
          600: '#264B87',
          700: '#1D3A69',
          800: '#142A4C',
          900: '#0A1628',
          950: '#050B14',
        },
        accent: {
          50: '#E0FAFB',
          100: '#B3F3F5',
          200: '#80EBEF',
          300: '#4DE3E8',
          400: '#26DBE2',
          500: '#00C2CB',
          600: '#00A3AB',
          700: '#008088',
          800: '#005E64',
          900: '#003C40',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
