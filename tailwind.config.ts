import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
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
        
        // ==========================================
        // CONECTAPRO SEMANTIC COLOR TOKENS
        // ==========================================
        brand: {
          primary: "var(--brand-primary)",
          accent: "var(--brand-accent)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          inverse: "var(--text-inverse)",
        },
        bg: {
          base: "var(--bg-base)",
          surface: "var(--bg-surface)",
          elevated: "var(--bg-elevated)",
          dark: "var(--bg-dark)",
        },
        border: {
          default: "var(--border-default)",
          subtle: "var(--border-subtle)",
          strong: "var(--border-strong)",
        },
        status: {
          success: "var(--status-success)",
          warning: "var(--status-warning)",
          error: "var(--status-error)",
          info: "var(--status-info)",
        },

        // ==========================================
        // CONECTAPRO RAW PALETTE SCALES
        // ==========================================
        zinc: {
          // New design system raw tokens
          50: "var(--zinc-50)",
          100: "var(--zinc-100)",
          200: "var(--zinc-200)",
          300: "var(--zinc-300)",
          400: "var(--zinc-400)",
          500: "var(--zinc-500)",
          600: "var(--zinc-600)",
          700: "var(--zinc-700)",
          800: "var(--zinc-800)",
          900: "var(--zinc-900)",
          950: "var(--zinc-950)",
          // Legacy support colors
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
          // New design system raw tokens
          50: "var(--indigo-50)",
          100: "var(--indigo-100)",
          200: "var(--indigo-200)",
          300: "var(--indigo-300)",
          400: "var(--indigo-400)",
          500: "var(--indigo-500)",
          600: "var(--indigo-600)",
          700: "var(--indigo-700)",
          800: "var(--indigo-800)",
          900: "var(--indigo-900)",
          // Legacy support colors
          150: '#d4dcfe',
          450: '#6366f1',
          650: '#4f46e5',
          750: '#3730a3',
          850: '#1e1b4b',
        },
        rose: {
          // New design system raw tokens
          400: "var(--rose-400)",
          500: "var(--rose-500)",
          600: "var(--rose-600)",
          // Legacy support colors
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
        sans: ["var(--font-outfit)", "system-ui", "-apple-system", "sans-serif"],
      },
      // Spacing Scale (based on 4px base grid)
      spacing: {
        '0': '0px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      borderRadius: {
        'none': '0px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
      },
      zIndex: {
        'base': '0',
        'dropdown': '10',
        'sticky': '20',
        'overlay': '30',
        'modal': '40',
        'toast': '50',
        'tooltip': '60',
      },
      fontSize: {
        'xs': ['11px', { lineHeight: '1.2' }],
        'sm': ['12px', { lineHeight: '1.4' }],
        'base': ['14px', { lineHeight: '1.6' }],
        'md': ['16px', { lineHeight: '1.6' }],
        'lg': ['18px', { lineHeight: '1.6' }],
        'xl': ['20px', { lineHeight: '1.4' }],
        '2xl': ['24px', { lineHeight: '1.4' }],
        '3xl': ['30px', { lineHeight: '1.2' }],
        '4xl': ['36px', { lineHeight: '1.2' }],
      },
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'black': '900',
      },
      letterSpacing: {
        'tight': '-0.02em',
        'normal': '0',
        'wide': '0.02em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '400ms',
      },
      transitionTimingFunction: {
        'default': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
export default config;
