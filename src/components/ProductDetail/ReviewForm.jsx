import React, { useState } from "react";
import "./ReviewForm.scss";

const MAX_IMAGES = 3;

export default function ReviewForm({ onSubmit, loading, error, success }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, MAX_IMAGES - images.length);
    setImages([...images, ...files]);
  };

  const removeImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    
    // Create FormData for multipart/form-data submission
    const formData = new FormData();
    formData.append('name', name);
    formData.append('text', text);
    formData.append('rating', rating);
    
    // Add images if any
    images.forEach((image, index) => {
      formData.append('images', image);
    });
    
    onSubmit(formData);
  };

  return (
    <form className="luxury-review-form" onSubmit={handleSubmit}>
      <div className="form-title">Write a Review</div>

      <div className="star-rating-input" aria-label="Star rating">
        {[1,2,3,4,5].map((star) => (
          <span
            key={star}
            className={`star${star <= rating ? " filled" : ""}`}
            onClick={() => setRating(star)}
            role="button"
            tabIndex={0}
            aria-label={`${star} star`}
            onKeyDown={e => (e.key === "Enter" || e.key === " ") && setRating(star)}
          >
            ★
          </span>
        ))}
      </div>

      <input
        className="review-name-input"
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={e => setName(e.target.value)}
        maxLength={32}
        required
      />

      <textarea
        className="review-textarea"
        placeholder="Write your review..."
        value={text}
        onChange={e => setText(e.target.value)}
        maxLength={400}
        required
      />

      <div className="image-upload-section">
        <label className="image-upload-label">
          <span className="upload-icon">📷</span>
          {images.length < MAX_IMAGES ? "+ Upload Images" : "Max images reached"}
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleImageChange}
            disabled={images.length >= MAX_IMAGES}
          />
        </label>
        <div className="image-preview-list">
          {images.map((img, idx) => (
            <div className="image-preview" key={idx}>
              <img src={URL.createObjectURL(img)} alt={`Preview ${idx+1}`} />
              <button
                type="button"
                className="remove-img-btn"
                onClick={() => removeImage(idx)}
                aria-label="Remove image"
              >×</button>
            </div>
          ))}
        </div>
      </div>

      {error && <div className="review-error-msg">{error}</div>}
      {success && <div className="review-success-msg">{success}</div>}

      <button
        className="submit-review-btn"
        type="submit"
        disabled={loading || !name || !text || !rating}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
} 