/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ed',
          100: '#fdedd3',
          200: '#fbd8a5',
          300: '#f8bd6d',
          400: '#f59e33',
          500: '#f2810c',
          600: '#e36607',
          700: '#bc4c0a',
          800: '#963d0f',
          900: '#79340f',
        },
      },
    },
  },
  plugins: [],
}
