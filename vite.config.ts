import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// Vite configuration
export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === 'development' && componentTagger()].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
    // Otimizações de produção
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    // Force rebuild to clear TypeScript cache
    emptyOutDir: true,
    // Aumentar limite de chunk warning
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '::',
    port: 8083,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Allow preview to accept requests for the deployed host used in debugging
  preview: {
    // Add hosts that are allowed to access the preview server
    allowedHosts: ['aifoodapp.site'],
  },
}));
