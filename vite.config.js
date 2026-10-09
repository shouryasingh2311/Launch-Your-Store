import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/auth': 'http://127.0.0.1:8000',
      '/stores': 'http://127.0.0.1:8000',
      '/categories': 'http://127.0.0.1:8000',
      '/products': 'http://127.0.0.1:8000',
      '/public': 'http://127.0.0.1:8000',
      '/orders': 'http://127.0.0.1:8000',
      '/dashboard': 'http://127.0.0.1:8000',
      '/team': 'http://127.0.0.1:8000',
      '/import': 'http://127.0.0.1:8000',
      '/chat': 'http://127.0.0.1:8000',
      '/ai': 'http://127.0.0.1:8000',
      '/health': 'http://127.0.0.1:8000',
      '/api': 'http://127.0.0.1:8000'
    }
  }
})
