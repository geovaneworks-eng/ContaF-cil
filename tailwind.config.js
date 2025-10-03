/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // A linha abaixo foi adicionada para forçar a invalidação do cache
      colors: {
        'cache-buster': '#000001',
      },
    },
  },
  plugins: [],
}