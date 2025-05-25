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
import './Products.scss';

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [wishlist, setWishlist] = useState(new Set());
  const [isVisible, setIsVisible] = useState(false);

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

  const categories = [
    { id: 'all', name: 'All Products', icon: SparklesIcon },
    { id: 'luxury', name: 'Luxury', icon: StarIcon },
    { id: 'smart', name: 'Smart Watches', icon: EyeIcon },
    { id: 'sport', name: 'Sport', icon: ArrowRightIcon }
  ];

  const products = [
    {
      id: 1,
      name: "Rolex Submariner",
      category: 'luxury',
      price: 8995,
      originalPrice: 9995,
      image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&h=800&fit=crop&q=80",
      rating: 4.9,
      reviews: 247,
      badge: "Bestseller",
      features: ["Swiss Movement", "Waterproof", "Sapphire Crystal"],
      isNew: false
    },
    {
      id: 2,
      name: "Apple Watch Ultra",
      category: 'smart',
      price: 799,
      originalPrice: 899,
      image: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=800&h=800&fit=crop&q=80",
      rating: 4.8,
      reviews: 892,
      badge: "New",
      features: ["GPS", "Cellular", "Titanium Case"],
      isNew: true
    },
    {
      id: 3,
      name: "Omega Speedmaster",
      category: 'luxury',
      price: 5995,
      originalPrice: 6495,
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop&q=80",
      rating: 4.9,
      reviews: 156,
      badge: "Limited",
      features: ["Moon Watch", "Manual Wind", "Hesalite Crystal"],
      isNew: false
    },
    {
      id: 4,
      name: "Garmin Fenix 7",
      category: 'sport',
      price: 699,
      originalPrice: 799,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&q=80",
      rating: 4.7,
      reviews: 423,
      badge: "Popular",
      features: ["GPS", "Solar Charging", "Rugged Design"],
      isNew: false
    },
    {
      id: 5,
      name: "Patek Philippe Calatrava",
      category: 'luxury',
      price: 32995,
      originalPrice: 34995,
      image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop&q=80",
      rating: 5.0,
      reviews: 89,
      badge: "Exclusive",
      features: ["Hand Wound", "Gold Case", "Leather Strap"],
      isNew: false
    },
    {
      id: 6,
      name: "Samsung Galaxy Watch",
      category: 'smart',
      price: 349,
      originalPrice: 399,
      image: "https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?w=800&h=800&fit=crop&q=80",
      rating: 4.6,
      reviews: 634,
      badge: "Value",
      features: ["AMOLED", "Health Tracking", "Water Resistant"],
      isNew: false
    },
    {
      id: 7,
      name: "TAG Heuer Formula 1",
      category: 'sport',
      price: 1495,
      originalPrice: 1695,
      image: "https://images.unsplash.com/photo-1606859696394-b0e5a3e606a0?w=800&h=800&fit=crop&q=80",
      rating: 4.8,
      reviews: 298,
      badge: "Racing",
      features: ["Chronograph", "Steel Case", "Racing Design"],
      isNew: false
    },
    {
      id: 8,
      name: "Casio G-Shock",
      category: 'sport',
      price: 199,
      originalPrice: 249,
      image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=800&h=800&fit=crop&q=80",
      rating: 4.5,
      reviews: 1247,
      badge: "Tough",
      features: ["Shock Resistant", "Water Proof", "Digital Display"],
      isNew: false
    },
    {
      id: 9,
      name: "Cartier Santos",
      category: 'luxury',
      price: 7250,
      originalPrice: 7850,
      image: "https://images.unsplash.com/photo-1509048191080-d2b9bfece5d7?w=800&h=800&fit=crop&q=80",
      rating: 4.8,
      reviews: 178,
      badge: "Heritage",
      features: ["Square Case", "Roman Numerals", "Luxury Finish"],
      isNew: false
    },
    {
      id: 10,
      name: "Fitbit Versa 4",
      category: 'smart',
      price: 199,
      originalPrice: 229,
      image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&h=800&fit=crop&q=80",
      rating: 4.4,
      reviews: 892,
      badge: "Fitness",
      features: ["Health Tracking", "6+ Day Battery", "Built-in GPS"],
      isNew: true
    },
    {
      id: 11,
      name: "Seiko Prospex",
      category: 'sport',
      price: 395,
      originalPrice: 445,
      image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800&h=800&fit=crop&q=80",
      rating: 4.6,
      reviews: 445,
      badge: "Dive",
      features: ["200M Water Resist", "Automatic", "Luminous Hands"],
      isNew: false
    },
    {
      id: 12,
      name: "Audemars Piguet Royal Oak",
      category: 'luxury',
      price: 28500,
      originalPrice: 31000,
      image: "https://images.unsplash.com/photo-1606839314168-b0e4b80e4d24?w=800&h=800&fit=crop&q=80",
      rating: 4.9,
      reviews: 67,
      badge: "Iconic",
      features: ["Octagonal Bezel", "Integrated Bracelet", "Swiss Made"],
      isNew: false
    }
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const toggleWishlist = (productId) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
          {filteredProducts.map((product, index) => (
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
                  className={`wishlist-btn ${wishlist.has(product.id) ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                >
                  {wishlist.has(product.id) ? <HeartSolid /> : <HeartIcon />}
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
                      console.log(`Added ${product.name} to cart`);
                    }}
                  >
                    <ShoppingBagIcon />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
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