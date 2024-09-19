const colors = require('tailwindcss/colors')

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        lime: colors.lime
      }
    }
  },
  plugins: []
};
