import React, { useState, useEffect, useRef } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import './Testimonials.scss';
import { useNavigate } from 'react-router-dom';

const Testimonials = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const testimonialRef = useRef(null);

  // Sample testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Ahmed Hassan Khan",
      title: "Business Owner",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      text: "Prince Vibe ne mere expectations se kahin zyada behtareen service di. Quality aur customer care dono outstanding hai. Highly recommended for luxury watches in Pakistan!",
      location: "Lahore, Pakistan",
      product: "Rolex Submariner",
      purchaseDate: "December 2023"
    },
    {
      id: 2,
      name: "Fatima Malik",
      title: "Fashion Designer",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      text: "Bohat hi professional service aur quality bilkul authentic hai. Packaging bhi itni elegant thi ke gift ke liye perfect. Prince Vibe is the best choice for luxury watches!",
      location: "Karachi, Pakistan",
      product: "Apple Watch Ultra",
      purchaseDate: "November 2023"
    },
    {
      id: 3,
      name: "Muhammad Bilal Sheikh",
      title: "Software Engineer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      text: "Amazing experience! Fast delivery across Pakistan and the watch quality is exactly as shown. Customer support is very responsive. Definitely buying again!",
      location: "Islamabad, Pakistan",
      product: "Omega Speedmaster",
      purchaseDate: "October 2023"
    },
    {
      id: 4,
      name: "Ayesha Rehman",
      title: "Doctor",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      text: "Mera pehla luxury watch purchase tha aur Prince Vibe ne bilkul perfect experience diya. COD facility bhi available hai jo very convenient hai. Excellent service!",
      location: "Faisalabad, Pakistan",
      product: "TAG Heuer Monaco",
      purchaseDate: "September 2023"
    },
    {
      id: 5,
      name: "Usman Ali Qureshi",
      title: "Marketing Director",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      text: "Prince Vibe ka collection bohat diverse hai aur prices bhi reasonable. Delivery time bhi committed ke according thi. Best platform for authentic luxury watches in Pakistan!",
      location: "Rawalpindi, Pakistan",
      product: "Smart Watch Collection",
      purchaseDate: "August 2023"
    },
    {
      id: 6,
      name: "Zara Khan",
      title: "Entrepreneur",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
      rating: 5,
      text: "Outstanding quality aur customer service! Mere husband ke liye gift liya tha aur wo bohat khush hue. Prince Vibe truly delivers premium luxury experience in Pakistan.",
      location: "Multan, Pakistan",
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

  // Render stars
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`star ${i < rating ? 'filled' : 'empty'}`}
      />
    ));
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

  // Navigation functions for CTA buttons
  const handleProductsNavigation = () => {
    navigate('/');
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 300);
  };

  const handleContactNavigation = () => {
    navigate('/contact');
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
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
                <span className="stat-number">12K+</span>
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

      {/* Call to Action Section */}
      <section className="testimonials-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Create Your Own Story?</h2>
            <p>Join thousands of satisfied customers who have experienced luxury redefined</p>
            <div className="cta-buttons">
              <button 
                className="cta-btn primary" 
                onClick={handleProductsNavigation}
              >
                Explore Our Collection
              </button>
              <button 
                className="cta-btn secondary" 
                onClick={handleContactNavigation}
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