import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative paths make the build portable for a GitHub Pages repository.
  base: './',
  plugins: [react()],
})
