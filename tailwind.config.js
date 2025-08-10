/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './payload/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#EFFFFA',
        secondary: '#F5F7F7',
        Teal: '#00AA77',
        DarkTeal: '#009b6c',
        secondaryText: '#484848',
        Gray: '#C2C2C2',
      },
    },
  },
  plugins: [],
}
