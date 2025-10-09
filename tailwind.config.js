/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",       // Angular templates y TS
    "./node_modules/primeng/**/*.{mjs,js}" // Si usás clases de PrimeNG dinámicas
  ],
  theme: {
    extend: { },
  },
  plugins: [],
}
