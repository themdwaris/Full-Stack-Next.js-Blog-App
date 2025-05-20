// tailwind.config.js
module.exports = {
  darkMode: 'class', // <-- IMPORTANT
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', // if you're using the App Router
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
