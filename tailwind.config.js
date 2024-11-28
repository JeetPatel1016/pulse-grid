/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "glow-1": "0 0 15px -4px rgba(20, 184, 166, 0.85)",
        "glow-2": "0 0 15px 0 rgba(132, 204, 22, 0.85)",
      },
    },
  },
  plugins: [],
};
