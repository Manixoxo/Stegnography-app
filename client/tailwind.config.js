/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { 
    extend: {
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(20deg)' },
          '75%': { transform: 'rotate(-10deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'box-appear': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '70%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'box-shake': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'rotate(-2deg)' },
          '20%, 40%, 60%, 80%': { transform: 'rotate(2deg)' },
        },
        'letter-float': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-20px)' },
        },
        'letter-open': {
          '0%': { transform: 'translateY(-20px) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.1)' },
          '100%': { transform: 'translateY(-20px) scale(1.2)' },
        },
        peek: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(-20deg) translateY(-5px)' },
        },
      },
      animation: {
        'wave': 'wave 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.5s ease-in',
        'box-appear': 'box-appear 0.5s forwards',
        'box-shake': 'box-shake 0.5s ease-in-out',
        'letter-float': 'letter-float 0.5s forwards',
        'letter-open': 'letter-open 0.5s forwards',
        'peek': 'peek 2s infinite',
      },
    },
  },
  plugins: [],
};