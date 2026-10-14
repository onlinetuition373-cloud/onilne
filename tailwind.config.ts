import type { Config } from "tailwindcss";

// Brand palette: violet-indigo accent on white and light blue.
// Change a hex value here and it updates across the public site and the admin panel.
const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#5B43DD",
          50: "#F4F2FF",
          100: "#E8E4FF",
          200: "#D2C9FF",
          300: "#B1A3FF",
          400: "#8C79F8",
          500: "#6F58EE",
          600: "#5B43DD",
          700: "#4933B8",
          800: "#382890",
          900: "#271D63",
        },
        sky: {
          DEFAULT: "#EAF1FF",
          50: "#F5F8FF",
          100: "#EAF1FF",
          200: "#D6E4FF",
          300: "#B5CEFF",
          400: "#86ADF7",
          500: "#5486EA",
          600: "#3A6AD0",
        },
        ink: {
          DEFAULT: "#17143B",
          soft: "#3F3C66",
          muted: "#66638A",
        },
        line: "#E3E6F3",
        canvas: "#F7F9FF",
        success: { DEFAULT: "#15803D", soft: "#E8F7EE" },
        warning: { DEFAULT: "#B45309", soft: "#FEF3E2" },
        danger: { DEFAULT: "#C2410C", soft: "#FDECE6" },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 40px -20px rgba(55, 40, 144, 0.28)",
        card: "0 1px 2px rgba(23, 20, 59, 0.04), 0 8px 24px -12px rgba(23, 20, 59, 0.12)",
        ring: "0 0 0 1px rgba(91, 67, 221, 0.12)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -40px) scale(1.08)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
        },
        "slow-zoom": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "hero-progress": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "slide-in": "slide-in 0.25s ease-out both",
        blob: "blob 18s ease-in-out infinite",
        "slow-zoom": "slow-zoom 14s ease-out forwards",
        marquee: "marquee 32s linear infinite",
        "accordion-down": "accordion-down 0.3s ease-out",
        "hero-progress": "hero-progress 7s linear forwards",
        "accordion-up": "accordion-up 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
