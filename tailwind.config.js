/** @type {import('tailwindcss').Config} */
<<<<<<< HEAD
const config = {
=======
module.exports = {
>>>>>>> 16d30fa281451e16e822435995d12bdae5fd2001
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
<<<<<<< HEAD
=======
    "*.{js,ts,jsx,tsx,mdx}",
>>>>>>> 16d30fa281451e16e822435995d12bdae5fd2001
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
<<<<<<< HEAD
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

=======
        
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
>>>>>>> 16d30fa281451e16e822435995d12bdae5fd2001
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
<<<<<<< HEAD
=======
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
>>>>>>> 16d30fa281451e16e822435995d12bdae5fd2001
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
<<<<<<< HEAD
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
=======
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        pulse: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
>>>>>>> 16d30fa281451e16e822435995d12bdae5fd2001
      },
    },
  },
  plugins: [],
<<<<<<< HEAD
};

export default config;
=======
}
>>>>>>> 16d30fa281451e16e822435995d12bdae5fd2001
