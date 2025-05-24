import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  UserIcon, 
  HeartIcon, 
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import './Navbar.scss';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <img 
            src="/logo.png" 
            alt="PrinceVibe" 
            className="logo-image"
            onError={(e) => {
              // Fallback to text logo if image fails
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML += '<span style="color: white; font-weight: bold; font-size: 1.5rem;">PrinceVibe</span>';
            }}
          />
          {/* <div className="logo-shimmer"></div> */}
          <div className="logo-particles">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="navbar-menu">
          <div className="nav-link">
            <a href="#hero" onClick={(e) => handleSmoothScroll(e, 'hero')}>
              <span>Home</span>
            </a>
          </div>
          <div className="nav-link">
            <a href="#products" onClick={(e) => handleSmoothScroll(e, 'products')}>
              <span>All Products</span>
            </a>
          </div>
          <div className="nav-link">
            <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')}>
              <span>About Us</span>
            </a>
          </div>
          <div className="nav-link">
            <a href="#tracking" onClick={(e) => handleSmoothScroll(e, 'tracking')}>
              <span>Order Tracking</span>
            </a>
          </div>
        </div>

        {/* Action Icons */}
        <div className="navbar-actions">
          <button className="action-btn search-btn">
            <MagnifyingGlassIcon />
            <span className="tooltip">Search</span>
          </button>
          <button className="action-btn">
            <UserIcon />
            <span className="tooltip">Account</span>
          </button>
          <button className="action-btn wishlist-btn">
            <HeartIcon />
            <span className="badge">3</span>
            <span className="tooltip">Wishlist</span>
          </button>
          <button className="action-btn cart-btn">
            <ShoppingBagIcon />
            <span className="badge">2</span>
            <span className="tooltip">Cart</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <XMarkIcon /> : <Bars3Icon />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <a href="#hero" onClick={(e) => handleSmoothScroll(e, 'hero')} className="mobile-nav-link">Home</a>
          <a href="#products" onClick={(e) => handleSmoothScroll(e, 'products')} className="mobile-nav-link">All Products</a>
          <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')} className="mobile-nav-link">About Us</a>
          <a href="#tracking" onClick={(e) => handleSmoothScroll(e, 'tracking')} className="mobile-nav-link">Order Tracking</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;