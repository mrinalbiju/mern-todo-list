import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Run the dev server on port 3000 — the only origin the backend's CORS allows
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
  },
})
