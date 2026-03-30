import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
<<<<<<< HEAD
=======
    host: '127.0.0.1',
>>>>>>> c76f504 (updating changes)
    port: 5173,
    // Proxy API calls to the backend to avoid CORS issues during dev
    proxy: {
      '/api': {
<<<<<<< HEAD
        target: 'http://localhost:5000',
=======
        target: 'http://127.0.0.1:5000',
>>>>>>> c76f504 (updating changes)
        changeOrigin: true,
      },
    },
  },
})
