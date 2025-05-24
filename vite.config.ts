import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig(({ mode }) => {
  if (mode === 'production' && !process.env.VITEST && !process.env.TEST_ENV) {
    if (!process.env.CI && !process.env.MONITORING_DSN) {
      console.warn('Monitoring DSN is recommended in production')
    }
  }

  return {
    plugins: [
      vue(),
      vueDevTools(),
      visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
        filename: './dist/stats.json',
        template: 'raw-data',
      }),
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 1024,
        filter: (file) => file.includes('stats.json'),
        deleteOriginFile: false,
      }),
      viteStaticCopy({
        targets: [
          {
            src: 'public/dictionary.txt',
            dest: 'assets',
          },
        ],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      minify: 'terser',
      sourcemap: false,
      reportCompressedSize: true,
      chunkSizeWarningLimit: 500,
      cssCodeSplit: true,
      rollupOptions: {
        treeshake: {
          moduleSideEffects: false,
          tryCatchDeoptimization: true,
          unknownGlobalSideEffects: false,
          preset: 'recommended',
        },
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return 'vendor'
            }
            if (id.includes('src/lib')) {
              return 'utils'
            }
          },
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]',
        },
      },
    },
  }
})
