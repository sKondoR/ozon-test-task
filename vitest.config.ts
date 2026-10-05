import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  // Алиасы (@/*) берутся из paths в tsconfig.json
  resolve: {
    tsconfigPaths: true,
  },
})
