module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}", "./public/index.html"],
  safelist: [
    "container",
    "grid-list",
    "container-input",
    "input",
    "input-sm",
    "link",
    "arrow-button",
    "btn",
    "btn-link"
  ],
  theme: {
    extend: {
      colors: {
        lime: require("tailwindcss/colors").lime
      }
    }
  },
  plugins: []
};
