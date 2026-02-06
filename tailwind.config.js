/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: "#606c38", // Olive Leaf
        secondary: "#bc6c25", // Copper (Improved visibility)
        accent: "#bc6c25", // Copper
        neutral: "#fefae0", // Cornsilk
        highlight: "#dda15e", // Light Caramel
        "olive-leaf": "#606c38",
        "black-forest": "#283618",
        "cornsilk": "#fefae0",
        "light-caramel": "#dda15e",
        "copper": "#bc6c25",
        "background-light": "#fefae0", // Using Cornsilk as light background
        "background-dark": "#283618", // Using Black Forest as dark background
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
