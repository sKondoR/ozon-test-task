module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  // На телефоне hover «залипает» после касания: подсветка остаётся на табе/карточке
  future: {
    hoverOnlyWhenSupported: true,
  },
}
