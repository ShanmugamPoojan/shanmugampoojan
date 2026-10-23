import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the site from /<repo-name>/
  base: '/myportfolio/',
  plugins: [react()],
  build: { target: 'es2020', sourcemap: false },
})
