import React, { useState, useEffect } from 'react';
import { 
  ArrowRightIcon,
  SparklesIcon,
  StarIcon,
  ClockIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import './Categories.scss';

const Categories = () => {
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

    const element = document.querySelector('.categories-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const categories = [
    {
      id: 1,
      name: "Luxury Watches",
      description: "Timeless elegance and precision craftsmanship",
      image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=400&fit=crop&q=80",
      icon: StarIcon,
      productCount: "150+ Products",
      priceRange: "$2,000 - $50,000",
      features: ["Swiss Movement","Precious Metals"]
    },
    {
      id: 2,
      name: "Smart Watches",
      description: "Innovation meets style in modern timepieces",
      image: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&h=400&fit=crop&q=80",
      icon: CpuChipIcon,
      productCount: "80+ Products",
      priceRange: "$199 - $899",
    features: ["Health Tracking", "Wireless Connectivity"]
    },
    {
      id: 3,
      name: "Sport Watches",
      description: "Built for adventure and extreme conditions",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop&q=80",
      icon: ClockIcon,
      productCount: "120+ Products",
      priceRange: "$99 - $1,500",
      features: ["Water Resistant", "Solar Charging"]
    }
  ];

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
                className={`category-card ${isVisible ? 'animate' : ''}`}
                style={{ '--delay': `${index * 0.2}s` }}
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
                      <button className="explore-btn">
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
                      <span className="detail-value">{category.productCount}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Price Range:</span>
                      <span className="detail-value">{category.priceRange}</span>
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

                  <button className="view-category-btn">
                    <span>View All Products</span>
                    <ArrowRightIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories; 