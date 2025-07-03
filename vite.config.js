import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    // Enable minification and optimization
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@heroicons/react'],
        },
      },
    },
    // Generate source maps for production
    sourcemap: true,
  },
  // Enable asset optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@heroicons/react'],
  },
  // Improve server performance
  server: {
    hmr: true,
    cors: true,
  },
})