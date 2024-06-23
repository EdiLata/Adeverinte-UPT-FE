/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      screens: {
        xsm: '400px',
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
