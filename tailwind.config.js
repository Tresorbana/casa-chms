/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: "#183d57", // Deep Navy Blue
        secondary: "#1a6e8e", // Ocean Teal
        accent: "#1a6e8e", // Ocean Teal
        neutral: "#f0f4f8", // Light Blue-Gray
        highlight: "#2e9ec9", // Sky Blue
        "olive-leaf": "#183d57", // Remapped to Deep Navy Blue
        "black-forest": "#0d2535", // Dark Navy
        "cornsilk": "#f0f4f8",
        "light-caramel": "#2e9ec9",
        "copper": "#1a6e8e",
        "background-light": "#f0f4f8", // Light Blue-Gray background
        "background-dark": "#0d2535", // Dark Navy background
      },
      fontFamily: {
        sans: ["Anaheim", "sans-serif"],
        display: ["Anaheim", "sans-serif"],
        body: ["Anaheim", "sans-serif"],
      },
    },
  },
  plugins: [],
}
