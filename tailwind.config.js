/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
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
        pink: {
          50: "#fff0f6",
          100: "#ffe4ed",
          200: "#ffc8db",
          300: "#ffa1c0",
          400: "#ff7aa2",
          500: "#ff5584",
          600: "#ff2d64",
          700: "#f01355",
          800: "#d70f4b",
          900: "#c00e44",
        },
        rose: {
          100: "#fce7f3",
          300: "#f9a8d4",
          500: "#ec4899",
        },
      },
      fontFamily: {
        sans: ['"Quicksand"', "sans-serif"],
      },
      borderRadius: {
        xl: "2rem",
        lg: "1.25rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      backgroundImage: {
        "roses-pattern": "url('/backgrounds/roses.png')",
        "hearts-pattern": "url('/backgrounds/hearts.png')",
        "gradient-soft": "linear-gradient(to bottom right, #fff0f6, #ffe4ed)",
      },
      boxShadow: {
        "btn-glow": "0 4px 15px rgba(255, 85, 132, 0.4)",
        "card-soft": "0 4px 20px rgba(255, 192, 203, 0.2)",
      },
      animation: {
        fade: "fadeIn 1.5s ease-out",
        pulse: "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
