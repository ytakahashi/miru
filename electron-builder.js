// eslint-disable-next-line no-undef
module.exports = {
  productName: 'miru',
  appId: 'net.ytakahashi.miru',
  asar: true,
  directories: {
    buildResources: 'assets',
    output: 'dist_electron/${version}',
  },
  files: ['dist'],
  copyright: 'Copyright © 2020 ytakahashi',
  mac: {
    icon: 'public/icon.icns',
  },
}
