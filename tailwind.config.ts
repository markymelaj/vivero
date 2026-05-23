import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette extracted from Paesaggio's catalog cover + Instagram
        forest: {
          50:  "#F2F5EC",
          100: "#E0EAD0",
          200: "#C8DCA0",  // light lime accent — from catalog cover bg
          300: "#A8C275",
          400: "#7FA34D",
          500: "#5C8A3C",  // mid green — wave on catalog cover
          600: "#3F6829",
          700: "#2D4A1F",  // primary brand green
          800: "#1F3815",  // logo/text dark
          900: "#142810",
        },
        bone:  "#F8F6F0",
        sand:  "#EEE9DA",
        ink:   "#1A1A1A",
        clay:  "#B8694A",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans:  ["var(--font-instrument)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      animation: {
        "fade-up":  "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in":  "fade-in 0.5s ease-out both",
        "scale-in": "scale-in 0.4s cubic-bezier(0.16,1,0.3,1) both",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
