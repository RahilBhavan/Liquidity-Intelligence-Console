/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#111",
        surface: "#fafafa",
        border: "rgba(17, 17, 17, 0.1)",
        muted: "rgba(17, 17, 17, 0.6)",
        "muted-light": "rgba(17, 17, 17, 0.5)",
      },
    },
  },
  plugins: [],
};
