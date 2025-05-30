import React, { useState, useEffect, useRef } from 'react';
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { PlayIcon, PauseIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import './Testimonials.scss';

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const testimonialRef = useRef(null);

  // Sample testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Alexander Hamilton",
      title: "CEO, Luxury Enterprises",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      text: "Exceptional quality and unparalleled service. This is where luxury meets excellence. Every piece tells a story of craftsmanship and dedication that's truly remarkable.",
      location: "New York, USA",
      product: "Rolex Submariner",
      purchaseDate: "December 2023"
    },
    {
      id: 2,
      name: "Sophia Chen",
      title: "Fashion Director",
      image: "https://plus.unsplash.com/premium_photo-1670071482460-5c08776521fe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
      rating: 5,
      text: "The attention to detail is remarkable. From the packaging to the product itself, everything screams premium quality. An absolutely delightful shopping experience!",
      location: "London, UK",
      product: "Apple Watch Ultra",
      purchaseDate: "November 2023"
    },
    {
      id: 3,
      name: "Marcus Johnson",
      title: "Investment Banker",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      text: "Outstanding customer experience from start to finish. The team went above and beyond to ensure everything was perfect. This is true luxury redefined.",
      location: "Dubai, UAE",
      product: "Omega Speedmaster",
      purchaseDate: "October 2023"
    },
    {
      id: 4,
      name: "Isabella Rodriguez",
      title: "Art Curator",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      text: "Each piece is a work of art. The craftsmanship and attention to detail is extraordinary. I couldn't be happier with my purchase and the entire experience.",
      location: "Paris, France",
      product: "TAG Heuer Monaco",
      purchaseDate: "September 2023"
    },
    {
      id: 5,
      name: "James Wilson",
      title: "Tech Entrepreneur",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      text: "Revolutionary shopping experience with impeccable service. The quality exceeded my expectations, and the delivery was seamless and professional.",
      location: "Silicon Valley, USA",
      product: "Smart Watch Collection",
      purchaseDate: "August 2023"
    },
    {
      id: 6,
      name: "Emma Thompson",
      title: "Luxury Consultant",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      text: "An extraordinary brand that truly understands luxury. The personalized service and attention to detail make this a standout experience in every way.",
      location: "Monaco",
      product: "Diamond Collection",
      purchaseDate: "July 2023"
    }
  ];

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (testimonialRef.current) {
      observer.observe(testimonialRef.current);
    }

    return () => {
      if (testimonialRef.current) {
        observer.unobserve(testimonialRef.current);
      }
    };
  }, []);

  // Scroll to top when component mounts (for navigation from other pages)
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, testimonials.length]);

  // Navigation functions
  const nextTestimonial = () => {
    const container = document.querySelector('.testimonial-main');
    if (container) {
      container.style.opacity = '0.5';
      container.style.transform = 'translateX(20px)';
      setTimeout(() => {
        setCurrentTestimonial(prev => 
          prev === testimonials.length - 1 ? 0 : prev + 1
        );
        container.style.opacity = '1';
        container.style.transform = 'translateX(0)';
      }, 200);
    } else {
      setCurrentTestimonial(prev => 
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevTestimonial = () => {
    const container = document.querySelector('.testimonial-main');
    if (container) {
      container.style.opacity = '0.5';
      container.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        setCurrentTestimonial(prev => 
          prev === 0 ? testimonials.length - 1 : prev - 1
        );
        container.style.opacity = '1';
        container.style.transform = 'translateX(0)';
      }, 200);
    } else {
      setCurrentTestimonial(prev => 
        prev === 0 ? testimonials.length - 1 : prev - 1
      );
    }
  };

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index);
  };

  // Render stars
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`star ${i < rating ? 'filled' : 'empty'}`}
      />
    ));
  };

  // Handle smooth scroll to sections
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Enhanced navigation with smooth transitions
  const enhancedScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="testimonials-page" ref={testimonialRef}>
      {/* Hero Section */}
      <section className="testimonials-hero">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        <div className="hero-content">
          <div className={`hero-text ${isVisible ? 'animate-in' : ''}`}>
            <h1>
              <span className="gradient-text">What Our Clients Say</span>
            </h1>
            <p>Discover the experiences of our valued customers who have chosen excellence</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">12000</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.9</span>
                <span className="stat-label">Average Rating</span>
              </div>
              <div className="stat">
                <span className="stat-number">99%</span>
                <span className="stat-label">Satisfaction Rate</span>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator" onClick={() => enhancedScrollToSection('all-testimonials')}>
          <div className="scroll-arrow"></div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Featured Testimonial Section */}
      {/* <section id="featured-testimonial" className="featured-testimonial">
        <div className="container">
          <div className="section-header">
            <h2>Featured Stories</h2>
            <p>Authentic experiences from our distinguished clientele</p>
          </div>

          <div className="testimonial-carousel">
            <div className="carousel-container">
              <div className="testimonial-main">
                <div className="testimonial-content">
                  <div className="quote-icon">
                    <ChatBubbleLeftIcon />
                  </div>
                  <p className="testimonial-text">
                    {testimonials[currentTestimonial].text}
                  </p>
                  <div className="testimonial-rating">
                    {renderStars(testimonials[currentTestimonial].rating)}
                    <span className="rating-text">({testimonials[currentTestimonial].rating}.0)</span>
                  </div>
                </div>
                
                <div className="testimonial-author">
                  <div className="author-image">
                    <img 
                      src={testimonials[currentTestimonial].image} 
                      alt={testimonials[currentTestimonial].name}
                      loading="lazy"
                    />
                    <div className="verified-badge">✓</div>
                  </div>
                  <div className="author-info">
                    <h4>{testimonials[currentTestimonial].name}</h4>
                    <p>{testimonials[currentTestimonial].title}</p>
                    <span className="location">📍 {testimonials[currentTestimonial].location}</span>
                    <span className="product">Purchased: {testimonials[currentTestimonial].product}</span>
                    <span className="purchase-date">{testimonials[currentTestimonial].purchaseDate}</span>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              {/* <div className="carousel-controls">
                <button 
                  className="control-btn prev" 
                  onClick={prevTestimonial}
                  aria-label="Previous testimonial"
                >
                  <ChevronLeftIcon />
                </button>
                
                <div className="carousel-indicators">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${index === currentTestimonial ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentTestimonial(index);
                        // Add smooth visual transition
                        const container = document.querySelector('.testimonial-main');
                        if (container) {
                          container.style.opacity = '0.5';
                          setTimeout(() => {
                            container.style.opacity = '1';
                          }, 200);
                        }
                      }}
                    />
                  ))}
                </div>

                <button 
                  className="control-btn next" 
                  onClick={nextTestimonial}
                  aria-label="Next testimonial"
                >
                  <ChevronRightIcon />
                </button>
              </div>

              {/* Auto-play Control */}
              {/* <button 
                className="autoplay-control"
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                aria-label={isAutoPlay ? 'Pause autoplay' : 'Start autoplay'}
              >
                {isAutoPlay ? <PauseIcon /> : <PlayIcon />}
                <span>{isAutoPlay ? 'Pause' : 'Play'}</span>
              </button>
            </div>
          </div>
        </div>
      </section> */}

      {/* All Testimonials Grid */}
      <section id="all-testimonials" className="all-testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Client Stories</h2>
            <p>Read what our customers have to say about their luxury experience</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`testimonial-card ${hoveredCard === index ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => goToTestimonial(index)}
              >
                <div className="card-content">
                  <div className="card-header">
                    <div className="author-avatar">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        loading="lazy"
                      />
                      <div className="verified-mini">✓</div>
                    </div>
                    <div className="author-details">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.title}</p>
                      <span className="location">📍 {testimonial.location}</span>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <div className="rating">
                      {renderStars(testimonial.rating)}
                      <span className="rating-number">({testimonial.rating}.0)</span>
                    </div>
                    <p className="testimonial-excerpt">
                      {testimonial.text.length > 120 
                        ? `${testimonial.text.substring(0, 120)}...` 
                        : testimonial.text
                      }
                    </p>
                    <div className="card-footer">
                      <span className="product-tag">{testimonial.product}</span>
                      <span className="purchase-date">{testimonial.purchaseDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="card-hover-effect"></div>
                <div className="card-shine"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      {/* <section className="testimonials-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-value">4.9/5</div>
              <div className="stat-label">Average Rating</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🎯</div>
              <div className="stat-value">12000</div>
              <div className="stat-label">Satisfied Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🚀</div>
              <div className="stat-value">99%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">💎</div>
              <div className="stat-value">2+ Years</div>
              <div className="stat-label">Excellence Record</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Call to Action Section */}
      <section className="testimonials-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Create Your Own Story?</h2>
            <p>Join thousands of satisfied customers who have experienced luxury redefined</p>
            <div className="cta-buttons">
              <button 
                className="cta-btn primary" 
                onClick={() => enhancedScrollToSection('home')}
              >
                Explore Our Collection
              </button>
              <button 
                className="cta-btn secondary" 
                onClick={() => enhancedScrollToSection('contact')}
              >
                Contact Us Today
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials; 