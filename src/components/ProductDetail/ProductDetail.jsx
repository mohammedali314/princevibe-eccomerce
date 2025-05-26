import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  HeartIcon,
  ShoppingBagIcon,
  StarIcon,
  MinusIcon,
  PlusIcon,
  ArrowLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import ApiService from '../../services/api';
import './ProductDetail.scss';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await ApiService.getProduct(id);
        const transformedResponse = ApiService.transformResponse(response);
        
        if (transformedResponse.data) {
          setProduct(transformedResponse.data);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Redirect if product not found after loading
  useEffect(() => {
    if (!loading && !product && !error) {
      navigate('/');
    }
  }, [product, loading, error, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="product-detail loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="product-detail error">
        <div className="error-container">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/')}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Show if no product found
  if (!product) {
    return (
      <div className="product-detail not-found">
        <div className="not-found-container">
          <h3>Product not found</h3>
          <p>The product you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    console.log(`Added ${quantity} x ${product.name} to cart`);
    // Add to cart logic here
  };

  const handleBuyNow = () => {
    console.log(`Buy now: ${quantity} x ${product.name}`);
    // Buy now logic here
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const formatPrice = (price) => {
    return `Rs.${price.toLocaleString()}.00`;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`star ${i < Math.floor(rating) ? 'filled' : ''}`}
      />
    ));
  };

  return (
    <div className="product-detail">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <ChevronRightIcon className="breadcrumb-arrow" />
          <Link to="/" className="breadcrumb-link">All Products</Link>
          <ChevronRightIcon className="breadcrumb-arrow" />
          <span className="breadcrumb-current">{product.name}</span>
        </div>
      </div>

      {/* Product Content */}
      <div className="product-content">
        <div className="container">
          <div className="product-layout">
            {/* Product Images */}
            <div className="product-images">
              <div className="main-image">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name}
                  className="main-product-image"
                />
                {product.badge && (
                  <div className="product-badge">{product.badge}</div>
                )}
              </div>
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info">
              <h1 className="product-title">{product.name}</h1>
              
              {/* Rating */}
              <div className="product-rating">
                <div className="stars">
                  {renderStars(product.rating)}
                </div>
                <span className="rating-text">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="product-pricing">
                <span className="current-price">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="original-price">{formatPrice(product.originalPrice)}</span>
                )}
              </div>

              {/* Features */}
              <div className="product-features">
                {product.features.map((feature, index) => (
                  <span key={index} className="feature-tag">{feature}</span>
                ))}
              </div>

              {/* Quantity Selector */}
              <div className="quantity-section">
                <label className="quantity-label">Quantity</label>
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <MinusIcon />
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="product-actions">
                <button 
                  className="btn btn-primary add-to-cart"
                  onClick={handleAddToCart}
                >
                  Add to cart
                </button>
                <button 
                  className="btn btn-secondary buy-now"
                  onClick={handleBuyNow}
                >
                  Buy it now
                </button>
                <button 
                  className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
                  onClick={toggleWishlist}
                >
                  {isWishlisted ? <HeartSolid /> : <HeartIcon />}
                </button>
              </div>

              {/* Product Status */}
              <div className="product-status">
                <div className="status-item">
                  <span className="status-label">Availability:</span>
                  <span className={`status-value ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Shipping:</span>
                  <span className="status-value">{product.shipping}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Warranty:</span>
                  <span className="status-value">{product.warranty}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="product-tabs">
            <div className="tab-headers">
              <button 
                className={`tab-header ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Product description
              </button>
              <button 
                className={`tab-header ${activeTab === 'specifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
              </button>
              <button 
                className={`tab-header ${activeTab === 'shipping' ? 'active' : ''}`}
                onClick={() => setActiveTab('shipping')}
              >
                Shipping & Return
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'description' && (
                <div className="description-content">
                  <p>{product.description}</p>
                  <h4>Key Features:</h4>
                  <ul>
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="specifications-content">
                  <h4>Technical Specifications</h4>
                  <table className="specs-table">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key}>
                          <td className="spec-label">{key}</td>
                          <td className="spec-value">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="shipping-content">
                  <h4>Shipping Information</h4>
                  <p><strong>Free Shipping:</strong> Available for orders within Pakistan</p>
                  <p><strong>Delivery Time:</strong> 2-5 business days</p>
                  <p><strong>Express Delivery:</strong> Available in major cities (1-2 days)</p>
                  
                  <h4>Return Policy</h4>
                  <p><strong>Return Window:</strong> 30 days from delivery</p>
                  <p><strong>Condition:</strong> Items must be in original condition</p>
                  <p><strong>Return Shipping:</strong> Free for defective items</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 