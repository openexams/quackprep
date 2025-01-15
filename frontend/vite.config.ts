import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    // Uncomment if you need the build directory customization
    // build: { outDir: '../backend/public', emptyOutDir: true },
    // define: {
    //   BACKEND_URL: JSON.stringify(env.BACKEND_URL),
    // },
    plugins: [react()],
    server: {
      hmr: true,
      port: 3001,
      //host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        '@components': '/src/components',
        '@src': '/src',
        '@utils': '/src/utils',
      },
    },
  };
});
