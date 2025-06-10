import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminApiService from '../../../services/adminApi';

// SVG Icons
const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="19,12 5,12"></polyline>
    <polyline points="12,19 5,12 12,5"></polyline>
  </svg>
);

const SaveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19,21H5a2,2,0,0,1-2-2V5a2,2,0,0,1,2-2H14l5,5V19A2,2,0,0,1,19,21Z"></path>
    <polyline points="17,21 17,13 7,13 7,21"></polyline>
    <polyline points="7,3 7,8 15,8"></polyline>
  </svg>
);

const ImageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21,15 16,10 5,21"></polyline>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"></polyline>
    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const ProductEdit = ({ onProductUpdated, onCancel }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    category: '',
    sku: '',
    quantity: '',
    rating: 0,
    reviews: 0,
    inStock: true,
    isFeatured: false,
    isActive: true,
    features: [''],
    tags: [''],
    specifications: {
      brand: '',
      model: '',
      movement: '',
      caseMaterial: '',
      dialColor: '',
      strapMaterial: '',
      waterResistance: '',
      warranty: ''
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      slug: ''
    }
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // Load product data
  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await AdminApiService.getProduct(id);
      
      if (response.success) {
        const product = response.data;
        
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          comparePrice: product.comparePrice || '',
          category: product.category || '',
          sku: product.sku || '',
          quantity: product.quantity || '',
          rating: product.rating || 0,
          reviews: product.reviews?.count || 0,
          inStock: product.inStock || false,
          isFeatured: product.isFeatured || false,
          isActive: product.isActive || true,
          features: product.features && product.features.length > 0 ? product.features : [''],
          tags: product.tags && product.tags.length > 0 ? product.tags : [''],
          specifications: {
            brand: product.specifications?.brand || '',
            model: product.specifications?.model || '',
            movement: product.specifications?.movement || '',
            caseMaterial: product.specifications?.caseMaterial || '',
            dialColor: product.specifications?.dialColor || '',
            strapMaterial: product.specifications?.strapMaterial || '',
            waterResistance: product.specifications?.waterResistance || '',
            warranty: product.specifications?.warranty || ''
          },
          seo: {
            metaTitle: product.seo?.metaTitle || '',
            metaDescription: product.seo?.metaDescription || '',
            slug: product.seo?.slug || product.slug || ''
          }
        });
        
        setExistingImages(product.images || []);
      } else {
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle nested object changes
  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle array changes
  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  // Add array item
  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  // Remove array item
  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Handle new image uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  // Remove new image
  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Mark existing image for deletion
  const removeExistingImage = (imageId) => {
    setImagesToDelete(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(img => img.public_id !== imageId));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      console.log('=== Product Edit Debug ===');
      console.log('Current formData:', formData);
      console.log('Rating value:', formData.rating, 'Type:', typeof formData.rating);
      
      // Prepare form data
      const productFormData = new FormData();
      
      // Add basic product data
      Object.keys(formData).forEach(key => {
        console.log(`Adding field ${key}:`, formData[key], 'Type:', typeof formData[key]);
        
        if (key === 'features' || key === 'tags') {
          // Filter out empty strings
          const filteredArray = formData[key].filter(item => item.trim() !== '');
          productFormData.append(key, JSON.stringify(filteredArray));
        } else if (key === 'specifications' || key === 'seo') {
          productFormData.append(key, JSON.stringify(formData[key]));
        } else {
          productFormData.append(key, formData[key]);
        }
      });
      
      // Add new images
      images.forEach((image, index) => {
        productFormData.append('images', image);
      });
      
      // Add images to delete
      if (imagesToDelete.length > 0) {
        productFormData.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }
      
      // Add existing images to keep
      const existingImageIds = existingImages.map(img => img.public_id);
      productFormData.append('existingImages', JSON.stringify(existingImageIds));
      
      // Debug FormData contents
      console.log('=== FormData Contents ===');
      for (let [key, value] of productFormData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const response = await AdminApiService.updateProduct(id, productFormData);
      
      console.log('Update response:', response);
      
      if (response.success) {
        console.log('Updated product rating:', response.data.rating);
        onProductUpdated(response.data);
        navigate('/admin/products');
      } else {
        console.error('Update failed:', response.message);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="product-edit loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-edit">
      {/* Header */}
      <div className="product-edit-header">
        <button 
          onClick={() => navigate('/admin/products')}
          className="back-btn"
        >
          <ArrowLeftIcon />
          Back to Products
        </button>
        <h1>Edit Product</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="product-form">
        {/* Basic Information */}
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="sku">SKU *</label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                <option value="luxury">Luxury</option>
                <option value="sport">Sport</option>
                <option value="classic">Classic</option>
                <option value="vintage">Vintage</option>
              </select>
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                required
              />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="form-section">
          <h2>Pricing & Inventory</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="comparePrice">Compare Price</label>
              <input
                type="number"
                id="comparePrice"
                name="comparePrice"
                value={formData.comparePrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="rating">Product Rating</label>
              <div className="input-with-icon">
                <StarIcon />
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={(e) => {
                    const value = Math.min(5, Math.max(0, parseFloat(e.target.value) || 0));
                    setFormData(prev => ({ ...prev, rating: value }));
                  }}
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
              <small style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                Rating from 0 to 5 stars (e.g., 4.5)
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="reviews">Number of Reviews</label>
              <div className="input-with-icon">
                <StarIcon />
                <input
                  type="number"
                  id="reviews"
                  name="reviews"
                  value={formData.reviews}
                  onChange={(e) => {
                    const value = Math.max(0, parseInt(e.target.value) || 0);
                    setFormData(prev => ({ ...prev, reviews: value }));
                  }}
                  min="0"
                  placeholder="0"
                />
              </div>
              <small style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                Total number of customer reviews (e.g., 25)
              </small>
            </div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                  />
                  In Stock
                </label>
                
                <label>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                  />
                  Featured Product
                </label>
                
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  Active
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="form-section">
          <h2>Product Images</h2>
          
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="existing-images">
              <h3>Current Images</h3>
              <div className="image-grid">
                {existingImages.map((image, index) => (
                  <div key={image.public_id} className="image-preview">
                    <img src={image.url} alt={`Product ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image.public_id)}
                      className="remove-image"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* New Images */}
          <div className="form-group">
            <label htmlFor="images">Upload New Images</label>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
            
            {images.length > 0 && (
              <div className="image-grid">
                {images.map((image, index) => (
                  <div key={index} className="image-preview">
                    <img src={URL.createObjectURL(image)} alt={`New ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="remove-image"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="form-section">
          <h2>Features</h2>
          
          {formData.features.map((feature, index) => (
            <div key={index} className="array-input">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleArrayChange('features', index, e.target.value)}
                placeholder={`Feature ${index + 1}`}
              />
              {formData.features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('features', index)}
                  className="remove-btn"
                >
                  <TrashIcon />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addArrayItem('features')}
            className="add-btn"
          >
            Add Feature
          </button>
        </div>

        {/* Tags */}
        <div className="form-section">
          <h2>Tags</h2>
          
          {formData.tags.map((tag, index) => (
            <div key={index} className="array-input">
              <input
                type="text"
                value={tag}
                onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                placeholder={`Tag ${index + 1}`}
              />
              {formData.tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('tags', index)}
                  className="remove-btn"
                >
                  <TrashIcon />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addArrayItem('tags')}
            className="add-btn"
          >
            Add Tag
          </button>
        </div>

        {/* Specifications */}
        <div className="form-section">
          <h2>Specifications</h2>
          
          <div className="form-grid">
            {Object.entries(formData.specifications).map(([key, value]) => (
              <div key={key} className="form-group">
                <label htmlFor={key}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                <input
                  type="text"
                  id={key}
                  value={value}
                  onChange={(e) => handleNestedChange('specifications', key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* SEO */}
        <div className="form-section">
          <h2>SEO Information</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="metaTitle">Meta Title</label>
              <input
                type="text"
                id="metaTitle"
                value={formData.seo.metaTitle}
                onChange={(e) => handleNestedChange('seo', 'metaTitle', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="slug">URL Slug</label>
              <input
                type="text"
                id="slug"
                value={formData.seo.slug}
                onChange={(e) => handleNestedChange('seo', 'slug', e.target.value)}
              />
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="metaDescription">Meta Description</label>
              <textarea
                id="metaDescription"
                value={formData.seo.metaDescription}
                onChange={(e) => handleNestedChange('seo', 'metaDescription', e.target.value)}
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="btn btn-secondary"
            disabled={submitting}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <div className="spinner small"></div>
                Updating...
              </>
            ) : (
              <>
                <SaveIcon />
                Update Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit; 