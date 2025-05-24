import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  UserIcon, 
  HeartIcon, 
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Logo from '../../assets/logo.png';
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

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <img src={Logo} alt="PrinceVibe" className="logo-image" />
          <div className="logo-shimmer"></div>
          <div className="logo-particles">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="navbar-menu">
          <a href="#home" className="nav-link active">
            <span>Home</span>
            <div className="nav-indicator"></div>
          </a>
          <a href="#products" className="nav-link">
            <span>All Products</span>
            <div className="nav-indicator"></div>
          </a>
          <a href="#about" className="nav-link">
            <span>About Us</span>
            <div className="nav-indicator"></div>
          </a>
          <a href="#tracking" className="nav-link">
            <span>Order Tracking</span>
            <div className="nav-indicator"></div>
          </a>
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
          <a href="#home" className="mobile-nav-link">Home</a>
          <a href="#products" className="mobile-nav-link">All Products</a>
          <a href="#about" className="mobile-nav-link">About Us</a>
          <a href="#tracking" className="mobile-nav-link">Order Tracking</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 