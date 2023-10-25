import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      'sans': ['Arial']
    }
  },
  plugins: [],
  important: "#remix-app",
  corePlugins: {
    preflight: false
  }
} satisfies Config;
