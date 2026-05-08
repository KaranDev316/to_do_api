import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(),  tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
  server: {
    proxy: {
      '/todos': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
