/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Outfit"', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Brand color mapping
        brand: {
          dark: "#355872",   // Deep Blue
          medium: "#7AAACE", // Medium Blue
          light: "#9CD5FF",  // Light Blue
          cream: "#F7F8F0",  // Off-White / Cream
        },
        // Map original helper names to the new palette to seamlessly update existing styles
        gold: {
          DEFAULT: "#7AAACE", // Medium Blue instead of gold
          dim: "#7AAACE33",
          dark: "#355872",    // Deep Blue
        },
        cyan: {
          DEFAULT: "#9CD5FF", // Light Blue instead of cyan
          dim: "#9CD5FF22",
        },
        magenta: {
          DEFAULT: "#7AAACE",
        },
        deep: {
          black: "#F7F8F0",   // Cream background instead of deep black
          DEFAULT: "#F7F8F0",
        },
        warm: {
          black: "#FFFFFF",   // Pure white for card components
          DEFAULT: "#FFFFFF",
        },
        charcoal: "#E0E5E9",  // Muted grey-blue border/divider instead of charcoal
        soft: "#5A7285",      // Medium grey-blue text instead of soft gray
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "neon-gold": "0 0 20px #7AAACE33, 0 0 60px #7AAACE11",
        "neon-cyan": "0 0 15px #9CD5FF33",
        "card": "0 8px 32px rgba(53,88,114,0.08)",
        "deep": "0 20px 60px rgba(53,88,114,0.12)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "scroll-dot": {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "20%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { transform: "translateY(32px)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "scroll-dot": "scroll-dot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}