/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f3fbf7",
          100: "#d7f4e4",
          200: "#afe9cb",
          300: "#7fd7aa",
          400: "#3fb67b",
          500: "#1f9c62",
          600: "#13794d",
          700: "#115f3e",
          800: "#124c33",
          900: "#103f2c",
        },
      },
      boxShadow: {
        glass: "0 20px 45px rgba(15, 23, 42, 0.18)",
      },
      backgroundImage: {
        "mesh-light":
          "radial-gradient(circle at top left, rgba(31, 156, 98, 0.18), transparent 30%), radial-gradient(circle at top right, rgba(56, 189, 248, 0.18), transparent 35%), linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
        "mesh-dark":
          "radial-gradient(circle at top left, rgba(34, 197, 94, 0.24), transparent 28%), radial-gradient(circle at top right, rgba(14, 165, 233, 0.18), transparent 32%), linear-gradient(180deg, #020617 0%, #0f172a 100%)",
      },
    },
  },
  plugins: [],
}
