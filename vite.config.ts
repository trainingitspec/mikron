import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Наказуємо Vite розпізнавати "@" як шлях до папки "src"
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),       // Головний сайт
        admin: resolve(__dirname, 'public/admin/index.html') // Ваша адмінка
      }
    }
  }
});



