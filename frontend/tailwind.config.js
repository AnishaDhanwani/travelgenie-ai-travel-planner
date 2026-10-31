/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0F172A',
          deep: '#1E293B',
          teal: '#0D9488',
          tealHover: '#0F766E',
          cyan: '#06B6D4',
          accent: '#F59E0B',
          card: '#FFFFFF',
          bg: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

