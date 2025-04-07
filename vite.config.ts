import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin()
  ],
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/icons-material',
      '@mui/x-date-pickers',
      '@mui/utils',
      '@mui/system',
      '@popperjs/core',
      'react-is',
      'react-transition-group',
      'stylis',
      'date-fns',
      'date-fns/locale/en-US'
    ]
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'firebase'
          ],
          'mui': [
            '@mui/material',
            '@mui/icons-material',
            '@mui/x-date-pickers'
          ],
          'utils': [
            'date-fns'
          ]
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    sourcemap: false,
    reportCompressedSize: false
  },
  server: {
    port: 4000,
    strictPort: false
  }
})
