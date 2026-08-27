/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Marca Huellitas
        primary: {
          50: '#E8EDFD',
          100: '#D1DBFB',
          200: '#A3B7F7',
          300: '#7593F3',
          400: '#476FEF',
          500: '#2448C5',
          600: '#1D3A9E',
          700: '#152B76',
          800: '#0E1D4F',
          900: '#070E27',
        },
        secondary: {
          50: '#F5FBE0',
          100: '#EBF7C1',
          200: '#D6F014',
          300: '#C4DC0E',
          400: '#B2C80A',
          500: '#9AB008',
          600: '#7D8E06',
          700: '#5F6C05',
          800: '#424A03',
          900: '#212502',
        },
        accent: {
          50: '#F3EAF6',
          100: '#E7D5ED',
          200: '#CFABDB',
          300: '#B781C9',
          400: '#9F57B7',
          500: '#813A8E',
          600: '#672E72',
          700: '#4D2255',
          800: '#341739',
          900: '#1A0B1C',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
