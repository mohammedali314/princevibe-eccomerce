import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRightIcon,
  SparklesIcon,
  StarIcon,
  ClockIcon,
  CpuChipIcon,
  EyeIcon,
  ShieldCheckIcon,
  FireIcon,
  BoltIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import ApiService from '../../services/api';
import './Categories.scss';

const Categories = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [categoryStats, setCategoryStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  // Enhanced intersection observer for luxury entrance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Add a small delay for more dramatic effect
          setTimeout(() => {
            const cards = document.querySelectorAll('.category-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate');
              }, index * 200);
            });
          }, 300);
        }
      },
      { threshold: 0.2, rootMargin: '50px' }
    );

    const element = sectionRef.current;
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      return () => section.removeEventListener('mousemove', handleMouseMove);
    }
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

  // Enhanced categories with luxury imagery and premium descriptions
  const categories = [
    {
      id: 'luxury',
      name: "Heritage Luxury",
      description: "Exquisite masterpieces crafted by legendary Swiss artisans with centuries of tradition",
      image: "https://images.unsplash.com/photo-1594576662893-44f03193d5b5?w=800&h=600&fit=crop&q=90",
      icon: StarIcon,
      features: ["Swiss Movement", "18K Gold", "Handcrafted", "Limited Edition"],
      priceRange: "Rs. 500,000 - Rs. 5,000,000",
      backgroundColor: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)",
      accentColor: "#FFD700",
      tier: "Exclusive"
    },
    {
      id: 'smart',
      name: "Future Tech",
      description: "Revolutionary smartwatches that seamlessly blend cutting-edge technology with sophisticated design",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&q=90",
      icon: BoltIcon,
      features: ["AI Health Tracking", "5G Connectivity", "Holographic Display", "Voice Assistant"],
      priceRange: "Rs. 50,000 - Rs. 200,000",
      backgroundColor: "linear-gradient(135deg, #00D4FF 0%, #0099CC 50%, #0066FF 100%)",
      accentColor: "#00D4FF",
      tier: "Innovation"
    },
    {
      id: 'sport',
      name: "Elite Performance",
      description: "Military-grade timepieces engineered for extreme conditions and peak athletic performance",
      image: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=800&h=600&fit=crop&q=90",
      icon: FireIcon,
      features: ["Titanium Body", "Solar Charging", "10ATM Waterproof", "GPS Navigation"],
      priceRange: "Rs. 25,000 - Rs. 300,000",
      backgroundColor: "linear-gradient(135deg, #FF6B6B 0%, #FF4757 50%, #FF3838 100%)",
      accentColor: "#FF6B6B",
      tier: "Professional"
    },
  ];

  // Handle category navigation - now more intelligent
  const handleCategoryClick = (categoryId) => {
    // Add click animation
    const clickedCard = document.querySelector(`[data-category="${categoryId}"]`);
    if (clickedCard) {
      clickedCard.style.transform = 'scale(0.98)';
      setTimeout(() => {
        clickedCard.style.transform = '';
      }, 150);
    }

    // Just set the category filter without scrolling
    // Let the user decide when to go to products
    setCategoryFilter(categoryId);
  };

  // Only scroll to products when explicitly requested
  const scrollToProducts = (categoryId) => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      // Navigate to home if not already there
      if (window.location.pathname !== '/') {
        navigate('/');
        // Wait for navigation then scroll and filter
        setTimeout(() => {
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
        }, 100);
      } else {
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
    }
  };

  // Set category filter in localStorage for Products component to pick up
  const setCategoryFilter = (categoryId) => {
    try {
      localStorage.setItem('selectedCategory', categoryId);
      // Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent('categorySelected', { 
        detail: { categoryId } 
      }));
    } catch (error) {
      console.error('Error setting category filter:', error);
    }
  };

  // Handle explore collection click - this one navigates to products
  const handleExploreClick = (categoryId, e) => {
    e.stopPropagation();
    
    // Create ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
    
    // Set filter and scroll to products (this is the intended navigation)
    setCategoryFilter(categoryId);
    scrollToProducts(categoryId);
  };

  // Format product count with animation
  const getProductCount = (categoryId) => {
    const stats = categoryStats[categoryId];
    if (stats && stats.count) {
      return `${stats.count}+ Products`;
    }
    return loading ? 'Loading...' : '50+ Products';
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

  // Enhanced image error handling
  const handleImageError = (e, category) => {
    // Fallback to category-specific placeholder
    const fallbacks = {
      luxury: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=600&fit=crop&q=90",
      smart: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=800&h=600&fit=crop&q=90",
      sport: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&q=90"
    };
    e.target.src = fallbacks[category.id] || fallbacks.luxury;
    e.target.onerror = null;
  };

  // Calculate parallax offset
  const getParallaxStyle = (index) => {
    if (!isVisible || hoveredCard !== index) return {};
    
    const offsetX = (mousePosition.x - 0.5) * 20;
    const offsetY = (mousePosition.y - 0.5) * 10;
    
    return {
      transform: `translate(${offsetX}px, ${offsetY}px)`,
      transition: 'transform 0.1s ease-out'
    };
  };

  return (
    <section 
      id="categories" 
      ref={sectionRef}
      className={`categories-section ${isVisible ? 'visible' : ''}`}
      style={{
        '--mouse-x': mousePosition.x,
        '--mouse-y': mousePosition.y
      }}
    >
      <div className="categories-container">
        {/* Enhanced Section Header */}
        <div className="section-header">
          <span className="section-badge">
            <SparklesIcon />
            Premium Collections
          </span>
          <h2 className="section-title">
            Discover <span className="title-accent">Luxury</span> Redefined
          </h2>
          <p className="section-subtitle">
            Experience the pinnacle of horological excellence with our curated collection of the world's most prestigious timepieces, where every second tells a story of uncompromising craftsmanship
          </p>
        </div>

        {/* Enhanced Categories Grid */}
        <div className="categories-grid">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div 
                key={category.id} 
                data-category={category.id}
                className={`category-card ${isVisible ? 'animate' : ''} ${loading ? 'loading' : ''}`}
                style={{ 
                  '--delay': `${index * 0.2}s`,
                  '--accent-color': category.accentColor,
                  ...getParallaxStyle(index)
                }}
                onClick={() => handleCategoryClick(category.id)}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Enhanced Card Image */}
                <div className="card-image">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    onError={(e) => handleImageError(e, category)}
                    loading="lazy"
                  />
                  <div className="image-overlay">
                    <div className="overlay-content">
                      <IconComponent className="category-icon" />
                      <div className="tier-badge">{category.tier}</div>
                      <button 
                        className="explore-btn"
                        onClick={(e) => handleExploreClick(category.id, e)}
                      >
                        <span>Explore Collection</span>
                        <ArrowRightIcon />
                      </button>
                    </div>
                  </div>
                  {/* Luxury sparkle effect */}
                  <div className="sparkle-overlay">
                    <div className="sparkle" style={{ '--delay': '0s' }}></div>
                    <div className="sparkle" style={{ '--delay': '1s' }}></div>
                    <div className="sparkle" style={{ '--delay': '2s' }}></div>
                  </div>
                </div>

                {/* Enhanced Card Content */}
                <div className="card-content">
                  <div className="category-info">
                    <h3 className="category-name">{category.name}</h3>
                    <p className="category-description">{category.description}</p>
                  </div>

                  <div className="category-details">
                    <div className="detail-item">
                      <span className="detail-label">Available</span>
                      <span className="detail-value">{getProductCount(category.id)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Investment Range</span>
                      <span className="detail-value">{getFormattedPriceRange(category)}</span>
                    </div>
                  </div>

                  <div className="category-features">
                    <h4 className="features-title">Signature Features</h4>
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
                      handleExploreClick(category.id, e);
                    }}
                  >
                    <span>Discover Collection</span>
                    <ArrowRightIcon />
                  </button>
                </div>

                {/* Enhanced category-specific accent */}
                <div 
                  className="category-accent"
                  style={{ background: category.backgroundColor }}
                ></div>

                {/* Luxury glow effect */}
                <div className="luxury-glow"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add CSS for ripple animation */}
      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default Categories; 