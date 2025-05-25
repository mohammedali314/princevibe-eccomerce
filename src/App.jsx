import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Categories from './components/Categories/Categories';
import Products from './components/Products/Products';
import Features from './components/Features/Features';
import Footer from './components/Footer/Footer';
import Loading from './components/Loading/Loading';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(false);

  // Show loading on initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Function to trigger loading animation (for logo clicks)
  const triggerLoading = () => {
    setShowLoading(true);
  };

  const handleLoadingComplete = () => {
    setShowLoading(false);
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

      {/* Main App Content */}
      <div className={`app-content ${isLoading ? 'hidden' : 'visible'}`}>
        <Navbar onLogoClick={triggerLoading} />
        <Hero />
        <Categories />
        <Products />
        <Features />
        <Footer onLogoClick={triggerLoading} />
      </div>
    </div>
  );
}

export default App;
