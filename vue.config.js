module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: process.env.NODE_ENV === 'production'
  ? '/recipe/'
  : '/'
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? '/recipe/'
  : '/'
}