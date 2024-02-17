import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        ultrawide: "2560px",
      },
      container: {
        screens: {
          ultrawide: "2048px",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
