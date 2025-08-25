import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8082,
    headers: {
      'Vary': 'Origin, Accept-Encoding, Authorization',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    },
    // Add proxy configuration to handle cross-domain cookie issues
    proxy: {
      // Proxy API requests to backend
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log(`🔄 [Proxy] ${req.method} ${req.url} → ${proxyReq.getHeader('host')}${proxyReq.path}`);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            const cookies = proxyRes.headers['set-cookie'];
            if (cookies) {
              console.log(`🍪 [Proxy] Cookies set in response for ${req.url}: ${cookies.length} cookies`);
            }
          });
          proxy.on('error', (err, req) => {
            console.error(`❌ [Proxy] Error proxying ${req.url}:`, err);
          });
        }
      },
      // Proxy OAuth2 endpoints to backend
      '/oauth2': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log(`🔄 [Proxy OAuth2] ${req.method} ${req.url} → ${proxyReq.getHeader('host')}${proxyReq.path}`);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            const cookies = proxyRes.headers['set-cookie'];
            if (cookies) {
              console.log(`🍪 [Proxy OAuth2] Cookies set in response for ${req.url}: ${cookies.length} cookies`);
            }
          });
          proxy.on('error', (err, req) => {
            console.error(`❌ [Proxy OAuth2] Error proxying ${req.url}:`, err);
          });
        }
      },
      // Proxy login endpoints to backend
      '/login': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log(`🔄 [Proxy Login] ${req.method} ${req.url} → ${proxyReq.getHeader('host')}${proxyReq.path}`);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            const cookies = proxyRes.headers['set-cookie'];
            if (cookies) {
              console.log(`🍪 [Proxy Login] Cookies set in response for ${req.url}: ${cookies.length} cookies`);
            }
          });
          proxy.on('error', (err, req) => {
            console.error(`❌ [Proxy Login] Error proxying ${req.url}:`, err);
          });
        }
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    mode === 'production' && visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
    minify: 'esbuild',
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      '@tanstack/react-query',
    ],
    exclude: ['lovable-tagger'],
  },
}));