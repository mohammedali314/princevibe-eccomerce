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
      name: "Ahmed Hassan",
      location: "Karachi, Pakistan",
      rating: 5,
      text: "Excellent service! Received my Rolex Submariner in perfect condition. The delivery was fast and the packaging was premium. Highly recommend Prince Vibe for luxury watches.",
      product: "Rolex Submariner",
      purchaseDate: "Nov 2024",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face&q=80"
    },
    {
      id: 2,
      name: "Fatima Ali",
      location: "Lahore, Pakistan",
      rating: 5,
      text: "Amazing collection! Bought an Omega Speedmaster for my husband's birthday. The quality is outstanding and the customer service was exceptional. Will buy again!",
      product: "Omega Speedmaster",
      purchaseDate: "Oct 2024",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=64&h=64&fit=crop&crop=face&q=80"
    },
    {
      id: 3,
      name: "Muhammad Imran",
      location: "Islamabad, Pakistan",
      rating: 5,
      text: "Perfect experience from ordering to delivery. The TAG Heuer Formula 1 exceeded my expectations. Great quality watches with authentic warranty. Prince Vibe is the best!",
      product: "TAG Heuer Formula 1",
      purchaseDate: "Dec 2024",
      image: "https://images.unsplash.com/photo-1472099645058-36a1b6b88b8e?w=64&h=64&fit=crop&crop=face&q=80"
    },
    {
      id: 4,
      name: "Ayesha Khan",
      location: "Gujranwala, Pakistan",
      rating: 5,
      text: "Bought a Cartier Tank for my collection. The authenticity certificate and premium packaging made the experience luxurious. Fast delivery to Gujranwala. Highly satisfied!",
      product: "Cartier Tank",
      purchaseDate: "Nov 2024",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face&q=80"
    },
    {
      id: 5,
      name: "Syed Usman",
      location: "Faisalabad, Pakistan",
      rating: 5,
      text: "Outstanding service! The Patek Philippe Calatrava arrived exactly as described. Professional packaging and quick delivery. Prince Vibe has earned a loyal customer.",
      product: "Patek Philippe Calatrava",
      purchaseDate: "Jan 2024",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face&q=80"
    },
    {
      id: 6,
      name: "Zara Sheikh",
      location: "Multan, Pakistan",
      rating: 5,
      text: "Incredible collection of luxury watches! Purchased a Breitling Navitimer and it's absolutely perfect. The team was very helpful throughout the process. Definitely recommend!",
      product: "Breitling Navitimer",
      purchaseDate: "Oct 2024",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=64&h=64&fit=crop&crop=face&q=80"
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
    if (sectionId === 'contact') {
      navigate('/contact');
    } else if (sectionId === 'home') {
      navigate('/');
      setTimeout(() => {
        const productsSection = document.getElementById('products');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const scrollToSection = (sectionId) => {
    if (sectionId === 'home') {
      navigate('/');
      setTimeout(() => {
        const productsSection = document.getElementById('products');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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
                      <p>{testimonial.location}</p>
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
                onClick={() => scrollToSection('home')}
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