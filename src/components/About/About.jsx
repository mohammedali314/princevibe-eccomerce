import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SparklesIcon, 
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import './About.scss';
import Aboutimage from '../../../public/photos/LOGO.jpeg';
import Arhamimage from '../../../public/photos/Arham.png';
import Princeimage from '../../../public/photos/Profile.jpg';

const About = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const teamRef = useRef(null);
  const teamCarouselRef = useRef(null);
  
  // Team carousel state
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  // Team data - moved before useEffect to avoid initialization error
  const team = [
    {
      name: 'Mohammed Ali',
      role: 'Founder & CEO',
      image: Princeimage,
      description: 'Visionary leader with 5+ years in luxury timepieces',
      social: { linkedin: '#', youtube: 'https://www.youtube.com/channel/UCxAd5CkpTkule-P7rgdevjQ', tiktok: 'https://www.tiktok.com/@princevibe_official' }
    },
    {
      name: 'Arham Luqman',
      role: 'Founder & Social Media Manager',
      image: Arhamimage,
      description: 'Expert horologist specializing in vintage and luxury pieces',
      social: { linkedin: '#', youtube: 'https://www.youtube.com/channel/UCxAd5CkpTkule-P7rgdevjQ', tiktok: 'https://www.tiktok.com/@princevibe_official' }
    },
  ];

  const milestones = [
    { year: '2020', title: 'Founded PrinceVibe', description: 'Started with a vision to democratize luxury timepieces' },
    { year: '2021', title: 'First 1K Customers', description: 'Reached our first milestone of satisfied customers' },
    { year: '2022', title: 'Shipping to all over Pakistan', description: 'Shipping to across all over Pakistan' },
    { year: '2023', title: 'Premium Partnerships', description: 'Established partnerships with top luxury brands' },
    { year: '2024', title: 'Innovation Hub', description: 'Launched our technology and innovation center' }
  ];

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Add scroll animation observers
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const sections = [heroRef, teamRef];
    sections.forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  // Team carousel auto-scroll effect
  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      setCurrentTeamIndex((prevIndex) => 
        (prevIndex + 1) % team.length
      );
    }, 6000); // Changed from 4000 to 6000 (6 seconds)

    return () => clearInterval(interval);
  }, [isAutoScrolling, team.length]);

  // Touch handling for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setIsAutoScrolling(false); // Stop auto-scroll immediately when user touches
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 30; // Reduced for more sensitive swiping
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      const nextIndex = (currentTeamIndex + 1) % team.length;
      setCurrentTeamIndex(nextIndex);
    } else if (isRightSwipe) {
      const prevIndex = (currentTeamIndex - 1 + team.length) % team.length;
      setCurrentTeamIndex(prevIndex);
    }

    // Reset touch coordinates
    setTouchStartX(null);
    setTouchEndX(null);
    
    // Resume auto-scroll after 8 seconds
    setTimeout(() => setIsAutoScrolling(true), 8000);
  };

  // Helper function to wait for element and scroll to it
  const scrollToProducts = () => {
    const maxAttempts = 10;
    let attempts = 0;
    
    const tryScroll = () => {
      const target = document.getElementById('products');
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        return true;
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(tryScroll, 200); // Try again in 200ms
      }
      return false;
    };
    
    tryScroll();
  };

  // Function to handle navigation to products section
  const handleProductsNavigation = () => {
    navigate('/');
    setTimeout(() => {
      scrollToProducts();
    }, 300); // Increased timeout to allow page to load
  };

  // Function to handle navigation to home (top of page)
  const handleHomeNavigation = () => {
    navigate('/');
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero" ref={heroRef}>
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">
              <SparklesIcon />
              About PrinceVibe
            </span>
            <h1 className="hero-title">
              Crafting Time,
              <span className="gradient-text"> Creating Memories</span>
            </h1>
            <p className="hero-description">
              We're passionate about bringing you the world's finest timepieces. From classic elegance to cutting-edge innovation, every watch tells a story, and we're here to help you find yours.
            </p>
            <div className="hero-features">
              <div className="feature">
                <CheckCircleIcon />
                <span>Authentic Luxury Watches</span>
              </div>
              <div className="feature">
                <CheckCircleIcon />
                <span>Pakistan Shipping</span>
              </div>
              <div className="feature">
                <CheckCircleIcon />
                <span>Lifetime Support</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-watch">
              <img 
                src={Aboutimage}
                alt="Luxury Watch" 
              />
              <div className="watch-glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Story</h2>
              <div className="story-paragraphs">
                <p>
                  Born from a passion for exceptional timepieces, PrinceVibe began as a dream to make luxury watches accessible to discerning customers in Pakistan. Our founder, Mohammed Ali, envisioned a platform where horological excellence meets modern convenience.
                </p>
                <p>
                  What started as a small collection of carefully curated watches has grown into a premier destination for timepiece enthusiasts across Pakistan. We believe that a watch is more than an accessory—it's a companion for life's most important moments.
                </p>
                <p>
                  Today, we continue to uphold our commitment to authenticity, quality, and exceptional customer service, serving thousands of satisfied customers across Pakistan.
                </p>
              </div>
            </div>
            <div className="story-visual">
              <div className="image-collage">
                <img 
                  src="https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=400&h=300&fit=crop&q=80" 
                  alt="Watch Collection" 
                  className="collage-img img-1"
                />
                <img 
                  src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop&q=80" 
                  alt="Luxury Watch" 
                  className="collage-img img-2"
                />
                <img 
                  src="https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=400&h=300&fit=crop&q=80" 
                  alt="Watch Details" 
                  className="collage-img img-3"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Journey</h2>
            <p>Milestones that shaped our story</p>
          </div>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="timeline-item" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="timeline-marker">
                  <div className="marker-dot"></div>
                  <div className="marker-year">{milestone.year}</div>
                </div>
                <div className="timeline-content">
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section" ref={teamRef}>
        <div className="container">
          <div className="section-header">
            <h2>Meet Our Team</h2>
            <p>The passionate people behind PrinceVibe</p>
          </div>
          
          {/* Desktop Team Grid */}
          <div className="team-grid desktop-team">
            {team.map((member, index) => (
              <div key={index} className="team-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                  <div className="image-overlay">
                    <div className="member-social">
                      <a href={member.social.linkedin} className="social-link">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.143 0 2.063.925 2.063 2.063 0 1.139-.92 2.065-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                      <a href={member.social.youtube} className="social-link">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </a>
                      <a href={member.social.tiktok} className="social-link">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-description">{member.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Team Carousel */}
          <div className="team-carousel mobile-team">
            <div className="carousel-container">
              <div 
                className="carousel-track"
                ref={teamCarouselRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  transform: `translateX(-${currentTeamIndex * 100}%)`
                }}
              >
                {team.map((member, index) => (
                  <div key={index} className="carousel-slide">
                    <div className="team-card">
                      <div className="member-image">
                        <img src={member.image} alt={member.name} />
                        <div className="image-overlay">
                          <div className="member-social">
                            <a href={member.social.linkedin} className="social-link">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.143 0 2.063.925 2.063 2.063 0 1.139-.92 2.065-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                            </a>
                            <a href={member.social.youtube} className="social-link">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                              </svg>
                            </a>
                            <a href={member.social.tiktok} className="social-link">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="member-info">
                        <h3>{member.name}</h3>
                        <p className="member-role">{member.role}</p>
                        <p className="member-description">{member.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Find Your Perfect Timepiece?</h2>
            <p>Explore our curated collection of luxury watches and discover the one that speaks to you.</p>
            <div className="cta-buttons">
              <button className="btn-primary" onClick={handleProductsNavigation}>
                Shop Collection
              </button>
              <button className="btn-secondary" onClick={() => navigate('/contact')}>
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 