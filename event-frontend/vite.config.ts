import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { configDefaults } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow external access (e.g., from nginx)
    allowedHosts: ['frontend'], // Add your service name here
    port: 5173, // or whatever you're using
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    exclude: [...configDefaults.exclude, 'e2e/*'],
  },
})
