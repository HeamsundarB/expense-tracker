import type { Config } from "tailwindcss";

const config: Config = {
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
        cyber: {
          neon: "#00F5FF",
          emerald: "#00D4AA",
          dark: "#030712",
          bg: "#050B14",
          blue: "#0A2540",
          glow: "rgba(0, 245, 255, 0.15)",
          red: "#FF3366",
        },
      },
      fontFamily: {
        cyber: ["var(--font-geist-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 245, 255, 0.35)",
        emerald: "0 0 20px rgba(0, 214, 170, 0.35)",
        red: "0 0 20px rgba(255, 51, 102, 0.35)",
        glass: "inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      animation: {
        "neon-pulse": "neon-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glitch-scan": "glitch-scan 8s linear infinite",
      },
      keyframes: {
        "neon-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(0.98)" },
        },
        "glitch-scan": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

