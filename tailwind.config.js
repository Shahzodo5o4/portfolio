/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  // These classes are built at runtime via string concatenation (e.g.
  // `hover:${accent}`), so Tailwind's scanner can't see them as literals.
  safelist: [
    "hover:text-slate-100",
    "hover:text-slate-900",
    "hover:text-cyan-400",
    "hover:text-cyan-600",
  ],
  theme: { extend: {} },
  plugins: [],
};
