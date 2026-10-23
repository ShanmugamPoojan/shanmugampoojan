import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this project from /shanmugampoojan/.
  base: '/shanmugampoojan/',
  plugins: [react()],
  build: { target: 'es2020', sourcemap: false },
})
