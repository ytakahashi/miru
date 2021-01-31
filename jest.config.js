module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transform: {
    '^.+\\.vue$': 'vue-jest'
  },
  modulePathIgnorePatterns: [
    '<rootDir>/build',
    '<rootDir>/dist_electron'
  ]
}
