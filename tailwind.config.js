/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        finlandica: ['Finlandica', 'sans-serif'], // Define Finlandica font
      },
      colors: {
        "primary" : "rgb(21 128 61 / var(--tw-text-opacity, 1))",
        "secondary": "#0958d9",
        "warning": "#F59E0B",
        "danger": "#DC2626",
        "thirdly": "#8B5CF6"
      }
    },
  },
  plugins: [],
}