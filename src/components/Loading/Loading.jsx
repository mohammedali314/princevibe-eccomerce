import React from 'react';
import './Loading.scss';

const Loading = ({ isVisible, onComplete }) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete && onComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-container">
        {/* Background Animation */}
        <div className="loading-bg">
          <div className="orbit orbit-1"></div>
          <div className="orbit orbit-2"></div>
          <div className="orbit orbit-3"></div>
        </div>

        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-wrapper">
            <img 
              src="/logo.png" 
              alt="PrinceVibe" 
              className="loading-logo"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML += '<span class="loading-logo-text">PrinceVibe</span>';
              }}
            />
          </div>
          
          {/* Loading Dots */}
          <div className="loading-dots">
            <div className="dot dot-1"></div>
            <div className="dot dot-2"></div>
            <div className="dot dot-3"></div>
          </div>
        </div>

        {/* Loading Bar */}
        <div className="loading-bar-container">
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="loading-text">
          <span className="main-text">Loading PrinceVibe</span>
          <span className="sub-text">Crafting Excellence...</span>
        </div>

        {/* Sparkle Effects */}
        <div className="sparkles">
          <div className="sparkle sparkle-1">✨</div>
          <div className="sparkle sparkle-2">⭐</div>
          <div className="sparkle sparkle-3">✨</div>
          <div className="sparkle sparkle-4">💎</div>
          <div className="sparkle sparkle-5">⭐</div>
          <div className="sparkle sparkle-6">✨</div>
        </div>
      </div>
    </div>
  );
};

export default Loading; 