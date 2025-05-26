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

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"></polyline>
    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
  </svg>
);

const ProductDetails = ({ onProductUpdated, onProductDeleted }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Load product details
  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await AdminApiService.getProduct(id);
      if (response.success) {
        setProduct(response.data);
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

  // Handle delete product
  const handleDeleteProduct = async () => {
    try {
      await AdminApiService.deleteProduct(id);
      onProductDeleted(id);
      navigate('/admin/products');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="product-details loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details error">
        <p>Product not found</p>
        <button onClick={() => navigate('/admin/products')} className="btn btn-primary">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-details">
      {/* Header */}
      <div className="product-details-header">
        <button 
          onClick={() => navigate('/admin/products')}
          className="back-btn"
        >
          <ArrowLeftIcon />
          Back to Products
        </button>

        <div className="header-actions">
          <button 
            onClick={() => navigate(`/admin/products/edit/${product._id}`)}
            className="btn btn-primary"
          >
            <EditIcon />
            Edit Product
          </button>
          <button 
            onClick={() => setDeleteConfirm(true)}
            className="btn btn-danger"
          >
            <DeleteIcon />
            Delete
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="product-content">
        {/* Images Section */}
        <div className="product-images">
          <div className="main-image">
            <img 
              src={product.images?.[selectedImage]?.url || '/placeholder-watch.jpg'} 
              alt={product.name}
            />
            {product.isFeatured && (
              <div className="featured-badge">
                <StarIcon />
                Featured
              </div>
            )}
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="image-thumbnails">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                >
                  <img src={image.url} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-meta">
              <span className="product-sku">SKU: {product.sku}</span>
              <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                {product.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="product-pricing">
            <div className="price-info">
              <span className="current-price">{formatPrice(product.price)}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="compare-price">{formatPrice(product.comparePrice)}</span>
              )}
            </div>
            
            <div className="stock-info">
              <span className={`stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                {product.quantity} units {product.inStock ? 'in stock' : 'out of stock'}
              </span>
            </div>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="product-features">
              <h3>Features</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && (
            <div className="product-specifications">
              <h3>Specifications</h3>
              <div className="spec-grid">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="spec-item">
                    <span className="spec-label">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="product-tags">
              <h3>Tags</h3>
              <div className="tags-list">
                {product.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* SEO Information */}
          {product.seo && (
            <div className="product-seo">
              <h3>SEO Information</h3>
              <div className="seo-item">
                <span className="seo-label">Meta Title:</span>
                <span className="seo-value">{product.seo.metaTitle || 'Not set'}</span>
              </div>
              <div className="seo-item">
                <span className="seo-label">Meta Description:</span>
                <span className="seo-value">{product.seo.metaDescription || 'Not set'}</span>
              </div>
              <div className="seo-item">
                <span className="seo-label">URL Slug:</span>
                <span className="seo-value">{product.seo.slug || product.slug}</span>
              </div>
            </div>
          )}

          {/* Product Stats */}
          <div className="product-stats">
            <h3>Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Views:</span>
                <span className="stat-value">{product.viewCount || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Sales:</span>
                <span className="stat-value">{product.salesCount || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Rating:</span>
                <span className="stat-value">{product.rating?.toFixed(1) || '0.0'} / 5.0</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Category:</span>
                <span className="stat-value">{product.category}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Created:</span>
                <span className="stat-value">{formatDate(product.createdAt)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Updated:</span>
                <span className="stat-value">{formatDate(product.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete "{product.name}"? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                onClick={() => setDeleteConfirm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteProduct}
                className="btn btn-danger"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails; 