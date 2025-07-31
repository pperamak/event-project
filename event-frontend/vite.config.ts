import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow external access (e.g., from nginx)
    allowedHosts: ['frontend'], // Add your service name here
    port: 5173, // or whatever you're using
  }
})
