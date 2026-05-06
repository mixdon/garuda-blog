import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        garuda: {
          primary: "#CC0000",
          "primary-content": "#ffffff",
          secondary: "#990000",
          "secondary-content": "#ffffff",
          accent: "#ff3333",
          "accent-content": "#ffffff",
          neutral: "#2a2a2a",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f5f5f5",
          "base-300": "#e8e8e8",
          "base-content": "#1a1a1a",
          info: "#3b82f6",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
    ],
  },
};

export default config;