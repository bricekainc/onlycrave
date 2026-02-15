/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // This ensures dynamic routes like [competitor].tsx are scanned
    "./pages/alternatives/[competitor].tsx", 
  ],
  theme: {
    extend: {
      colors: {
        // Adding your brand color for easy use
        'crave-blue': '#0070f3',
      }
    },
  },
  plugins: [],
}
