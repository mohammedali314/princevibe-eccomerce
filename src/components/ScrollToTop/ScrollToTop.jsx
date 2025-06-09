import React, { useState, useEffect } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import './ScrollToTop.scss';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = document.documentElement.scrollTop;
      const maxHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = (scrolled / maxHeight) * 100;
      
      setScrollProgress(scrollPercentage);
      setIsVisible(scrolled > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`scroll-to-top ${isVisible ? 'visible' : ''}`}>
      <button 
        onClick={scrollToTop}
        className="scroll-button"
        aria-label="Scroll to top"
      >
        <div className="progress-ring">
          <svg className="progress-svg" width="50" height="50">
            <circle
              className="progress-background"
              cx="25"
              cy="25"
              r="20"
              stroke="#e5e7eb"
              strokeWidth="2"
              fill="none"
            />
            <circle
              className="progress-circle"
              cx="25"
              cy="25"
              r="20"
              stroke="#000000"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 - (scrollProgress / 100) * 2 * Math.PI * 20}`}
            />
          </svg>
        </div>
        <ChevronUpIcon className="scroll-icon" />
      </button>
    </div>
  );
};

export default ScrollToTop; 