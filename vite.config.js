import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    // Aggressive optimization for mobile
    target: 'es2015', // Better mobile browser support
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2, // Multiple passes for better compression
      },
      mangle: {
        safari10: true, // Better mobile Safari support
      },
    },
    rollupOptions: {
      output: {
        // Smaller chunks for mobile
        manualChunks: {
          // Core vendor libraries
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          
          // UI libraries
          'vendor-ui': ['lucide-react'],
          
          // Admin components (lazy load)
          'admin': [
            './src/components/Admin/AdminDashboard.jsx',
            './src/components/Admin/AdminLogin.jsx',
            './src/components/Admin/ProductManagement/ProductManagement.jsx',
            './src/components/Admin/OrderManagement/OrderManagement.jsx',
            './src/components/Admin/Analytics/Analytics.jsx',
            './src/components/Admin/Settings/Settings.jsx'
          ],
          
          // Product-related components
          'product': [
            './src/components/ProductDetail/ProductDetail.jsx',
            './src/components/Products/Products.jsx',
            './src/components/ProductSearch/ProductSearch.jsx'
          ],
          
          // Cart and checkout
          'checkout': [
            './src/components/Cart/Cart.jsx',
            './src/components/Checkout/Checkout.jsx',
            './src/components/Checkout/CheckoutForm.jsx'
          ],
          
          // User features
          'user': [
            './src/components/UserProfile/UserProfile.jsx',
            './src/components/UserOrders/UserOrders.jsx',
            './src/components/Wishlist/Wishlist.jsx',
            './src/components/TrackOrder/TrackOrder.jsx'
          ]
        },
        // Optimize chunk naming for caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId) {
            return `assets/[name]-[hash].js`
          }
          return `assets/chunk-[hash].js`
        },
        // Smaller asset threshold for mobile
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    // Smaller chunk size warning for mobile
    chunkSizeWarningLimit: 300, // 300KB chunks max
    
    // Enable source maps only in development
    sourcemap: false,
    
    // CSS code splitting for better mobile performance
    cssCodeSplit: true,
    
    // Aggressive asset inlining for small files
    assetsInlineLimit: 2048, // 2KB inline limit
  },
  
  // Development server optimization
  server: {
    hmr: {
      overlay: false, // Reduce mobile debugging overhead
    },
  },
  
  // Dependency optimization for mobile
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react'
    ],
    exclude: [
      // Exclude large dependencies that should be lazy loaded
      '@vitejs/plugin-react'
    ],
  },
  
  // Experimental features for better mobile performance
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'css') {
        return { relative: true }
      }
      return { relative: true }
    }
  }
})
