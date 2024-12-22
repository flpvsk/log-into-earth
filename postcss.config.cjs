const path = require('path')

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    require('autoprefixer'),
    require('postcss-mixins')({
      mixinsDir: path.join(__dirname, 'postcss-mixins'),
    })
  ]
}

module.exports = config
