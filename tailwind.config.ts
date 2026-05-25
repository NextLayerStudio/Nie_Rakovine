import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Onko Klub brand palette
        brand: {
          purple: "#6F2380",
          "purple-soft": "#6F238066",
          pink: "#CA6A8A",
          "pink-soft": "#CA6A8ACC",
          white: "#FFFFFF",
        },
        // Convenience aliases
        primary: {
          DEFAULT: "#6F2380",
          soft: "#6F238066",
        },
        secondary: {
          DEFAULT: "#CA6A8A",
          soft: "#CA6A8ACC",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 18px -2px rgba(111, 35, 128, 0.18)",
        soft: "0 2px 10px rgba(202, 106, 138, 0.20)",
      },
      borderRadius: {
        pill: "9999px",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(180deg, #CA6A8A 0%, #B8557A 60%, #6F2380 100%)",
        "brand-gradient-soft":
          "linear-gradient(180deg, #CA6A8ACC 0%, #6F238066 100%)",
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
} satisfies Config;
