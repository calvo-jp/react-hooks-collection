const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", ...defaultTheme.fontFamily.mono],
        sans: ["'Oxygen'", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        fadeOut: { from: { opacity: 1 }, to: { opacity: 0 } },
      },
      animation: {
        fadein: "fadeIn 250ms ease-in-out",
        fadeout: "fadeOut 250ms ease-in-out",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
