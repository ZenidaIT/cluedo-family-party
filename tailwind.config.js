/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Global Warmth: Alias slate to stone (Warm Grey)
        slate: require("tailwindcss/colors").stone,
        // Brand aliases
        primary: require("tailwindcss/colors").amber,
        secondary: require("tailwindcss/colors").orange,
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
