import React, { useState, useEffect, useRef } from 'react';
import { 
  PlayIcon,
  ArrowRightIcon,
  SparklesIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
import BannerVideo from '../../assets/banner.MP4';
import BannerVid from '../../assets/bannervid.mp4';
import Banner3 from '../../assets/banner3.webm';
import './Hero.scss';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRefs = useRef([]);

  const slides = [
    {
      id: 1,
      video: BannerVideo,
      badge: "CRAFTED",
      title: "Luxury Timepieces",
      subtitle: "Where Excellence Meets Innovation",
      tagline: "Swiss Precision • Premium Materials • Timeless Design",
      cta: "Explore Collection"
    },
    {
      id: 2,
      video: BannerVid,
      badge: "INNOVATION",
      title: "Smart Collection",
      subtitle: "The Future of Luxury Watches",
      tagline: "Advanced Technology • Elegant Design • Superior Quality",
      cta: "View Catalog"
    },
    {
      id: 3,
      video: Banner3,
      badge: "EXCLUSIVE",
      title: "Signature Series",
      subtitle: "Handcrafted Perfection",
      tagline: "Limited Edition • Artisan Crafted • Collector's Choice",
      cta: "Discover More"
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
      if (video) {
        if (index === currentSlide) {
          video.play().catch(console.error);
        } else {
          video.pause();
        }
      }
    });
  }, [currentSlide]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className={`hero ${isLoaded ? 'loaded' : ''}`}>
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <video
              className="hero-video"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              ref={(el) => (videoRefs.current[index] = el)}
              onLoadedData={() => {
                // Video is ready to play
                if (index === currentSlide && videoRefs.current[index]) {
                  videoRefs.current[index].play().catch(console.error);
                }
              }}
            >
              <source src={slide.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
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
                  <button className="cta-primary">
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