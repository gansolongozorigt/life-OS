/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Эйзенхауэрын 4 ангилал
        priority: {
          A: { bg: '#FEE2E2', border: '#DC2626', text: '#7F1D1D' }, // Улаан — Маш чухал
          B: { bg: '#FEF3C7', border: '#D97706', text: '#78350F' }, // Шар — Чухал
          C: { bg: '#DBEAFE', border: '#2563EB', text: '#1E3A8A' }, // Цэнхэр — Яаралтай
          D: { bg: '#F3F4F6', border: '#6B7280', text: '#374151' }, // Саарал — Чухал биш
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
