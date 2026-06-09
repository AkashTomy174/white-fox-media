/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          primary: "#0D0D0D",
          surface: "#141414",
          elevated: "#1C1C1C",
          border: "#2A2A2A",
          accent: "#E8C547",
          accentHover: "#F0D060",
          text: "#F5F5F5",
          secondary: "#888888",
          muted: "#555555",
          danger: "#E05555",
          success: "#4CAF50",
        },
      },
    },
  },
  plugins: [],
};
