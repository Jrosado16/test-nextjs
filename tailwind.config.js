/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      background: "#E6F1EB",
      text: "#042F24",
      hover: "#8CDFB2",
      disabled: "#C5DBDC",
      cards: "#E1F0E8",
      fields: "#CFE7DA",
      frame: "#ACB5BD",
      alert: "#FFC702",
      loader:"#6C75753",
      bg2: '#d9eee3',
      line: '#C8DEDD',
      black: '#000000',
    },
    fontFamily: {
      alt: ["Poppins"],
    },
    extend: {
      fontFamily: {
        sans: ["Cabin"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
