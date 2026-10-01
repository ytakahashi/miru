import { defineConfig, lazyPlugins } from 'vite-plus'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  fmt: {
    trailingComma: 'es5',
    semi: false,
    singleQuote: true,
    arrowParens: 'avoid',
    endOfLine: 'lf',
    printWidth: 100,
    sortPackageJson: false,
    ignorePatterns: [],
  },
  plugins: lazyPlugins(() => [vue()]),
  base: './',
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    include: ['tests/unit/**/*.spec.ts'],
    globals: true,
    environment: 'jsdom',
  },
})
