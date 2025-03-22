module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    'postcss-import': {},
    'postcss-nesting': {},
    'postcss-custom-properties': {
      preserve: false,
      importFrom: [
        {
          customProperties: {
            '--primary-color': '#0066ff',
            '--secondary-color': '#00cc99'
          }
        }
      ]
    }
  }
}