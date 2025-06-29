import React, { useEffect } from 'react';
import './ReviewModal.scss';

const ReviewModal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (!isOpen) return;
    // Lock scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      // Restore scroll
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal" onClick={e => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal; 