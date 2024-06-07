import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  watch: {
    // Monitor all JavaScript and TypeScript files
    include: ['./src/*.js', './src/*.ts', './src/*.jsx', './src/*.tsx'],

    // Exclude specific folders like node_modules or cache
    exclude: ['node_modules', '.cache'],
  },
  server:{
    host: true,
    port: 5173,
  }
})
