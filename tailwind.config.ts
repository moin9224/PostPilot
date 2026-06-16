import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0077b5", // LinkedIn blue (primary)
          dark: "#005f8d",
        },
        action: {
          DEFAULT: "#3B82F6", // secondary / actions
          dark: "#2563EB",
        },
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        ink: "#1F2937", // dark text
        mist: "#F3F4F6", // light backgrounds
        edge: "#E5E7EB", // borders
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)",
        lift: "0 10px 30px -10px rgba(0,0,0,0.15)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
