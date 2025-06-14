import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowRightIcon,
  HeartIcon,
  ShieldCheckIcon,
  TruckIcon,
  ClockIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import {
  FacebookIcon,
  InstagramIcon,
  YouTubeIcon,
  LinkedInIcon,
  TikTokIcon
} from './SocialIcons';
import CheckoutTutorial from '../CheckoutTutorial/CheckoutTutorial';
import AuthModal from '../Auth/AuthModal';
import './Footer.scss';

const Footer = ({ onLogoClick }) => {
  const [email, setEmail] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [openDropdowns, setOpenDropdowns] = useState({
    products: false,
    services: false,
    support: false
  });
  
  // New state for tutorial and auth
  const [showCheckoutTutorial, setShowCheckoutTutorial] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  // Enhanced scroll function for production environments
  const scrollToProducts = () => {
    const maxAttempts = 20; // Increased attempts for production
    let attempts = 0;
    
    const tryScroll = () => {
      const target = document.getElementById('products');
      if (target) {
        // Additional check to ensure element is actually visible
        const rect = target.getBoundingClientRect();
        if (rect.height > 0) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        return true;
        }
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(tryScroll, 300); // Increased timeout for production
      } else {
        console.warn('Could not find products section after', maxAttempts, 'attempts');
      }
      return false;
    };
    
    tryScroll();
  };

  // Enhanced navigation with better page load detection
  const handleProductsNavigation = () => {
    if (location.pathname === '/') {
      scrollToProducts();
    } else {
      navigate('/');
      
      // Wait for route change to complete and page to load
      const checkPageLoad = () => {
        if (document.readyState === 'complete') {
      setTimeout(() => {
        scrollToProducts();
          }, 500); // Extra delay for production environments
        } else {
          setTimeout(checkPageLoad, 100);
        }
      };
      
      setTimeout(checkPageLoad, 200);
    }
  };

  const handleCategoryNavigation = (category) => {
    if (location.pathname === '/') {
      // If we're already on homepage, navigate with category and scroll
      navigate(`/?category=${category}`);
      setTimeout(() => {
        scrollToProducts();
      }, 300); // Increased timeout for production
    } else {
      // If we're on a different page, navigate to home with category first
      navigate(`/?category=${category}`);
      
      // Wait for page to fully load before scrolling
      const waitForPageLoad = () => {
        if (document.readyState === 'complete') {
          setTimeout(() => {
            scrollToProducts();
          }, 800); // Increased timeout for production page loads
        } else {
          setTimeout(waitForPageLoad, 100);
        }
      };
      
      setTimeout(waitForPageLoad, 300);
    }
  };

  // Authentication handlers
  const handleAuthRequired = (action) => {
    if (isAuthenticated) {
      // Navigate to the requested page
      navigate(`/${action}`);
    } else {
      // Show login modal
      setAuthModalMode('login');
      setShowAuthModal(true);
    }
  };

  const handleCheckoutTutorial = () => {
    setShowCheckoutTutorial(true);
  };

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  const toggleDropdown = (section) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const currentYear = new Date().getFullYear();

  const footerSections = {
    products: {
      title: "Products",
      links: [
        { name: "All Watches", action: () => handleProductsNavigation(), type: "function" },
        { name: "Featured Watches", action: () => handleCategoryNavigation('featured'), type: "function" },
        { name: "Best Sellers", action: () => handleCategoryNavigation('popular'), type: "function" },
        { name: "New Arrivals", action: () => handleCategoryNavigation('new'), type: "function" },
        { name: "Smart Watches", action: () => handleCategoryNavigation('smart'), type: "function" },
        { name: "Luxury Collection", action: () => handleCategoryNavigation('luxury'), type: "function" }
      ]
    },
    services: {
      title: "Customer Service",
      links: [
        { name: "Contact Us", href: "/contact", type: "link" },
        { name: "Track Your Order", href: "/track-order", type: "link" },
        { name: "Help & Support", href: "/help", type: "link" },
        { name: "Customer Reviews", href: "/testimonials", type: "link" }
      ]
    },
    support: {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help", type: "link" },
        { name: "About PrinceVibe", href: "/about", type: "link" },
        { name: "FAQ & Support", href: "/help", type: "link" }
      ]
    },
    account: {
      title: "Account",
      links: [
        { name: "My Orders", action: () => handleAuthRequired('orders'), type: "function" },
        { name: "My Profile", action: () => handleAuthRequired('profile'), type: "function" },
        { name: "User Account", action: () => handleAuthRequired('profile'), type: "function" },
        { name: "Checkout Process", action: () => handleCheckoutTutorial(), type: "function" }
      ]
    }
  };

  const socialLinks = [
    { name: "Facebook", icon: FacebookIcon, href: "https://www.facebook.com/profile.php?id=61576899232165",},
    { name: "Instagram", icon: InstagramIcon, href: "https://www.instagram.com/princevibe_official/", },
    { name: "YouTube", icon: YouTubeIcon, href: "https://www.youtube.com/channel/UCxAd5CkpTkule-P7rgdevjQ", },
    { name: "TikTok", icon: TikTokIcon, href: "https://www.tiktok.com/@princevibe_official", }
  ];

  const paymentMethods = [
    { name: "Cash on Delivery", image: "/photos/cod-icon.png" }
  ];

  const certifications = [
    { name: "SSL Secured", icon: ShieldCheckIcon, description: "256-bit encryption" },
    { name: "Fast Delivery", icon: TruckIcon, description: "Shipping only in Pakistan" },
    { name: "24/7 Support", icon: ClockIcon, description: "Expert assistance" }
  ];

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "ja", name: "日本語", flag: "🇯🇵" }
  ];

  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <div className="brand-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                <img 
                  src="/logo.png" 
                  alt="PrinceVibe" 
                  className="logo-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML += '<span class="logo-text">PrinceVibe</span>';
                  }}
                />
              </div>
              <p className="brand-description">
                Crafting exceptional timepieces since 2020. PrinceVibe represents the pinnacle of 
                luxury, precision, and timeless elegance in watchmaking.
              </p>
              
              {/* Contact Information */}
              <div className="contact-info">
                <div className="contact-item">
                  <PhoneIcon />
                  <div>
                    {/* <strong>Phone </strong> */}
                    <span> +92 308 9747141 • +92 332 5122666</span>
                  </div>
                </div>
                <div className="contact-item">
                  <EnvelopeIcon />
                  <span>Princevibe.store@gmail.com</span>
                </div>
                <div className="contact-item">
                  <MapPinIcon />
                  <span>Butt Palaza, Near HBL Bank Karianwala, Gujrat</span>
                </div>
              </div>
            </div>

            {/* Footer Links with Dropdowns */}
            {Object.entries(footerSections).map(([key, section]) => (
              <div key={section.title} className="footer-section">
                <div 
                  className="section-header"
                  onClick={() => toggleDropdown(key)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleDropdown(key);
                    }
                  }}
                >
                  <h4 className="section-title">{section.title}</h4>
                  <div className="dropdown-icon">
                    {openDropdowns[key] ? (
                      <ChevronUpIcon />
                    ) : (
                      <ChevronDownIcon />
                    )}
                  </div>
                </div>
                <div className={`section-content ${openDropdowns[key] ? 'open' : ''}`}>
                  <ul className="section-links">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        {link.type === "function" ? (
                          <button 
                            onClick={link.action}
                            className="footer-link-button"
                          >
                            {link.name}
                          </button>
                        ) : (
                          <Link to={link.href}>{link.name}</Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Centered Social Media Section */}
          <div className="footer-social-center">
            <h4>Follow Us</h4>
            <div className="social-links">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a 
                    key={social.name} 
                    href={social.href} 
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${social.name} - ${social.followers} followers`}
                  >
                    <IconComponent />
                    <span className="social-tooltip">
                      {social.name} - {social.followers}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="bottom-content">
            {/* Payment Methods */}
            <div className="payment-methods">
              <span className="payment-label">Payment Method:</span>
              <div className="payment-icons">
                <div className="cod-display">
                  <span className="cod-icon">💰</span>
                  <span className="cod-text">Cash on Delivery</span>
                </div>
              </div>
            </div>

            {/* Language Selector */}
            <div className="language-selector">
              <GlobeAltIcon />
              <select 
                value={selectedLanguage} 
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="language-select"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Copyright and Legal */}
            <div className="legal-section">
              <div className="copyright">
                {/* <HeartIcon className="heart-icon" /> */}
                <span>© {currentYear} PrinceVibe. Crafted with love for timepiece enthusiasts.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Checkout Tutorial Modal */}
      <CheckoutTutorial 
        isOpen={showCheckoutTutorial}
        onClose={() => setShowCheckoutTutorial(false)}
      />
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authModalMode}
      />
    </footer>
  );
};

export default Footer; 