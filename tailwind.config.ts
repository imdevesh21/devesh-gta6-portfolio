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
        vice: {
          pink: "#ff2a85",
          cyan: "#00f0ff",
          amber: "#ffb700",
          purple: "#7b00ff",
          dark: "#0c0119",
          card: "#140124",
          border: "rgba(255, 42, 133, 0.35)",
        },
      },
      boxShadow: {
        "neon-pink": "0 0 20px rgba(255, 42, 133, 0.5), inset 0 0 15px rgba(255, 42, 133, 0.2)",
        "neon-cyan": "0 0 20px rgba(0, 240, 255, 0.5), inset 0 0 15px rgba(0, 240, 255, 0.2)",
        "neon-amber": "0 0 20px rgba(255, 183, 0, 0.5), inset 0 0 15px rgba(255, 183, 0, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
