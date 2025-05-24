import React, { useState, useEffect } from 'react';
import { 
  PlayIcon,
  ArrowRightIcon,
  SparklesIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
import './Hero.scss';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
      badge: "NEW COLLECTION",
      title: "Luxury Redefined",
      subtitle: "Experience the perfect fusion of elegance and innovation",
      price: "Starting at $299",
      originalPrice: "$599",
      discount: "50% OFF",
      features: ["Premium Materials", "Smart Technology", "2 Year Warranty"],
      cta: "Discover Collection",
      rating: 4.9,
      reviews: 2847
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
      badge: "TRENDING NOW",
      title: "Smart Meets Style",
      subtitle: "Advanced features wrapped in timeless design",
      price: "From $399",
      originalPrice: "$799",
      discount: "50% OFF",
      features: ["Fitness Tracking", "Premium Build", "Long Battery"],
      cta: "Shop Now",
      rating: 4.8,
      reviews: 1923
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
      badge: "LIMITED EDITION",
      title: "Exclusive Collection",
      subtitle: "Handcrafted perfection for the discerning individual",
      price: "Special Price $499",
      originalPrice: "$999",
      discount: "50% OFF",
      features: ["Limited Edition", "Exclusive Design", "Premium Package"],
      cta: "Get Yours",
      rating: 5.0,
      reviews: 856
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className={`hero ${isLoaded ? 'loaded' : ''}`}>
      <div className="hero-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay"></div>
            
            <div className="hero-content">
              <div className="content-left">
                <div className="badge-container">
                  <div className="new-badge">
                    <SparklesIcon />
                    <span>{slide.badge}</span>
                  </div>
                </div>

                <h1 className="hero-title">
                  <span className="title-line">{slide.title}</span>
                </h1>

                <p className="hero-subtitle">
                  {slide.subtitle}
                </p>

                <div className="features-list">
                  {slide.features.map((feature, idx) => (
                    <div key={idx} className="feature-item">
                      <div className="feature-check">✓</div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="rating-section">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className={i < Math.floor(slide.rating) ? 'filled' : ''} />
                    ))}
                  </div>
                  <span className="rating-text">{slide.rating} ({slide.reviews.toLocaleString()} reviews)</span>
                </div>

                <div className="price-section">
                  <div className="price-main">{slide.price}</div>
                  <div className="price-original">{slide.originalPrice}</div>
                  <div className="discount-badge">{slide.discount}</div>
                </div>

                <div className="cta-section">
                  <button className="cta-primary">
                    <span>{slide.cta}</span>
                    <ArrowRightIcon />
                  </button>
                  <button className="cta-secondary">
                    <PlayIcon />
                    <span>Watch Video</span>
                  </button>
                  <button className="wishlist-btn">
                    <HeartIcon />
                  </button>
                </div>
              </div>

              <div className="content-right">
                <div className="product-showcase">
                  <div className="showcase-item active">
                    <div className="product-preview"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Indicators */}
      <div className="hero-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          >
            <div className="indicator-progress"></div>
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-text">Scroll to explore</div>
        <div className="scroll-arrow"></div>
      </div>
    </section>
  );
};

export default Hero;