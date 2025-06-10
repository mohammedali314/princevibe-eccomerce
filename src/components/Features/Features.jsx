import React, { useState, useEffect } from 'react';
import { 
  TruckIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  GiftIcon,
  CreditCardIcon,
  StarIcon,
  ClockIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import './Features.scss';

const Features = () => {
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

    const element = document.querySelector('.features-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      id: 1,
      icon: TruckIcon,
      title: "Free Shipping in Pakistan",
      description: "Complimentary delivery across Pakistan with tracking and secure packaging.",
      color: "blue"
    },
    {
      id: 2,
      icon: ShieldCheckIcon,
      title: "Lifetime Warranty",
      description: "Comprehensive warranty coverage on all luxury timepieces with expert service support.",
      color: "green"
    },
    {
      id: 3,
      icon: ChatBubbleLeftRightIcon,
      title: "24/7 Expert Support",
      description: "Round-the-clock customer service from our certified watch specialists.",
      color: "purple"
    },
    {
      id: 4,
      icon: GiftIcon,
      title: "Luxury Gift Packaging",
      description: "Every purchase comes with premium packaging perfect for special occasions.",
      color: "pink"
    },
    {
      id: 5,
      icon: CreditCardIcon,
      title: "Cash on Delivery (COD)",
      description: "Convenient COD payment across Pakistan with secure order processing and verification.",
      color: "orange"
    },
    {
      id: 6,
      icon: CheckBadgeIcon,
      title: "Authenticity Guaranteed",
      description: "100% authentic products with certificate of authenticity for every timepiece.",
      color: "indigo"
    }
  ];

  const stats = [
    {
      id: 1,
      number: "12K+",
      label: "Happy Customers",
      icon: StarIcon
    },
    {
      id: 2,
      number: "4+",
      label: "Years Experience",
      icon: ClockIcon
    },
    {
      id: 3,
      number: "10+",
      label: "Luxury Brands",
      icon: CheckBadgeIcon
    },
    {
      id: 4,
      number: "24/7",
      label: "Customer Support",
      icon: ChatBubbleLeftRightIcon
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'feature-blue',
      green: 'feature-green',
      purple: 'feature-purple',
      pink: 'feature-pink',
      orange: 'feature-orange',
      indigo: 'feature-indigo'
    };
    return colorMap[color] || 'feature-blue';
  };

  return (
    <section id="features" className={`features-section ${isVisible ? 'visible' : ''}`}>
      <div className="features-container">
        {/* Stats Section */}
        <div className="stats-section">
          <div className="stats-grid">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={stat.id} 
                  className={`stat-card ${isVisible ? 'animate' : ''}`}
                  style={{ '--delay': `${index * 0.1}s` }}
                >
                  <div className="stat-icon">
                    <IconComponent />
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-content">
          <div className="section-header">
            <h2 className="section-title">
              Why Choose <span className="title-accent">PrinceVibe</span>
            </h2>
            <p className="section-subtitle">
              Experience unparalleled service and quality with every purchase
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={feature.id} 
                  className={`feature-card ${getColorClasses(feature.color)} ${isVisible ? 'animate' : ''}`}
                  style={{ '--delay': `${index * 0.15}s` }}
                >
                  <div className="feature-icon">
                    <IconComponent />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                  <div className="feature-glow"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust Indicators */}
        {/* <div className="trust-section">
          <div className="trust-content">
            <div className="trust-text">
              <h3>Trusted by Watch Enthusiasts Worldwide</h3>
              <p>Join thousands of satisfied customers who trust PrinceVibe for their luxury timepiece needs.</p>
            </div>
            <div className="trust-images">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop&q=80" 
                alt="Luxury watch collection"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=300&h=200&fit=crop&q=80";
                }}
              />
              <img 
                src="https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=300&h=200&fit=crop&q=80" 
                alt="Watch craftsmanship"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=300&h=200&fit=crop&q=80";
                }}
              />
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Features; 