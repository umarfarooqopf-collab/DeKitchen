import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#ff9f43",
          hover: "#f39c12",
          dark: "#e67e22",
          light: "#ffb169",
        },
        dark: {
          950: "#0b0b0e",
          900: "#14141c",
          850: "#171722",
          800: "#1b1b26",
          700: "#2a2a35",
          600: "#3d3d4e",
          500: "#55556a",
        },
        accent: {
          gold: "#ff9f43",
          red: "#ee5253",
          green: "#10b981",
          blue: "#3867d6",
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(255, 159, 67, 0.3)',
        'glow-lg': '0 0 35px -5px rgba(255, 159, 67, 0.5)',
      },
    },
  },
  plugins: [],
};

export default config;
