/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b", 
        surface: "#18181b",    
        border: "#27272a",     
        primary: "#8b5cf6",    
        "primary-hover": "#7c3aed",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}