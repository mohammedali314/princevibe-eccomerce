import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  SparklesIcon, 
  HeartIcon, 
  ShieldCheckIcon, 
  TruckIcon,
  ClockIcon,
  StarIcon,
  UserGroupIcon,
  GlobeAltIcon,
  LightBulbIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import './About.scss';
import Aboutimage from '../../../public/photos/LOGO.jpeg';
import Arhamimage from '../../../public/photos/Arham.png';

const About = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const valuesRef = useRef(null);
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
      image: 'https://scontent.fisb6-1.fna.fbcdn.net/v/t39.30808-1/480757793_122192866754056775_7602379442959665743_n.jpg?stp=c0.338.1584.1584a_dst-jpg_s480x480_tt6&_nc_cat=101&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeHBBjz8SorrmTU9zrios206IejZqAIs2YAh6NmoAizZgAWrbSjxdOQul8MtKqBOn0IWF_0BjsbkBALJuWAqoiqM&_nc_ohc=PWY6ortaqeIQ7kNvwGbwhTz&_nc_oc=AdnrCh00Bh79L2JGe0IFGX1i9QEmBwsX0pBCp0a4Ig4h-QwQhyQvvN7DkmUbr1pl2H3-E6y9LU1ei1JFVFce2XZo&_nc_zt=24&_nc_ht=scontent.fisb6-1.fna&_nc_gid=ZMRoimr2xcSa4HrUBCyrBw&oh=00_AfIQiRM-i4pwehQ2qin8A6cHYOShS0Q2fNYZjlV3fmV58g&oe=683BEDA4',
      description: 'Visionary leader with 5+ years in luxury timepieces',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Arham',
      role: 'Founder & Social Media Manager',
      image: Arhamimage,
      description: 'Expert horologist specializing in vintage and luxury pieces',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Sarah Johnson',
      role: 'Customer Experience Director',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1b4?w=400&h=400&fit=crop&crop=face&q=80',
      description: 'Dedicated to ensuring exceptional customer satisfaction',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'David Chen',
      role: 'Product Specialist',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&q=80',
      description: 'Expert in luxury watch authentication and curation',
      social: { linkedin: '#', twitter: '#' }
    }
  ];

  const stats = [
    { number: '50K+', label: 'Happy Customers', icon: HeartIcon },
    { number: '10+', label: 'Premium Watches', icon: ClockIcon },
    { number: '100%', label: 'Satisfaction Rate', icon: StarIcon },
    { number: '24/7', label: 'Customer Support', icon: ShieldCheckIcon }
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

    const sections = [heroRef, statsRef, valuesRef, teamRef];
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

//   const values = [
//     {
//       icon: SparklesIcon,
//       title: 'Quality Excellence',
//       description: 'We source only the finest timepieces from renowned manufacturers, ensuring every watch meets our rigorous quality standards.',
//       gradient: 'from-purple-500 to-indigo-600'
//     },
//     {
//       icon: ShieldCheckIcon,
//       title: 'Trust & Authenticity',
//       description: 'Every watch comes with authenticity guarantees and comprehensive warranties, giving you complete peace of mind.',
//       gradient: 'from-indigo-500 to-cyan-600'
//     },
//     {
//       icon: HeartIcon,
//       title: 'Customer First',
//       description: 'Your satisfaction is our priority. We provide personalized service and support throughout your watch journey.',
//       gradient: 'from-pink-500 to-rose-600'
//     },
//     {
//       icon: LightBulbIcon,
//       title: 'Innovation',
//       description: 'We embrace the latest in horological innovation while respecting traditional craftsmanship and timeless design.',
//       gradient: 'from-amber-500 to-orange-600'
//     }
//   ];

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
                <span>Worldwide Shipping</span>
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

      {/* Stats Section */}
      <section className="stats-section" ref={statsRef}>
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="stat-icon">
                  <stat.icon />
                </div>
                <div className="stat-content">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
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
                  Born from a passion for exceptional timepieces, PrinceVibe began as a dream to make luxury watches accessible to discerning customers worldwide. Our founder, Prince Mohammed, envisioned a platform where horological excellence meets modern convenience.
                </p>
                <p>
                  What started as a small collection of carefully curated watches has grown into a global destination for timepiece enthusiasts. We believe that a watch is more than an accessory—it's a companion for life's most important moments.
                </p>
                <p>
                  Today, we continue to uphold our commitment to authenticity, quality, and exceptional customer service, serving thousands of satisfied customers across the globe.
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

      {/* Values Section */}
      {/* <section className="values-section" ref={valuesRef}>
        <div className="container">
          <div className="section-header">
            <h2>Our Values</h2>
            <p>The principles that guide everything we do</p>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className={`value-icon bg-gradient-to-r ${value.gradient}`}>
                  <value.icon />
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

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
                    <div className="social-links">
                      <a href={member.social.linkedin} className="social-link">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                      <a href={member.social.twitter} className="social-link">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
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
                          <div className="social-links">
                            <a href={member.social.linkedin} className="social-link">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                            </a>
                            <a href={member.social.twitter} className="social-link">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
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