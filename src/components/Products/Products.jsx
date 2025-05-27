import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HeartIcon,
  ShoppingBagIcon,
  EyeIcon,
  StarIcon,
  ClockIcon,
  ArrowRightIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import ApiService from '../../services/api';
import './Products.scss';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [loadingItems, setLoadingItems] = useState({
    cart: new Set(),
    wishlist: new Set()
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Use global contexts
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart, isItemInCart, getItemQuantity } = useCart();

  // Parse URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    const categoryParam = urlParams.get('category');
    const featuredParam = urlParams.get('featured');

    if (searchParam) {
      setSearchQuery(searchParam);
      setIsSearchMode(true);
      setActiveCategory('all');
    } else if (categoryParam) {
      setActiveCategory(categoryParam);
      setIsSearchMode(false);
      setSearchQuery('');
    } else if (featuredParam === 'true') {
      setActiveCategory('featured');
      setIsSearchMode(false);
      setSearchQuery('');
    } else {
      setIsSearchMode(false);
      setSearchQuery('');
      if (!activeCategory) {
        setActiveCategory('all');
      }
    }
  }, [location.search]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.products-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        
        if (isSearchMode && searchQuery) {
          // Search mode
          response = await ApiService.searchProducts(searchQuery);
          const transformedResponse = ApiService.transformResponse(response);
          setSearchResults(transformedResponse.data || []);
          setProducts(transformedResponse.data || []);
        } else {
          // Category mode
          if (activeCategory === 'all') {
            response = await ApiService.getProducts();
          } else if (activeCategory === 'featured') {
            response = await ApiService.getProducts({ featured: 'true' });
          } else {
            response = await ApiService.getProductsByCategory(activeCategory);
          }
          
          const transformedResponse = ApiService.transformResponse(response);
          setProducts(transformedResponse.data || []);
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, isSearchMode, searchQuery]);

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setIsSearchMode(false);
    setSearchQuery('');
    
    // Update URL without search params
    navigate('/', { replace: true });
  };

  // Enhanced Add to Cart functionality from ProductDetail
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Add to cart clicked for:', product.name);
    
    // Check if already loading
    if (loadingItems.cart.has(product.id)) return;
    
    if (!product.inStock) {
      showLuxuryToast('Product is currently out of stock', 'error');
      return;
    }

    if (isItemInCart(product.id)) {
      showLuxuryToast('Product is already in your cart', 'info');
      return;
    }

    // Set loading state
    setLoadingItems(prev => ({
      ...prev,
      cart: new Set([...prev.cart, product.id])
    }));

    try {
      const currentCartQuantity = getItemQuantity(product.id);
      const maxQuantity = product?.stock || 10;
      const availableToAdd = maxQuantity - currentCartQuantity;
      
      if (availableToAdd <= 0) {
        showLuxuryToast('Maximum quantity already in cart', 'error');
        return;
      }
      
      addToCart(product, 1);
      showLuxuryToast(`Added ${product.name} to cart`, 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showLuxuryToast('Failed to add item to cart', 'error');
    } finally {
      setTimeout(() => {
        setLoadingItems(prev => ({
          ...prev,
          cart: new Set([...prev.cart].filter(id => id !== product.id))
        }));
      }, 500);
    }
  };

  // Enhanced Wishlist Toggle functionality from ProductDetail
  const handleWishlistToggle = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Wishlist toggle clicked for:', product.name);
    
    // Check if already loading
    if (loadingItems.wishlist.has(product.id)) return;

    // Set loading state
    setLoadingItems(prev => ({
      ...prev,
      wishlist: new Set([...prev.wishlist, product.id])
    }));

    try {
      const wasInWishlist = isInWishlist(product.id);
      toggleWishlist(product);
      
      if (wasInWishlist) {
        showLuxuryToast('Removed from wishlist', 'remove');
      } else {
        showLuxuryToast('Added to wishlist', 'wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      showLuxuryToast('Failed to update wishlist', 'error');
    } finally {
      setTimeout(() => {
        setLoadingItems(prev => ({
          ...prev,
          wishlist: new Set([...prev.wishlist].filter(id => id !== product.id))
        }));
      }, 500);
    }
  };

  // Luxury Toast System from ProductDetail
  const showLuxuryToast = (message, type) => {
    const id = Date.now();
    const toast = { id, message, type };
    
    setToasts(prev => [...prev, toast]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const categories = [
    { id: 'all', name: 'All Products', icon: SparklesIcon },
    { id: 'luxury', name: 'Luxury', icon: StarIcon },
    { id: 'smart', name: 'Smart Watches', icon: EyeIcon },
    { id: 'sport', name: 'Sport', icon: ArrowRightIcon },
    { id: 'classic', name: 'Classic', icon: ClockIcon }
  ];

  // Remove filteredProducts logic since we fetch filtered data from backend
  const filteredProducts = products;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getBadgeStyle = (badge) => {
    const styles = {
      'Bestseller': 'badge-bestseller',
      'New': 'badge-new',
      'Limited': 'badge-limited',
      'Popular': 'badge-popular',
      'Exclusive': 'badge-exclusive',
      'Value': 'badge-value',
      'Racing': 'badge-racing',
      'Tough': 'badge-tough',
      'Heritage': 'badge-heritage',
      'Fitness': 'badge-fitness',
      'Dive': 'badge-dive',
      'Iconic': 'badge-iconic'
    };
    return styles[badge] || 'badge-default';
  };

  const handleImageError = (e) => {
    // Fallback to a placeholder image if the original fails to load
    e.target.src = `https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop&q=80&auto=format`;
    e.target.onerror = null; // Prevent infinite loop
  };

  return (
    <>
    <section id="products" className={`products-section ${isVisible ? 'visible' : ''}`}>
      <div className="products-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="header-content">
            <span className="section-badge">
              <SparklesIcon />
              {isSearchMode ? 'Search Results' : 'Curated Collection'}
            </span>
            <h2 className="section-title">
              {isSearchMode ? (
                <>
                  Results for <span className="title-accent">"{searchQuery}"</span>
                </>
              ) : (
                <>
                  Trending <span className="title-accent">Products</span>
                </>
              )}
            </h2>
            <p className="section-subtitle">
              {isSearchMode ? (
                `Found ${products.length} product${products.length !== 1 ? 's' : ''} matching your search.`
              ) : (
                'Discover our handpicked selection of the world\'s finest watches, where tradition meets innovation in perfect harmony.'
              )}
            </p>
          </div>
        </div>

        {/* Category Filter - Hide when in search mode */}
        {!isSearchMode && (
          <div className="category-filter">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
                  data-category={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  <IconComponent />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Search Results Header */}
        {isSearchMode && (
          <div className="search-results-header">
            <div className="search-info">
              <h3>Search Results for "{searchQuery}"</h3>
              <p>{products.length} product{products.length !== 1 ? 's' : ''} found</p>
            </div>
            <button 
              className="clear-search-btn"
              onClick={() => {
                setIsSearchMode(false);
                setSearchQuery('');
                setActiveCategory('all');
                navigate('/', { replace: true });
              }}
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="products-grid">
            {loading ? (
              // Loading state
              Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="product-card skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line skeleton-title"></div>
                    <div className="skeleton-line skeleton-rating"></div>
                    <div className="skeleton-line skeleton-price"></div>
                  </div>
                </div>
              ))
            ) : error ? (
              // Error state
              <div className="error-state">
                <div className="error-content">
                  <h3>Oops! Something went wrong</h3>
                  <p>{error}</p>
                  <button 
                    className="retry-btn"
                    onClick={() => {
                      const fetchProducts = async () => {
                        try {
                          setLoading(true);
                          setError(null);
                          
                          let response;
                          if (activeCategory === 'all') {
                            response = await ApiService.getProducts();
                          } else {
                            response = await ApiService.getProductsByCategory(activeCategory);
                          }

                          const transformedResponse = ApiService.transformResponse(response);
                          setProducts(transformedResponse.data || []);
                        } catch (err) {
                          console.error('Error fetching products:', err);
                          setError('Failed to load products. Please try again later.');
                          setProducts([]);
                        } finally {
                          setLoading(false);
                        }
                      };
                      fetchProducts();
                    }}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              // No products state
              <div className="no-products-state">
                <div className="no-products-content">
                  <h3>No products found</h3>
                  <p>We couldn't find any products in this category.</p>
                </div>
              </div>
            ) : (
              // Products list
              filteredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className={`product-card ${isVisible ? 'animate' : ''}`}
              style={{ '--delay': `${index * 0.1}s` }}
            >
              <div className="card-header">
                <Link to={`/product/${product.id}`} className="product-image-link">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} loading="lazy" onError={handleImageError} />
                    <div className="image-overlay">
                      <button className="quick-view-btn">
                        <EyeIcon />
                        <span>View Details</span>
                      </button>
                    </div>
                    {product.badge && (
                      <div className={`product-badge ${getBadgeStyle(product.badge)}`}>
                        {product.badge}
                      </div>
                    )}
                    {product.isNew && (
                      <div className="new-indicator">
                        <SparklesIcon />
                      </div>
                    )}
                  </div>
                </Link>
                <button 
                    className={`wishlist-btn ${isInWishlist(product.id) ? 'active loved' : ''} ${loadingItems.wishlist.has(product.id) ? 'loading' : ''}`}
                    onClick={(e) => handleWishlistToggle(product, e)}
                    disabled={loadingItems.wishlist.has(product.id)}
                  >
                    {isInWishlist(product.id) ? <HeartSolid /> : <HeartIcon />}
                </button>
              </div>

              <div className="card-content">
                <Link to={`/product/${product.id}`} className="product-info-link">
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={i < Math.floor(product.rating) ? 'filled' : 'empty'} 
                          />
                        ))}
                      </div>
                      <span className="rating-text">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>
                    <div className="product-features">
                      {product.features.slice(0, 2).map((feature, i) => (
                        <span key={i} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                  </div>
                </Link>

                <div className="product-pricing">
                  <div className="price-section">
                    <span className="current-price">{formatPrice(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="original-price">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  <button 
                      className={`add-to-cart-btn ${loadingItems.cart.has(product.id) ? 'loading' : ''} ${isItemInCart(product.id) ? 'in-cart' : ''}`}
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={!product.inStock || isItemInCart(product.id) || loadingItems.cart.has(product.id)}
                  >
                    <ShoppingBagIcon />
                      <span>
                        {loadingItems.cart.has(product.id) 
                          ? 'Adding...' 
                          : isItemInCart(product.id) 
                            ? `In Cart (${getItemQuantity(product.id)})` 
                            : 'Add to Cart'
                        }
                      </span>
                      {isItemInCart(product.id) && !loadingItems.cart.has(product.id) && (
                        <div className="cart-badge">{getItemQuantity(product.id)}</div>
                      )}
                  </button>
                  </div>
                </div>
              </div>
              ))
            )}
        </div>

        {/* View All Button */}
        <div className="section-footer">
          <button className="view-all-btn">
            <span>View All Collection</span>
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </section>

      {/* Luxury Toast Container - Moved outside to escape stacking context */}
      <div className="luxury-toast-container">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`luxury-toast ${toast.type}`}
            onClick={() => removeToast(toast.id)}
          >
            <div className="toast-icon">
              {toast.type === 'success' && <CheckCircleIcon />}
              {toast.type === 'error' && <ExclamationTriangleIcon />}
              {toast.type === 'info' && <ShoppingBagIcon />}
              {toast.type === 'wishlist' && <HeartSolid />}
              {toast.type === 'remove' && <HeartIcon />}
            </div>
            <div className="toast-content">
              <span className="toast-message">{toast.message}</span>
            </div>
            <button 
              className="toast-close"
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Products; 