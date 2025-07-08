import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initPerformanceOptimizations } from './utils/performance.js'

// Initialize performance optimizations
initPerformanceOptimizations();

// Use concurrent features for better performance
const root = ReactDOM.createRoot(document.getElementById('root'))

// Remove loading placeholder
const loadingElement = document.querySelector('.loading-container');
if (loadingElement) {
  loadingElement.remove();
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
