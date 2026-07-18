import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        panel: "#f8fafc",
        line: "#d8dee7",
        brand: "#0f766e",
        signal: "#be123c",
        amber: "#b45309"
      }
    }
  },
  plugins: []
} satisfies Config;

