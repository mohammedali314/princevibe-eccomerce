import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon,
  ShoppingBagIcon,
  EyeIcon,
  StarIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import ApiService from '../../services/api';
import './Products.scss';

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use global contexts
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

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
        // Fallback to empty array instead of hardcoded data
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  const categories = [
    { id: 'all', name: 'All Products', icon: SparklesIcon },
    { id: 'luxury', name: 'Luxury', icon: StarIcon },
    { id: 'smart', name: 'Smart Watches', icon: EyeIcon },
    { id: 'sport', name: 'Sport', icon: ArrowRightIcon },
    { id: 'classic', name: 'Classic', icon: StarIcon }
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
    <section id="products" className={`products-section ${isVisible ? 'visible' : ''}`}>
      <div className="products-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="header-content">
            <span className="section-badge">
              <SparklesIcon />
              Curated Collection
            </span>
            <h2 className="section-title">
              Trending <span className="title-accent">Products</span>
            </h2>
            <p className="section-subtitle">
              Discover our handpicked selection of the world's finest watches, 
              where tradition meets innovation in perfect harmony.
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <IconComponent />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

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
                  className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
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
                    className="add-to-cart-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    <ShoppingBagIcon />
                    <span>Add to Cart</span>
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
  );
};

export default Products; 