/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
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
        // Warzone theme colors
        'warzone-cyan': {
          DEFAULT: 'hsl(180 100% 50%)',
          glow: 'hsl(180 100% 60%)',
        },
        'warzone-green': {
          DEFAULT: 'hsl(120 100% 40%)',
          glow: 'hsl(120 100% 50%)',
        },
        'hud-gold': 'hsl(45 100% 60%)',
        'hud-silver': 'hsl(0 0% 85%)',
        'hud-bronze': 'hsl(25 100% 55%)',
        // Ice theme colors
        'ice-blue': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
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
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 5px hsl(180 100% 50%)" },
          "50%": { boxShadow: "0 0 20px hsl(180 100% 50%), 0 0 30px hsl(180 100% 50%)" },
        },
        "radar-sweep": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%) skewX(-20deg)" },
          "100%": { transform: "translateX(100%) skewX(-20deg)" }
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0) rotateZ(0deg)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-8px) rotateZ(-2deg)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(8px) rotateZ(2deg)" }
        },
        "live-pulse": {
          "0%, 100%": {
            borderColor: "rgba(34, 197, 94, 0.5)",
            boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)"
          },
          "50%": {
            borderColor: "rgba(34, 197, 94, 0.8)",
            boxShadow: "0 0 40px rgba(34, 197, 94, 0.6)"
          }
        },
        "demo-pulse": {
          "0%, 100%": {
            borderColor: "rgba(147, 51, 234, 0.5)",
            boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)"
          },
          "50%": {
            borderColor: "rgba(147, 51, 234, 0.8)",
            boxShadow: "0 0 40px rgba(147, 51, 234, 0.6)"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        "radar-sweep": "radar-sweep 4s linear infinite",
        "shimmer": "shimmer 2.5s infinite",
        "shake": "shake 0.6s ease-in-out",
        "live-pulse": "live-pulse 2s ease-in-out infinite",
        "demo-pulse": "demo-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
