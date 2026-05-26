import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@data': path.resolve(__dirname, './src/data'),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
      },
    },
  },
  preview: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2015',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - group by package
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react'
            }
            // Framer motion
            if (id.includes('framer-motion')) {
              return 'vendor-motion'
            }
            // React icons
            if (id.includes('react-icons')) {
              return 'vendor-icons'
            }
            // UI libraries (if any)
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'vendor-ui'
            }
            // Date libraries
            if (id.includes('date-fns')) {
              return 'vendor-date'
            }
            // Other utilities
            if (id.includes('axios') || id.includes('clsx') || id.includes('lodash') || id.includes('zustand') || id.includes('redux')) {
              return 'vendor-utils'
            }
            // Default for other node_modules
            return 'vendor'
          }
          
          // Page-based chunks for code splitting
          if (id.includes('/src/pages/')) {
            const pageName = id.split('/src/pages/')[1].split('/')[0]
            if (pageName && !['index', 'shared'].includes(pageName.toLowerCase())) {
              return `page-${pageName.toLowerCase()}`
            }
          }
          
          // Service chunks
          if (id.includes('/src/services/')) {
            return 'services'
          }
          
          // Components chunk for shared components
          if (id.includes('/src/components/')) {
            return 'components'
          }
          
          // Data chunk
          if (id.includes('/src/data/')) {
            return 'data'
          }
        },
        chunkFileNames: (chunkInfo) => {
          // Special naming for different chunk types
          if (chunkInfo.name.includes('vendor')) {
            return 'assets/js/vendor/[name]-[hash].js'
          }
          if (chunkInfo.name.includes('page-')) {
            return 'assets/js/pages/[name]-[hash].js'
          }
          if (chunkInfo.name === 'services' || chunkInfo.name === 'components' || chunkInfo.name === 'data') {
            return 'assets/js/shared/[name]-[hash].js'
          }
          return 'assets/js/[name]-[hash].js'
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const extType = info[info.length - 1]
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash].[ext]'
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash].[ext]'
          }
          if (/\.css$/.test(assetInfo.name)) {
            return 'assets/css/[name]-[hash].[ext]'
          }
          return 'assets/[ext]/[name]-[hash].[ext]'
        },
      },
    },
    chunkSizeWarningLimit: 1500, // Increased slightly for better warning management
    reportCompressedSize: true, // Show compressed sizes in build output
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'framer-motion', 
      'react-icons', 
      'axios',
      'date-fns',
      'clsx'
    ],
    exclude: [],
  },
  // Improve build performance
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})