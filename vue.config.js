// https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/1885#issuecomment-1316735840
const crypto = require('crypto')

/**
 * md4 algorithm is not available anymore in NodeJS 17+ (because of lib SSL 3).
 * In that case, silently replace md4 by md5 algorithm.
 */
try {
  crypto.createHash('md4')
} catch (e) {
  console.warn('Crypto "md4" is not supported anymore by this Node version')
  const origCreateHash = crypto.createHash
  crypto.createHash = (alg, opts) => {
    return origCreateHash(alg === 'md4' ? 'md5' : alg, opts)
  }
}

module.exports = {
  configureWebpack: {
    target: 'electron-renderer',
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        productName: 'Miru',
        appId: 'net.ytakahashi.miru',
        copyright: 'Copyright © 2020 ytakahashi',
        mac: {
          icon: 'public/icon.icns',
        },
        win: {
          icon: 'public/icon.png',
        },
      },
    },
  },
}
