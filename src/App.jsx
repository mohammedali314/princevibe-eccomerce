import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Categories from './components/Categories/Categories';
import Products from './components/Products/Products';
import Features from './components/Features/Features';
import Footer from './components/Footer/Footer';
import ProductDetail from './components/ProductDetail/ProductDetail';
import Loading from './components/Loading/Loading';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminApi from './services/adminApi';
import './App.css';

// Home Page Component
const HomePage = ({ triggerLoading }) => (
  <>
    <Hero />
    <Categories />
    <Products />
    <Features />
  </>
);

// Protected Admin Route Component
const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = AdminApi.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// Main App Content Component (inside Router)
const AppContent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);

  // Show loading on initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Check for existing admin session
  useEffect(() => {
    if (AdminApi.isAuthenticated()) {
      setCurrentAdmin(AdminApi.getCurrentAdmin());
    }
  }, []);

  // Secret admin access trigger - Konami code sequence
  useEffect(() => {
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ];
    let userInput = [];
    let timeoutId;

    const handleKeyDown = (event) => {
      userInput.push(event.code);
      
      // Reset sequence after 3 seconds of inactivity
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        userInput = [];
      }, 3000);

      // Check if sequence matches
      if (userInput.length === konamiCode.length) {
        const isMatch = userInput.every((code, index) => code === konamiCode[index]);
        if (isMatch) {
          setShowAdminLogin(true);
          userInput = [];
        } else {
          // Keep last few inputs for partial matching
          userInput = userInput.slice(-5);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, []);

  // Alternative admin access via URL hash
  useEffect(() => {
    const checkAdminHash = () => {
      if (window.location.hash === '#admin-secret-access-2024') {
        setShowAdminLogin(true);
        // Clear the hash for security
        window.history.replaceState(null, null, window.location.pathname);
      }
    };

    checkAdminHash();
    window.addEventListener('hashchange', checkAdminHash);
    return () => window.removeEventListener('hashchange', checkAdminHash);
  }, []);

  // Function to trigger loading animation (for logo clicks)
  const triggerLoading = () => {
    setShowLoading(true);
  };

  const handleAdminLoginSuccess = (admin) => {
    setCurrentAdmin(admin);
    setShowAdminLogin(false);
    navigate('/admin');
  };

  const handleAdminLogout = () => {
    AdminApi.logout();
    setCurrentAdmin(null);
  };

  return (
      <div className="App">
        {/* Loading Animation */}
        <Loading 
          isVisible={isLoading || showLoading} 
          onComplete={() => {
            setIsLoading(false);
            setShowLoading(false);
          }} 
        />

      {/* Admin Login Modal */}
      <AdminLogin
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={handleAdminLoginSuccess}
        />

        {/* Main App Content */}
        <div className={`app-content ${isLoading ? 'hidden' : 'visible'}`}>
          <Routes>
          {/* Public Routes */}
            <Route 
              path="/" 
            element={
              <>
                <Navbar onLogoClick={triggerLoading} />
                <HomePage triggerLoading={triggerLoading} />
                <Footer onLogoClick={triggerLoading} />
              </>
            } 
            />
            <Route 
              path="/product/:id" 
            element={
              <>
                <Navbar onLogoClick={triggerLoading} />
                <ProductDetail />
                <Footer onLogoClick={triggerLoading} />
              </>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedAdminRoute>
                <AdminDashboard 
                  currentAdmin={currentAdmin}
                  onLogout={handleAdminLogout}
                />
              </ProtectedAdminRoute>
            } 
            />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </div>

      {/* Secret Admin Access Hint (only in development) */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '12px',
          fontFamily: 'monospace',
          zIndex: 1000
        }}>
          Admin: ↑↑↓↓←→←→BA or #admin-secret-access-2024
        </div>
      )} */}
      </div>
  );
};

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <AppContent />
    </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
