import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: "#fdf2f2",
          100: "#fce4e4",
          200: "#f9cccc",
          300: "#f2a3a3",
          400: "#e86e6e",
          500: "#d94444",
          600: "#b92c2c",
          700: "#9b1f1f",
          800: "#8B4513",
          900: "#6b340f",
        },
        cream: {
          50: "#FFFDF9",
          100: "#FFF9F0",
          200: "#F5E6D3",
          300: "#EDD5BB",
          400: "#E0C4A4",
          500: "#D4B38D",
          600: "#C09B6F",
          700: "#A67D55",
          800: "#8B6340",
          900: "#6B4A2D",
        },
        accent: {
          50: "#f0f9f3",
          100: "#d9f0e0",
          200: "#b3e1c1",
          300: "#7dcb96",
          400: "#4eb36e",
          500: "#2D5F3E",
          600: "#265a36",
          700: "#1e4a2c",
          800: "#1a3b24",
          900: "#142d1c",
        },
      },
    },
  },
  plugins: [],
};

export default config;
