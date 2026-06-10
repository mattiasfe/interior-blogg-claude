import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cream: "#FBF9F6",
        sand: "#E8E4DF",
        wood: "#C8A97E",
        "wood-dark": "#B08D5F",
        sage: "#7D9B76",
        "sage-dark": "#637F5D",
        ink: "#33312E",
      },
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        serif: ["var(--font-heading)", "serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
