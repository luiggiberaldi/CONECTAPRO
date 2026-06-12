import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        zinc: {
          150: '#ececec',
          250: '#d8d8dc',
          350: '#b2b2b9',
          450: '#80808a',
          550: '#5c5c64',
          650: '#45454b',
          750: '#333338',
          850: '#1f1f23',
        },
        indigo: {
          150: '#d4dcfe',
          450: '#6366f1',
          650: '#4f46e5',
          750: '#3730a3',
          850: '#1e1b4b',
        },
        rose: {
          250: '#fca5a5',
          450: '#f43f5e',
          650: '#be123c',
        },
        emerald: {
          250: '#6ee7b7',
          450: '#10b981',
          650: '#047857',
        },
        blue: {
          450: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
