/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: "#D4AF37",
        secondary: "#F0C040",
        accent: "#D4AF37",
        neutral: "#111111",
        highlight: "#F0C040",
        "olive-leaf": "#D4AF37",
        "black-forest": "#000000",
        "cornsilk": "#111111",
        "light-caramel": "#F0C040",
        "copper": "#D4AF37",
        "background-light": "#000000",
        "background-dark": "#000000",
        "surface": "#111111",
        "surface-alt": "#161616",
        "surface-high": "#1c1c1c",
        "gold": "#D4AF37",
        "gold-light": "#F0C040",
        // Legacy aliases kept for compatibility
        "navy-surface": "#111111",
        "navy-lighter": "#161616",
      },
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
        display: ["Outfit", "sans-serif"],
        body: ["Outfit", "sans-serif"],
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'gold-sm': '0 0 15px rgba(212,175,55,0.15)',
        'gold': '0 0 25px rgba(212,175,55,0.2)',
        'gold-lg': '0 0 40px rgba(212,175,55,0.25)',
        'surface': '0 1px 3px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.3)',
        'surface-lg': '0 4px 6px rgba(0,0,0,0.6), 0 20px 60px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
