/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          DEFAULT: '#F59E0B',
        },
        dark: {
          DEFAULT: '#111827',
          950: '#030712',
          900: '#111827',
          800: '#1F2937',
          700: '#374151',
          600: '#4B5563',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(245, 158, 11, 0.5)',
      }
    },
  },
  plugins: [],
}
