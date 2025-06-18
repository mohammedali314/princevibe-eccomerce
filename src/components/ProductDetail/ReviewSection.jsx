import React, { useState, useEffect } from 'react';
import ApiService from '../../services/api';
import './ReviewSection.scss';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/reviews/${productId}`);
      const data = await response.json();
      setReviews(data.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleStarHover = (star) => {
    setHoverRating(star);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !text.trim() || rating === 0) {
      setError('Please provide your name, a review, and a star rating.');
      return;
    }

    try {
      const reviewData = {
        productId,
        name,
        rating,
        text,
        date: new Date().toISOString()
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      await fetchReviews(); // Refresh reviews after submission
      
      setName('');
      setText('');
      setRating(0);
      setSuccess('Thank you for your review!');
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again later.');
    }
  };

  return (
    <div className="luxury-review-section">
      <h2 className="review-title">Customer Reviews</h2>
      <form className="review-form" onSubmit={handleSubmit}>
        <div className="star-rating">
          {[1,2,3,4,5].map((star) => (
            <span
              key={star}
              className={`star ${hoverRating >= star || rating >= star ? 'filled' : ''}`}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              onMouseLeave={handleStarLeave}
            >
              ★
            </span>
          ))}
        </div>
        <input
          className="review-name"
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <textarea
          className="review-text"
          placeholder="Write your review..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        {error && <div className="review-error">{error}</div>}
        {success && <div className="review-success">{success}</div>}
        <button className="review-submit" type="submit">Submit Review</button>
      </form>
      <div className="reviews-list">
        {isLoading ? (
          <div className="loading-reviews">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="no-reviews">No reviews yet. Be the first to review this product!</div>
        ) : (
          reviews.map((review) => (
            <div className="review-item" key={review._id}>
              <div className="review-header">
                <div className="review-avatar">
                  <UserCircleIcon className="profile-icon" />
                </div>
                <span className="reviewer-name">{review.name}</span>
                <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                <span className="review-stars">
                  {[1,2,3,4,5].map((star) => (
                    <span key={star} className={`star ${review.rating >= star ? 'filled' : ''}`}>★</span>
                  ))}
                </span>
              </div>
              <div className="review-text-display">{review.text}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection; 