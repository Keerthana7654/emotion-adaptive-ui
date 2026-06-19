// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/emotion-adaptive-ui/', // ← Change to '/' if using custom domain or Vercel
})
