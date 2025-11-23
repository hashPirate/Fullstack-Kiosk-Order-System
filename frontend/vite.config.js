import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  
  return {
    plugins: [react()],
    build: {
      minify: !isDev,      // Don't minify in development
      cssMinify: !isDev,
    },
  };
})
