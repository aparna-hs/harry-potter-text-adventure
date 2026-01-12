/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Courier New', 'Courier', 'monospace'],
      },
      colors: {
        'terminal-bg': '#0a0a0a',
        'terminal-text': '#00ff00',
        'terminal-dim': '#008800',
        'damage': '#ff4444',
        'healing': '#44ff44',
        'magic': '#4488ff',
        'gold': '#ffd700',
      },
    },
  },
  plugins: [],
}
