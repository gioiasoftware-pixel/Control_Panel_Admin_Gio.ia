/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        granaccia: '#9a182e',
        'off-white': '#fafafa',
        'light-gray': '#f5f5f5',
        border: '#e0e0e0',
        'text-primary': '#1a1a1a',
        'text-secondary': '#666666',
        'text-light': '#999999',
        'sidebar-bg': '#28374a',
        'sidebar-hover': '#34495e',
        'sidebar-active': '#f39c12',
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
