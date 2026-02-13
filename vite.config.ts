import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { compression } from 'vite-plugin-compression2'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    compression({
      algorithms: ['gzip', 'brotliCompress'],
      threshold: 1024,
    }),
  ],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom')) return 'vendor-react-dom';
          if (id.includes('node_modules/react/')) return 'vendor-react';
          if (id.includes('node_modules/@tanstack/react-virtual')) return 'vendor-virtual';
          if (id.includes('node_modules/zustand')) return 'vendor-zustand';
          if (id.includes('node_modules/scheduler')) return 'vendor-react-dom';
        },
      },
    },
    chunkSizeWarningLimit: 500,
    sourcemap: false,
  },
  worker: {
    format: 'es',
  },
})
