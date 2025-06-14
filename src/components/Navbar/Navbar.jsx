import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  UserIcon, 
  HeartIcon, 
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  XCircleIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import ApiService from '../../services/api';
import Cart from '../Cart/Cart';
import Wishlist from '../Wishlist/Wishlist';
import AuthModal from '../Auth/AuthModal';
import UserMenu from '../Auth/UserMenu';
import './Navbar.scss';

const Navbar = ({ onLogoClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Authentication state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'signup'
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Search functionality state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches] = useState([
    'Rolex Submariner', 'Apple Watch', 'Omega Speedmaster', 
    'TAG Heuer', 'Casio G-Shock', 'Smart Watch', 'Luxury Watch'
  ]);

  // Refs for search functionality
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchModalRef = useRef(null);
  const debounceRef = useRef(null);
  const userButtonRef = useRef(null);

  // Get cart and wishlist context
  const { cartItemsCount } = useCart();
  const { wishlistItemsCount } = useWishlist();

  // Get authentication context
  const { isAuthenticated, user, logout } = useAuth();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading recent searches:', e);
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((query) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) return;

    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== trimmedQuery.toLowerCase());
      const updated = [trimmedQuery, ...filtered].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Debounced search function
  const performSearch = useCallback(async (query) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await ApiService.searchProducts(query.trim());
      const transformedResponse = ApiService.transformResponse(response);
      
      if (transformedResponse.success) {
        setSearchResults(transformedResponse.data.slice(0, 8)); // Limit to 8 results
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle search input change with debouncing
  const handleSearchChange = useCallback((e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounce
    debounceRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  }, [performSearch]);

  // Handle search submission
  const handleSearchSubmit = useCallback((query = searchQuery) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) return;

    saveRecentSearch(trimmedQuery);
    closeSearch();
    
    // Navigate to search results page or products page with search filter
    navigate(`/?search=${encodeURIComponent(trimmedQuery)}`);
  }, [searchQuery, saveRecentSearch, navigate]);

  // Handle product click
  const handleProductClick = useCallback((product) => {
    saveRecentSearch(searchQuery);
    closeSearch();
    navigate(`/product/${product.id}`);
  }, [searchQuery, saveRecentSearch, navigate]);

  // Handle search modal open/close
  const openSearch = () => {
    setIsSearchOpen(true);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Focus search input after modal opens
    setTimeout(() => {
      const searchInput = document.querySelector('.search-input');
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  // Handle click outside search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchModalRef.current && !searchModalRef.current.contains(event.target)) {
        closeSearch();
      }
    };

    const handleTouchOutside = (event) => {
      if (searchModalRef.current && !searchModalRef.current.contains(event.target)) {
        closeSearch();
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleTouchOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleTouchOutside);
      };
    }
  }, [isSearchOpen]);

  // Handle click outside mobile user dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close mobile user dropdown if clicking outside
      if (isMobileUserMenuOpen && !event.target.closest('.mobile-user-section')) {
        setIsMobileUserMenuOpen(false);
      }
    };

    if (isMobileUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [isMobileUserMenuOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Open search with Ctrl/Cmd + K
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        openSearch();
      }
      // Close search with Escape
      if (event.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, openSearch, closeSearch]);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  }, []);

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
      // If we're already on homepage, just scroll to products
      scrollToProducts();
    } else {
      // If we're on a different page, navigate to home first then scroll
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

  // New function to handle navigation to home (top of page)
  const handleHomeNavigation = () => {
    if (location.pathname === '/') {
      // If we're already on homepage, scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // If we're on a different page, navigate to home
      navigate('/');
    }
  };

  const handleLogoClick = () => {
    // Always scroll to top first for smooth UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // If we're not on the homepage, navigate to home
    if (location.pathname !== '/') {
      // Add a small delay to allow scroll to complete, then navigate
      setTimeout(() => {
      navigate('/');
      }, 100);
    }
    
    // Call the onLogoClick prop for loading animation
    if (onLogoClick) {
      onLogoClick();
    }
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
    setIsWishlistOpen(false); // Close wishlist if open
  };

  const handleWishlistClick = () => {
    setIsWishlistOpen(true);
    setIsCartOpen(false); // Close cart if open
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const closeWishlist = () => {
    setIsWishlistOpen(false);
  };

  // Authentication handlers
  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      setIsUserMenuOpen(!isUserMenuOpen);
    } else {
      openAuthModal('login');
    }
  };

  // Mobile user menu handlers
  const handleMobileUserMenuClick = (action) => {
    setIsMobileUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    
    // Scroll to top for user profile pages
    if (['profile', 'orders', 'help'].includes(action)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'orders':
        navigate('/orders');
        break;
      case 'help':
        navigate('/help');
        break;
      case 'logout':
        logout();
        break;
      default:
        break;
    }
  };

  // Enhanced quick navigation for search popup
  const handleQuickNavigation = (category) => {
    closeSearch(); // Close the search popup first
    
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

  return (
    <>
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
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
          <div className="nav-link" onClick={handleHomeNavigation} style={{ cursor: 'pointer' }}>
              <span>Home</span>
            <div className="nav-indicator"></div>
          </div>
          <div className="nav-link" onClick={handleProductsNavigation} style={{ cursor: 'pointer' }}>
              <span>All Products</span>
            <div className="nav-indicator"></div>
          </div>
          <div className="nav-link" onClick={() => navigate('/about')} style={{ cursor: 'pointer' }}>
              <span>About Us</span>
            <div className="nav-indicator"></div>
          </div>
          <div className="nav-link" onClick={() => navigate('/testimonials')} style={{ cursor: 'pointer' }}>
              <span>Testimonials</span>
            <div className="nav-indicator"></div>
          </div>
          <div className="nav-link" onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>
              <span>Contact Us</span>
            <div className="nav-indicator"></div>
          </div>
        </div>

        {/* Action Icons */}
        <div className="navbar-actions">
          {/* Enhanced Search Component */}
          <div className="search-container" ref={searchContainerRef}>
            <button className="action-btn search-btn" onClick={openSearch}>
              <MagnifyingGlassIcon />
              <span className="tooltip">Search (⌘K)</span>
            </button>

            {/* Search Overlay */}
            <div 
              className={`search-overlay ${isSearchOpen ? 'open' : ''}`}
              onClick={(e) => {
                // Close modal if clicking on the overlay background (not the modal content)
                if (e.target === e.currentTarget) {
                  closeSearch();
                }
              }}
            >
              <div className="search-modal" ref={searchModalRef}>
                <div className="search-header">
                  <div className="search-input-container">
                    <MagnifyingGlassIcon className="search-icon" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search for watches, or categories..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSearchSubmit();
                        }
                      }}
                      className="search-input"
                    />
                    {searchQuery && (
                      <button
                        className="clear-search"
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                          searchInputRef.current?.focus();
                        }}
                      >
                        <XCircleIcon />
                      </button>
                    )}
                  </div>
                  <button className="close-search" onClick={closeSearch}>
                    <XMarkIcon />
                  </button>
                </div>

                <div className="search-content">
                  {/* Loading State */}
                  {isSearching && (
                    <div className="search-loading">
                      <div className="loading-spinner"></div>
                      <span>Searching...</span>
                    </div>
                  )}

                  {/* Search Results */}
                  {!isSearching && searchQuery && searchResults.length > 0 && (
                    <div className="search-section">
                      <div className="section-header">
                        <h4>Products</h4>
                        <span className="results-count">{searchResults.length} results</span>
                      </div>
                      <div className="search-results">
                        {searchResults.map((product, index) => (
                          <div
                            key={product.id}
                            className="search-result-item"
                            onClick={() => handleProductClick(product)}
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="product-image">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=200&h=200&fit=crop&q=80';
                                }}
                              />
                              {product.badge && (
                                <span className={`product-badge badge-${product.badge.toLowerCase()}`}>
                                  {product.badge}
                                </span>
                              )}
                            </div>
                            <div className="product-info">
                              <h5 className="product-name">{product.name}</h5>
                              <p className="product-category">{product.category}</p>
                              <div className="product-price">
                                <span className="current-price">Rs. {product.price?.toLocaleString()}</span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <span className="original-price">Rs. {product.originalPrice?.toLocaleString()}</span>
                                )}
                              </div>
                              <div className="product-rating">
                                <div className="stars">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < Math.floor(product.rating || 0) ? 'filled' : 'empty'}>★</span>
                                  ))}
                                </div>
                                <span className="rating-text">({product.reviews || 0})</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {searchResults.length >= 8 && (
                        <button
                          className="view-all-results"
                          onClick={() => handleSearchSubmit()}
                        >
                          View all results for "{searchQuery}"
                        </button>
                      )}
                    </div>
                  )}

                  {/* No Results */}
                  {!isSearching && searchQuery && searchResults.length === 0 && (
                    <div className="no-results">
                      <div className="no-results-icon">
            <MagnifyingGlassIcon />
                      </div>
                      <h4>No products found</h4>
                      <p>Try searching for something else or browse our categories</p>
                    </div>
                  )}

                  {/* Recent Searches */}
                  {!searchQuery && recentSearches.length > 0 && (
                    <div className="search-section">
                      <div className="section-header">
                        <h4><ClockIcon /> Recent Searches</h4>
                        <button className="clear-btn" onClick={clearRecentSearches}>Clear</button>
                      </div>
                      <div className="search-suggestions">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            className="suggestion-item recent"
                            onClick={() => {
                              setSearchQuery(search);
                              performSearch(search);
                            }}
                          >
                            <ClockIcon />
                            <span>{search}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  {!searchQuery && (
                    <div className="search-section">
                      <div className="section-header">
                        <h4><ArrowTrendingUpIcon /> Popular Searches</h4>
                      </div>
                      <div className="search-suggestions">
                        {popularSearches.map((search, index) => (
                          <button
                            key={index}
                            className="suggestion-item popular"
                            onClick={() => {
                              setSearchQuery(search);
                              performSearch(search);
                            }}
                          >
                            <ArrowTrendingUpIcon />
                            <span>{search}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  {!searchQuery && (
                    <div className="search-section">
                      <div className="section-header">
                        <h4><SparklesIcon /> Quick Actions</h4>
                      </div>
                      <div className="quick-actions">
                        <button
                          className="quick-action-item"
                          onClick={() => handleQuickNavigation('luxury')}
                        >
                          <span className="action-icon">💎</span>
                          <span>Luxury Watches</span>
                        </button>
                        <button
                          className="quick-action-item"
                          onClick={() => handleQuickNavigation('smart')}
                        >
                          <span className="action-icon">📱</span>
                          <span>Smart Watches</span>
                        </button>
                        <button
                          className="quick-action-item"
                          onClick={() => handleQuickNavigation('sport')}
                        >
                          <span className="action-icon">⚡</span>
                          <span>Sports Watches</span>
                        </button>
                        <button
                          className="quick-action-item"
                          onClick={() => handleQuickNavigation('featured')}
                        >
                          <span className="action-icon">🌟</span>
                          <span>Featured Products</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="search-footer">
                  <div className="search-tips">
                    <span>Tips: Use </span>
                    <kbd>⌘K</kbd>
                    <span> to open search, </span>
                    <kbd>ESC</kbd>
                    <span> to close</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

            <button className="action-btn wishlist-btn" onClick={handleWishlistClick}>
            <HeartIcon />
              {wishlistItemsCount > 0 && (
                <span className="badge">{wishlistItemsCount}</span>
              )}
            <span className="tooltip">Wishlist</span>
          </button>
            <button className="action-btn cart-btn" onClick={handleCartClick}>
            <ShoppingBagIcon />
              {cartItemsCount > 0 && (
                <span className="badge">{cartItemsCount}</span>
              )}
            <span className="tooltip">Cart</span>
          </button>

          {/* Authentication UI */}
          {isAuthenticated ? (
            <div className="user-menu-container">
              <button 
                ref={userButtonRef}
                className="action-btn user-btn" 
                onClick={handleUserIconClick}
              >
                <UserCircleIcon />
                <span className="tooltip">Account</span>
              </button>
              <UserMenu 
                isOpen={isUserMenuOpen} 
                setIsOpen={setIsUserMenuOpen} 
                buttonRef={userButtonRef} 
              />
            </div>
          ) : (
            <button className="action-btn" onClick={handleUserIconClick}>
              <UserIcon />
              <span className="tooltip">Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <XMarkIcon /> : <Bars3Icon />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {/* Mobile Search */}
          <div className="mobile-search">
            <div className="mobile-search-input-container">
              <MagnifyingGlassIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchSubmit();
                    setIsMobileMenuOpen(false);
                  }
                }}
                className="mobile-search-input"
              />
              {searchQuery && (
                <button
                  className="clear-search"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                >
                  <XCircleIcon />
                </button>
              )}
            </div>

            {/* Mobile Search Results */}
            {searchResults.length > 0 && searchQuery && (
              <div className="mobile-search-results">
                {searchResults.slice(0, 4).map((product) => (
                  <div
                    key={product.id}
                    className="mobile-search-result-item"
                    onClick={() => {
                      handleProductClick(product);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=60&h=60&fit=crop&q=80';
                      }}
                    />
                    <div className="mobile-product-info">
                      <h6>{product.name}</h6>
                      <span>Rs. {product.price?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {searchResults.length > 4 && (
                  <button
                    className="view-all-mobile"
                    onClick={() => {
                      handleSearchSubmit();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    View all {searchResults.length} results
                  </button>
                )}
              </div>
            )}
          </div>

          <div 
            className="mobile-nav-link" 
            onClick={() => {
              handleHomeNavigation();
              setIsMobileMenuOpen(false);
            }}
            style={{ cursor: 'pointer' }}
          >
            Home
          </div>
          <div 
            className="mobile-nav-link" 
            onClick={() => {
              handleProductsNavigation();
              setIsMobileMenuOpen(false);
            }}
            style={{ cursor: 'pointer' }}
          >
            All Products
          </div>
          <div 
            className="mobile-nav-link" 
            onClick={() => {
              navigate('/about');
              setIsMobileMenuOpen(false);
            }}
            style={{ cursor: 'pointer' }}
          >
            About Us
          </div>
          <div 
            className="mobile-nav-link" 
            onClick={() => {
              navigate('/testimonials');
              setIsMobileMenuOpen(false);
            }}
            style={{ cursor: 'pointer' }}
          >
            Testimonials
          </div>
          <div 
            className="mobile-nav-link" 
            onClick={() => {
              navigate('/contact');
              setIsMobileMenuOpen(false);
            }}
            style={{ cursor: 'pointer' }}
          >
            Contact Us
          </div>
            
            {/* Mobile Action Buttons */}
            <div className="mobile-actions">
              {/* Mobile Authentication */}
              {isAuthenticated ? (
                <div className="mobile-user-section">
                  <button 
                    className="mobile-user-trigger"
                    onClick={() => setIsMobileUserMenuOpen(!isMobileUserMenuOpen)}
                  >
                    <div className="mobile-user-avatar">
                      <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                    </div>
                    <div className="mobile-user-details">
                      <span className="user-name">{user?.firstName} {user?.lastName}</span>
                      <span className="user-email">{user?.email}</span>
                    </div>
                    {isMobileUserMenuOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  </button>

                  {isMobileUserMenuOpen && (
                    <div className="mobile-user-dropdown">
                      <button 
                        className="mobile-menu-item"
                        onClick={() => handleMobileUserMenuClick('profile')}
                      >
                        <UserCircleIcon />
                        <span>My Profile</span>
                      </button>
                      
                      <button 
                        className="mobile-menu-item"
                        onClick={() => handleMobileUserMenuClick('orders')}
                      >
                        <ClipboardDocumentListIcon />
                        <span>My Orders</span>
                      </button>
                      
                      <button 
                        className="mobile-menu-item"
                        onClick={() => handleMobileUserMenuClick('help')}
                      >
                        <QuestionMarkCircleIcon />
                        <span>Help & Support</span>
                      </button>
                      
                      <div className="mobile-menu-divider"></div>
                      
                      <button 
                        className="mobile-menu-item logout"
                        onClick={() => handleMobileUserMenuClick('logout')}
                      >
                        <ArrowRightOnRectangleIcon />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mobile-auth-buttons">
                  <button 
                    className="mobile-auth-btn primary" 
                    onClick={() => {
                      openAuthModal('login');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <UserIcon />
                    <span>Sign In</span>
                  </button>
                  <button 
                    className="mobile-auth-btn secondary" 
                    onClick={() => {
                      openAuthModal('signup');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <span>Create Account</span>
                  </button>
                </div>
              )}
              
              <button className="mobile-action-btn" onClick={() => {
                handleWishlistClick();
                setIsMobileMenuOpen(false);
              }}>
                <HeartIcon />
                <span>Wishlist ({wishlistItemsCount})</span>
              </button>
              
              <button className="mobile-action-btn" onClick={() => {
                handleCartClick();
                setIsMobileMenuOpen(false);
              }}>
                <ShoppingBagIcon />
                <span>Cart ({cartItemsCount})</span>
              </button>
            </div>
        </div>
      </div>
    </nav>

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={closeCart} />

      {/* Wishlist Sidebar */}
      <Wishlist isOpen={isWishlistOpen} onClose={closeWishlist} />

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        initialMode={authModalMode} 
      />
    </>
  );
};

export default Navbar;