import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import { join } from 'path'

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  test: {
    include: ['tests/unit/**/*.spec.ts'],
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: [
      {
        find: /^@\//,
        replacement: join(__dirname, 'src/'),
      },
    ],
  },
})
