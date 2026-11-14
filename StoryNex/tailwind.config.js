/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0B0F',
        surface: {
          DEFAULT: '#15151C',
          secondary: '#1B1B24',
          tertiary: '#21212C',
        },
        border: {
          DEFAULT: '#252530',
          light: '#323242',
        },
        primary: {
          DEFAULT: '#A78BFA',
          strong: '#7C3AED',
          subtle: '#2E2248',
        },
        accent: {
          DEFAULT: '#67E8F9',
          muted: '#164E63',
        },
        text: {
          primary: '#F4F4F5',
          secondary: '#A1A1AA',
          muted: '#71717A',
        },
        status: {
          success: '#4ADE80',
          warning: '#FBBF24',
          error: '#F87171',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Manrope', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
