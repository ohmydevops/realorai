import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  publicDir: false,
  appType: 'mpa',
  server: { host: '127.0.0.1', port: 5174, strictPort: true },
  plugins: [
    {
      name: 'reload-static-files',
      // Classic scripts share globals; reload them together to preserve ordering.
      handleHotUpdate({ file, server }) {
        if (!file.endsWith('.css')) {
          server.ws.send({ type: 'full-reload', path: '*' });
          return [];
        }
      },
    },
  ],
});
