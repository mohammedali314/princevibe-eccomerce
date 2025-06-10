import React, { useState, useEffect, useRef } from 'react';
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
  const videoRefs = useRef([]);

  const slides = [
    {
      id: 1,
      video: "/videos/banner.MP4",
      fallbackImage: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1920&h=1080&fit=crop&q=80",
      badge: "CRAFTED",
      title: "Luxury Timepieces",
      subtitle: "Where Excellence Meets Innovation",
      tagline: "Swiss Precision • Premium Materials • Timeless Design",
      cta: "Explore Collection"
    },
    {
      id: 2,
      image: "/photos/Banner3.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920&h=1080&fit=crop&q=80",
      badge: "INNOVATION",
      title: "Smart Collection",
      subtitle: "The Future of Luxury Watches",
      tagline: "Advanced Technology • Elegant Design • Superior Quality",
      cta: "View Catalog"
    },
    {
      id: 3,
      video: "/videos/banner3.webm",
      fallbackImage: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=1920&h=1080&fit=crop&q=80",
      badge: "EXCLUSIVE",
      title: "Signature Series",
      subtitle: "Handcrafted Perfection",
      tagline: "Limited Edition • Artisan Crafted • Collector's Choice",
      cta: "New Arrivals"
    },
    {
      id: 4,
      image: "/photos/Banner2.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=1920&h=1080&fit=crop&q=80",
      badge: "PRESTIGE",
      title: "Master Collection",
      subtitle: "Timeless Elegance Redefined",
      tagline: "Heritage Craftsmanship • Precious  • Exceptional Quality",
      cta: "Luxury Collection"
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // Manage video playback based on current slide
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video && slides[index].video) {
        if (index === currentSlide) {
          video.play().catch(console.error);
        } else {
          video.pause();
        }
      }
    });
  }, [currentSlide, slides]);

  const handleCTAClick = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleVideoError = (index) => {
    // If video fails to load, we'll show the fallback image
    console.warn(`Video failed to load for slide ${index}, using fallback image`);
  };

  const handleImageError = (e, slide) => {
    // If image fails to load, use fallback
    e.target.src = slide.fallbackImage;
  };

  return (
    <section id="hero" className={`hero ${isLoaded ? 'loaded' : ''}`}>
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          >
            {slide.video ? (
              <>
                <video
                  className="hero-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  ref={(el) => (videoRefs.current[index] = el)}
                  onError={() => handleVideoError(index)}
                  onLoadedData={() => {
                    // Video is ready to play
                    if (index === currentSlide && videoRefs.current[index]) {
                      videoRefs.current[index].play().catch(console.error);
                    }
                  }}
                >
                  <source src={slide.video} type={slide.video.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
                  Your browser does not support the video tag.
                </video>
                <img
                  className="hero-image fallback-image"
                  src={slide.fallbackImage}
                  alt={slide.title}
                  style={{ display: 'none' }}
                  onLoad={(e) => {
                    // Show fallback image if video doesn't load
                    const video = videoRefs.current[index];
                    if (video && video.error) {
                      e.target.style.display = 'block';
                      video.style.display = 'none';
                    }
                  }}
                />
              </>
            ) : (
              <img
                className="hero-image"
                src={slide.image}
                alt={slide.title}
                onError={(e) => handleImageError(e, slide)}
              />
            )}
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

                <div className="tagline-section">
                  <p>{slide.tagline}</p>
                </div>

                <div className="cta-section">
                  <button className="cta-primary" onClick={handleCTAClick}>
                    <span>{slide.cta}</span>
                    <ArrowRightIcon />
                  </button>
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
    </section>
  );
};

export default Hero;