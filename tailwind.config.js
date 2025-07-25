/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideDownFade: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeOutDown: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(30px)" },
        },
      },
      animation: {
        "slide-down-fade": "slideDownFade 0.5s ease-out forwards",
        "fade-out-down": "fadeOutDown 0.4s ease-in forwards",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
