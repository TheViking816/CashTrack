module.exports = {
  darkMode: 'class',
  content: ['./index.html', './App.tsx', './index.tsx', './components/**/*.{ts,tsx}', './pages/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#197fe6',
        'background-light': '#f6f7f8',
        'background-dark': '#111921',
        'card-light': '#ffffff',
        'card-dark': '#1e293b',
        'slate-850': '#1a222c',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        sans: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        glow: '0 4px 20px -2px rgba(25, 127, 230, 0.25)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/container-queries')],
};
