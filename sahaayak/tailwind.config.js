/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#00f2ff",
          dark: "#00a3ad",
        },
        secondary: {
          DEFAULT: "#7000ff",
          dark: "#4b00ad",
        },
        accent: "#ff00d4",
      },
      backgroundImage: {
        "cyber-gradient": "linear-gradient(to bottom right, #0a0a0c, #1a1a2e)",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
      },
      backdropBlur: {
        xs: "2px",
      },
      fontFamily: {
        instrument: ["var(--font-instrument)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        kannada: ["var(--font-kannada)", "sans-serif"],
      },
    },
  },
  plugins: [],
};