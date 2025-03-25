import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
  server: {
    port: 4000,
    strictPort: false
  }
})
