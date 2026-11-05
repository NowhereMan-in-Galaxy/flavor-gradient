/** @type {import('tailwindcss').Config} */
// 色板：暖中性墨色 + 低饱和玉绿（闭眼点）+ 赭朱（慎点）+ 黄铜（交互强调）
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0D0F12',
        slateNight: '#14171C',
        cardNight: '#181B21',
        brass: '#C8A96E',
        slate: {
          50: '#F4F2EE', 100: '#E8E4DA', 200: '#D6D1C6', 300: '#BDB8AD', 400: '#9A958B', 500: '#7A766E',
          600: '#5C5953', 700: '#3A3936', 800: '#26272A', 900: '#1A1C20', 950: '#111317',
        },
        emerald: {
          100: '#E3EFE6', 200: '#CFE3D5', 300: '#A9CDB6', 400: '#86B79A', 500: '#6A9F80', 600: '#4F8166',
          700: '#3D6450', 800: '#2C4A3B', 900: '#1F3429', 950: '#13211A',
        },
        amber: {
          100: '#F6E3D8', 200: '#EECBB7', 300: '#E2A88C', 400: '#D4866A', 500: '#C06A4F', 600: '#A0543D',
          700: '#7E4231', 800: '#5C3125', 900: '#3F231B', 950: '#2A1712',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Noto Serif SC"', '"Songti SC"', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
