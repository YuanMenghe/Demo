/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('remark-') || id.includes('unified') || id.includes('micromark') || id.includes('mdast') || id.includes('unist')) {
            return 'markdown-core'
          }
          if (id.includes('turndown')) return 'html-markdown'
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.mts'],
  },
})

