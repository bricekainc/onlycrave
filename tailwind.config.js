/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Add this just in case
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Add this just in case
  ],
  theme: {
    extend: {
      colors: {
        'crave-blue': '#0070f3',
        'crave-pink': '#e33cc7',
        'crave-cyan': '#2ddfff',
      },
    },
  },
  plugins: [],
}
