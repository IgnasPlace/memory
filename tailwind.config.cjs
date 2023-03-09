/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '1/6': `${100/6}%`,
        '1/8': `${100/8}%`,
      },
      height: {
        '1/6': `${100/6}%`,
        '1/8': `${100/8}%`,
      },
      colors: {
        myPrimary: 'red',
        myGreen: '#29C58C',

      }
    },
  },
  plugins: [],
}
