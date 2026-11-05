/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#090B10',
        slateNight: '#121621',
        cardNight: '#171C2B',
      }
    },
  },
  plugins: [],
}
