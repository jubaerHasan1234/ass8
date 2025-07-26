/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // tailwind.config.js
  theme: {
    extend: {
      keyframes: {
        slideDownFade: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUpFade: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-30px)" },
        },
      },
      animation: {
        "slide-down-fade": "slideDownFade 0.4s ease-out forwards",
        "slide-up-fade": "slideUpFade 0.4s ease-in forwards",
      },
    },
  },

  plugins: [require("tailwind-scrollbar")],
};
