import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/views': path.resolve(__dirname, './src/views'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/constants': path.resolve(__dirname, './src/constants'),
      '@/assets': path.resolve(__dirname, './src/assets')
    }
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    // 代码分割策略
    rollupOptions: {
      output: {
        manualChunks: {
          // React 相关库
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Redux 相关
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
          // UI 组件库
          'vendor-ui': ['@nextui-org/react', 'framer-motion'],
          // 工具库
          'vendor-utils': ['axios', 'dayjs'],
          // Socket.io
          'vendor-socket': ['socket.io-client'],
          // 图标库
          'vendor-icons': ['lucide-react'],
        },
      },
    },
    // 提高 chunk 大小警告阈值（1MB）
    chunkSizeWarningLimit: 1000,
    // 生产环境移除 console
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 生成 sourcemap（可选，调试用）
    sourcemap: false,
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@nextui-org/react',
      '@reduxjs/toolkit',
      'react-redux',
    ],
  },
});
