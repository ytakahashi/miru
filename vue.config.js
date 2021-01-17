module.exports = {
  configureWebpack: {
    target: 'electron-renderer'
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        productName: 'Miru',
        appId: 'net.ytakahashi.miru',
        copyright: 'Copyright © 2020 ytakahashi',
        mac: {
          icon: 'public/icon.icns'
        },
        win: {
          icon: 'public/icon.png'
        }
      }
    }
  }
}
