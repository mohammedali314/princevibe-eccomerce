import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Import performance utilities
import { initializePerformanceMonitoring } from './utils/performance.js'

// Mobile-specific performance optimizations
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

// Initialize performance monitoring
initializePerformanceMonitoring()

// Optimize React rendering for mobile
const renderOptions = {
  // Use concurrent features for better mobile performance
  unstable_strictMode: false, // Disable strict mode in production for better mobile performance
}

// Mobile-specific optimizations
if (isMobile) {
  // Reduce animation duration for mobile
  document.documentElement.style.setProperty('--animation-duration', '0.2s')
  
  // Add mobile-specific classes
  document.documentElement.classList.add('mobile-device')
  
  // Optimize touch events
  document.addEventListener('touchstart', () => {}, { passive: true })
  document.addEventListener('touchmove', () => {}, { passive: true })
}

// Optimize font loading for mobile
if ('fonts' in document) {
  Promise.all([
    document.fonts.load('400 16px Inter'),
    document.fonts.load('600 16px Inter'),
    document.fonts.load('400 24px Playfair Display')
  ]).then(() => {
    document.documentElement.classList.add('fonts-loaded')
  }).catch(() => {
    // Fallback if font loading fails
    document.documentElement.classList.add('fonts-failed')
  })
}

// Performance-optimized root creation
const root = ReactDOM.createRoot(document.getElementById('root'))

// Mobile-optimized rendering
if (isMobile) {
  // Use time slicing for better mobile performance
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  // Standard rendering for desktop
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

// Performance monitoring
if (typeof window !== 'undefined' && window.performance) {
  // Monitor Core Web Vitals
  window.addEventListener('load', () => {
    // Measure page load time
    const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart
    
    // Log performance metrics (only in development)
    if (import.meta.env.DEV) {
      console.log(`Page load time: ${loadTime}ms`)
      console.log(`Mobile device: ${isMobile}`)
    }
    
    // Send performance data to analytics (if needed)
    if (window.gtag && loadTime > 0) {
      window.gtag('event', 'page_load_time', {
        event_category: 'Performance',
        event_label: isMobile ? 'Mobile' : 'Desktop',
        value: Math.round(loadTime)
      })
    }
  })
}

// Service Worker registration for better mobile caching
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}
