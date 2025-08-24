/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Use CSS variables for theme-aware colors
        'chemfetch-primary': '#2563eb',
        'chemfetch-primary-dark': '#1d4ed8',
        'chemfetch-secondary': '#64748b',
        'chemfetch-accent': '#06b6d4',
        'chemfetch-text-primary': 'rgb(var(--chemfetch-text-primary))',
        'chemfetch-text-secondary': 'rgb(var(--chemfetch-text-secondary))',
        'chemfetch-bg-primary': 'rgb(var(--chemfetch-bg-primary))',
        'chemfetch-bg-secondary': 'rgb(var(--chemfetch-bg-secondary))',
        'chemfetch-border': 'rgb(var(--chemfetch-border))',
        // Gradient colors from website
        'gradient-start': '#667eea',
        'gradient-end': '#764ba2',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif',
        ],
      },
      backgroundImage: {
        'chemfetch-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      boxShadow: {
        chemfetch: '0 4px 6px rgba(0, 0, 0, 0.05)',
        'chemfetch-lg': '0 12px 24px rgba(0, 0, 0, 0.1)',
        'chemfetch-dark': '0 4px 6px rgba(0, 0, 0, 0.3)',
        'chemfetch-lg-dark': '0 12px 24px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};
