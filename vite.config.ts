import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Тут можуть бути ваші плагіни, наприклад: plugins: [react()]
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),      // Головний сайт
        admin: resolve(__dirname, 'public/admin/index.html') // Ваша адмінка
      }
    }
  }
});



