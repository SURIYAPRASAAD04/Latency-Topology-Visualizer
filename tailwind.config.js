/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", /* neon-green-30 */
        input: "var(--color-input)", /* elevated-dark-gray */
        ring: "var(--color-ring)", /* neon-green */
        background: "var(--color-background)", /* near-black */
        foreground: "var(--color-foreground)", /* white */
        primary: {
          DEFAULT: "var(--color-primary)", /* neon-green */
          foreground: "var(--color-primary-foreground)", /* near-black */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* darker-green */
          foreground: "var(--color-secondary-foreground)", /* white */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* neon-pink-red */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* elevated-dark-gray */
          foreground: "var(--color-muted-foreground)", /* light-gray */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* cyan */
          foreground: "var(--color-accent-foreground)", /* near-black */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* elevated-dark-gray */
          foreground: "var(--color-popover-foreground)", /* white */
        },
        card: {
          DEFAULT: "var(--color-card)", /* elevated-dark-gray */
          foreground: "var(--color-card-foreground)", /* white */
        },
        success: {
          DEFAULT: "var(--color-success)", /* neon-green */
          foreground: "var(--color-success-foreground)", /* near-black */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* amber */
          foreground: "var(--color-warning-foreground)", /* near-black */
        },
        error: {
          DEFAULT: "var(--color-error)", /* neon-pink-red */
          foreground: "var(--color-error-foreground)", /* white */
        },
        // Cyberpunk specific colors
        'neon-green': '#00FF88', /* neon-green */
        'neon-green-dark': '#00CC6A', /* darker-green */
        'neon-cyan': '#00FFFF', /* cyan */
        'neon-pink': '#FF3366', /* neon-pink-red */
        'cyber-amber': '#FFB800', /* amber */
        'surface-elevated': '#2A2A2A', /* elevated-surface */
        'text-secondary': '#B3B3B3', /* light-gray */
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        'roboto-mono': ['Roboto Mono', 'monospace'],
        'jetbrains-mono': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        'sidebar': '280px',
        'sidebar-collapsed': '60px',
        'header': '60px',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 255, 136, 0.5)',
        'neon-sm': '0 0 10px rgba(0, 255, 136, 0.3)',
        'neon-lg': '0 0 30px rgba(0, 255, 136, 0.6)',
        'cyber': '0 4px 20px rgba(0, 0, 0, 0.5)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      animation: {
        'pulse-ambient': 'pulseAmbient 2s ease-in-out infinite',
        'data-flow': 'dataFlow 4s linear infinite',
        'shimmer': 'shimmer 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseAmbient: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        dataFlow: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 255, 136, 0.6)' },
        },
      },
      transitionDuration: {
        '150': '150ms',
        '300': '300ms',
        '500': '500ms',
      },
      transitionTimingFunction: {
        'cyber': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      zIndex: {
        'header': '1000',
        'sidebar': '900',
        'dropdown': '1100',
        'modal': '1200',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}