import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // build: { outDir: '../backend/public', emptyOutDir: true },
    // define: {
    //   BACKEND_URL: JSON.stringify(env.BACKEND_URL),
    // },
    plugins: [react()],
    server: {
      hmr: true,
      port: 3001,
      host: true,
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
