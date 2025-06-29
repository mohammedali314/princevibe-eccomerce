import React, { useEffect, useState, useRef } from 'react';
import { StarIcon as StarSolid, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import ReviewModal from './ReviewModal';
import ReviewForm from './ReviewForm';
import './CompactReviewSection.scss';

const CompactReviewSection = ({ productId, reviewCount }) => {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Fetch reviews from backend
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/reviews/${productId}`);
        const data = await res.json();
        console.log('Fetched reviews:', data);
        setReviews(data.data || []);
        if (data.data && data.data.length) {
          setAverage(
            data.data.reduce((sum, r) => sum + (r.rating || 0), 0) / data.data.length
          );
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, [productId]);

  // Pause on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Use reviewCount prop if provided, otherwise fallback to reviews.length
  const displayReviewCount = typeof reviewCount === 'number' ? reviewCount : reviews.length;

  // Handle review submission
  const handleReviewSubmit = async (formData) => {
    try {
      // Add productId to the FormData
      formData.append('productId', productId);
      
      // Post to API using FormData
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/reviews`, {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }
      
      const data = await res.json();
      if (data && data.data) {
        setReviews(prev => [data.data, ...prev]);
        setAverage(
          ([data.data, ...reviews]).reduce((sum, r) => sum + (r.rating || 0), 0) / ([data.data, ...reviews]).length
        );
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="compact-review-section">
      <div className="review-summary-row">
        <span className="review-average">
          <StarSolid className="star" />
          {average && reviews.length ? average.toFixed(1) : '-'}
        </span>
        <span className="review-count">
          {displayReviewCount} (reviews{displayReviewCount !== 1})
        </span>
        <button className="write-review-btn" onClick={() => setModalOpen(true)}>Write a Review</button>
      </div>
      {/* Pure CSS infinite scroll carousel */}
      <div className="review-carousel-container">
        <div
          className="review-carousel infinite-scroll"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`carousel-track${isPaused ? ' paused' : ''}`}>
            {reviews.length > 0 ? (
              // Use real reviews from backend, duplicate them for infinite scroll effect
              [...reviews, ...reviews].map((review, idx) => (
                <div className="carousel-review-card" key={`${review._id || idx}-${idx}`}>
                  <div className="carousel-review-stars">
                    {[...Array(review.rating)].map((_, i) => (
                      <StarSolid key={i} className="star filled" />
                    ))}
                  </div>
                  <div className="carousel-review-text">{review.text}</div>
                  {review.images && review.images.length > 0 && (
                    <div className="carousel-review-images">
                      {review.images.map((img, i) => (
                        <img key={i} src={img} alt="review" className="carousel-review-img-thumb" />
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              // Show placeholder when no reviews
              <div className="carousel-review-card no-reviews">
                <div className="carousel-review-text">No reviews yet. Be the first to review this product!</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ReviewModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <ReviewForm productId={productId} onSubmit={handleReviewSubmit} onCancel={() => setModalOpen(false)} />
      </ReviewModal>
    </div>
  );
};

export default CompactReviewSection; 