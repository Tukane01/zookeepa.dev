import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualEditPlugin } from './vite-plugins/visual-edit-plugin.js'
import { errorOverlayPlugin } from './vite-plugins/error-overlay-plugin.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      mode === 'development' && visualEditPlugin(),
      react(),
      errorOverlayPlugin(),
      {
        name: 'iframe-hmr',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            // Allow iframe embedding
            res.setHeader('X-Frame-Options', 'ALLOWALL');
            res.setHeader('Content-Security-Policy', "frame-ancestors *;");
            next();
          });
        }
      }
    ].filter(Boolean),
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // Treat import errors as fatal errors
          if (
            warning.code === "UNRESOLVED_IMPORT" ||
            warning.code === "MISSING_EXPORT"
          ) {
            throw new Error(`Build failed: ${warning.message}`);
          }
          // Use default for other warnings
          warn(warning);
        },
      },
    },
    server: {
      host: '127.0.0.1', // Bind to localhost only
      port: 5174,
      strictPort: true,
      // Allow all hosts - essential for Modal tunnel URLs
      allowedHosts: true,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5000', // Proxies to Express Backend
          changeOrigin: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, req, res) => {
              console.error(`Proxy error connecting to backend on ${req.url}: ${err.message}`);
              if (res && res.writeHead) {
                res.writeHead(502, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Backend server is not running or unreachable.' }));
              }
            });
          }
        }
      },
      watch: {
        // Enable polling for better file change detection in containers
        usePolling: true,
        interval: 100, // Check every 100ms for responsive HMR
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    }
  }
});