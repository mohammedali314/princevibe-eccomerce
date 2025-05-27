import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRightIcon,
  SparklesIcon,
  StarIcon,
  ClockIcon,
  CpuChipIcon,
  EyeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import ApiService from '../../services/api';
import './Categories.scss';

const Categories = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [categoryStats, setCategoryStats] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.categories-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Fetch real category statistics from backend
  useEffect(() => {
    const fetchCategoryStats = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getProductStats();
        if (response.success && response.data.categories) {
          // Transform backend data to match our categories
          const stats = {};
          response.data.categories.forEach(cat => {
            stats[cat._id] = {
              count: cat.count,
              averagePrice: cat.averagePrice
            };
          });
          setCategoryStats(stats);
        }
      } catch (error) {
        console.error('Error fetching category stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryStats();
  }, []);

  // Enhanced categories with real data integration
  const categories = [
    {
      id: 'luxury',
      name: "Luxury Watches",
      description: "Timeless elegance and precision craftsmanship",
      image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=400&fit=crop&q=80",
      icon: StarIcon,
      features: ["Swiss Movement", "Precious Metals", "Limited Edition"],
      priceRange: "Rs. 200,000 - Rs. 5,000,000",
      backgroundColor: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)"
    },
    {
      id: 'smart',
      name: "Smart Watches",
      description: "Innovation meets style in modern timepieces",
      image: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&h=400&fit=crop&q=80",
      icon: CpuChipIcon,
      features: ["Health Tracking", "Wireless Connectivity", "GPS Navigation"],
      priceRange: "Rs. 20,000 - Rs. 150,000",
      backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      id: 'sport',
      name: "Sport Watches",
      description: "Built for adventure and extreme conditions",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop&q=80",
      icon: ShieldCheckIcon,
      features: ["Water Resistant", "Solar Charging", "Shock Proof"],
      priceRange: "Rs. 15,000 - Rs. 200,000",
      backgroundColor: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)"
    },
  ];

  // Handle category navigation
  const handleCategoryClick = (categoryId) => {
    // Scroll to products section and filter by category
    const productsSection = document.getElementById('products');
    if (productsSection) {
      // Navigate to home if not already there
      if (window.location.pathname !== '/') {
        navigate('/');
        // Wait for navigation then scroll and filter
        setTimeout(() => {
          scrollToProducts(categoryId);
        }, 100);
      } else {
        scrollToProducts(categoryId);
      }
    }
  };

  const scrollToProducts = (categoryId) => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      // Trigger category filter in Products component
      setTimeout(() => {
        const categoryButton = document.querySelector(`[data-category="${categoryId}"]`);
        if (categoryButton) {
          categoryButton.click();
        }
      }, 800);
    }
  };

  // Handle explore collection click
  const handleExploreClick = (categoryId, e) => {
    e.stopPropagation();
    handleCategoryClick(categoryId);
  };

  // Format product count
  const getProductCount = (categoryId) => {
    const stats = categoryStats[categoryId];
    if (stats && stats.count) {
      return `${stats.count}+ Products`;
    }
    return loading ? 'Loading...' : '0 Products';
  };

  // Format average price range
  const getFormattedPriceRange = (category) => {
    const stats = categoryStats[category.id];
    if (stats && stats.averagePrice) {
      const avgPrice = Math.round(stats.averagePrice);
      const minPrice = Math.round(avgPrice * 0.5);
      const maxPrice = Math.round(avgPrice * 2);
      return `Rs. ${minPrice.toLocaleString()} - Rs. ${maxPrice.toLocaleString()}`;
    }
    return category.priceRange;
  };

  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=400&fit=crop&q=80";
    e.target.onerror = null;
  };

  return (
    <section id="categories" className={`categories-section ${isVisible ? 'visible' : ''}`}>
      <div className="categories-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-badge">
            <SparklesIcon />
            Collections
          </span>
          <h2 className="section-title">
            Explore Our <span className="title-accent">Categories</span>
          </h2>
          <p className="section-subtitle">
            Discover the perfect timepiece for every occasion and lifestyle
          </p>
        </div>

        {/* Categories Grid */}
        <div className="categories-grid">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div 
                key={category.id} 
                className={`category-card ${isVisible ? 'animate' : ''} ${loading ? 'loading' : ''}`}
                style={{ '--delay': `${index * 0.2}s` }}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="card-image">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    onError={handleImageError}
                  />
                  <div className="image-overlay">
                    <div className="overlay-content">
                      <IconComponent className="category-icon" />
                      <button 
                        className="explore-btn"
                        onClick={(e) => handleExploreClick(category.id, e)}
                      >
                        <span>Explore Collection</span>
                        <ArrowRightIcon />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card-content">
                  <div className="category-info">
                    <h3 className="category-name">{category.name}</h3>
                    <p className="category-description">{category.description}</p>
                  </div>

                  <div className="category-details">
                    <div className="detail-item">
                      <span className="detail-label">Products:</span>
                      <span className="detail-value">{getProductCount(category.id)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Price Range:</span>
                      <span className="detail-value">{getFormattedPriceRange(category)}</span>
                    </div>
                  </div>

                  <div className="category-features">
                    <h4 className="features-title">Key Features</h4>
                    <div className="features-list">
                      {category.features.map((feature, i) => (
                        <span key={i} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                  </div>

                  <button 
                    className="view-category-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category.id);
                    }}
                  >
                    <span>View All Products</span>
                    <ArrowRightIcon />
                  </button>
                </div>

                {/* Category-specific background accent */}
                <div 
                  className="category-accent"
                  style={{ background: category.backgroundColor }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories; 