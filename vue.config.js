module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/chsm/' : '/',
  devServer: {
    port: 1248,
    disableHostCheck: true
  },
  lintOnSave: false,
  outputDir: 'docs',
  assetsDir: './',
  publicPath: './'
}
