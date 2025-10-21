/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          800: "#18356e", // deep Masonic blue
          900: "#11254c",
        },
        secondary: {
          400: "#fbbf24", // gold accent
          500: "#f59e0b",
          600: "#d97706",
        },
        bronze: {
          400: "#b07a3e",
          500: "#9c6a2e",
          600: "#815824",
        },
      },
      fontFamily: {
        heading: ["'Playfair Display'", "serif"],
        body: ["'Open Sans'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0,0,0,0.08)",
        medium: "0 6px 20px rgba(0,0,0,0.12)",
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
