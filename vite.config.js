import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path for the application
export default defineConfig({
  plugins: [react()],
  base: '/',
})
