module.exports = {
  purge: {
    content: ["./src/**/*.{html,ts}"],
  },
  darkmode: false,
  content: [],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      backgroundColor: ["disabled"],
      bgcolor: ["disabled"],
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
