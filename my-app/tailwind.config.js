/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#b297f0',
        secondary: '#b297f0',
        bg_primary: "#222222",
        text_secondary: "#0f0D23",
        light: {
          100: "#f5f5f5",
          200: "#e0e0e0",
          300: "#c6c6c6",
        },
        dark: {
          100: "#1d1d1d",
          200: "#000000",
          300: "#000000",
        },
      }
    },
  },
  plugins: [],
}