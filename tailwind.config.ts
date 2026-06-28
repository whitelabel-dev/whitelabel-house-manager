import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Whitelabel light-mode palette — matches whitelabel-3d viewer
        bg: "#fafaf9",
        panel: "#ffffff",
        text: "#18181b",
        muted: "#71717a",
        border: "#e4e4e7",
        accent: "#18181b",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
