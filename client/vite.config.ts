import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // react(): lets Vite understand React/JSX code
  // tailwindcss(): turns Tailwind class names (like "p-4") into real CSS
  plugins: [react(), tailwindcss()],
  server: {
    // "Proxy": any request to /api/... is forwarded to our Express server on port 3001.
    // So React can simply call fetch('/api/summarize').
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
