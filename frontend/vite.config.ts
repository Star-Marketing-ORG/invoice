import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@invoice/shared': path.resolve(__dirname, '../packages/shared'),
      '@invoice/shared/types': path.resolve(__dirname, '../packages/shared/types'),
    },
  },
})