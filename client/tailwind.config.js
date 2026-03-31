/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          light: '#d9f99d',
          DEFAULT: '#bef264',
          hover: '#d9f99d',
        },
      },
    },
  },
  plugins: [],
}
