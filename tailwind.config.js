/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  // Ye saari files hain jinme Tailwind class names use hoti hain — course cards
  // js/*.js ke andar template strings se dynamically bante hain, isliye unhe bhi
  // scan karna zaroori hai warna unki classes production build mein purge ho jaayengi
  content: ["./index.html", "./privacy.html", "./offline.html", "./404.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        // privacy.html mein pehle ek chhota alag inline config tha jisme sirf
        // "brand" color tha — ab woh bhi isi shared config mein hai
        brand: "#1673e6",
        // Portfolio ke brand colors — inhe change karne se poori site ka theme update ho jaata hai
        blue: {
          50: "#eef6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#8fc4ff",
          400: "#5aa9ff",
          500: "#2f8cff",
          600: "#2f8cff",
          700: "#1673e6",
          800: "#1469d2",
          900: "#0f4f9e",
        },
        gray: {
          50: "#f8fafc",
          100: "#eef2f8",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#7c88a0",
          600: "#5b6a85",
          700: "#1e2740",
          800: "#0e1526",
          900: "#080c15",
          950: "#05070d",
        },
      },
      boxShadow: {
        glow: "0 0 45px rgba(47, 140, 255, 0.18)",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
