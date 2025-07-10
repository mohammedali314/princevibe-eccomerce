import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  HeartIcon,
  ShoppingBagIcon,
  StarIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  EyeIcon,
  ShareIcon,
  PhotoIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  MinusIcon as MinusIconOutline,
  PlusIcon as PlusIconOutline
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartSolid, 
  StarIcon as StarSolid,
  PlusIcon as PlusIconSolid,
  MinusIcon as MinusIconSolid
} from '@heroicons/react/24/solid';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ApiService from '../../services/api';
import { trackEvent } from '../../services/metaPixel';
import './ProductDetail.scss';
import Products from '../Products/Products';
import CountdownTimer from './CountdownTimer';
import CompactReviewSection from './CompactReviewSection';
import VariantSelector from './VariantSelector';
import WhatsAppButton from '../WhatsApp/WhatsAppButton';

// Custom hook for throttled mouse movement
const useThrottledMousePosition = (delay = 16) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const lastUpdate = useRef(0);
  const throttleTimer = useRef(null);

  const updateMousePosition = useCallback((x, y) => {
    const now = Date.now();
    if (now - lastUpdate.current >= delay) {
      setMousePosition({ x, y });
      lastUpdate.current = now;
    }
  }, [delay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (throttleTimer.current) {
        cancelAnimationFrame(throttleTimer.current);
      }
    };
  }, []);

  return [mousePosition, updateMousePosition, throttleTimer];
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // All hooks must be called at the top level in the same order every time
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageZoom, setImageZoom] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(2.0);
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const imageRef = useRef(null);
  const zoomContainerRef = useRef(null);
  
  // Use throttled mouse position for better performance - must be called consistently
  const [mousePosition, updateMousePosition, throttleTimer] = useThrottledMousePosition(16); // ~60fps

  // Get cart and wishlist context
  const { addToCart, isItemInCart, getItemQuantity, isProductInCart, getProductQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Memoize the image style to prevent unnecessary re-renders
  const imageStyle = useMemo(() => ({
    transform: isZoomActive ? `scale(${zoomLevel})` : 'scale(1)',
    transformOrigin: isZoomActive ? `${mousePosition.x}% ${mousePosition.y}%` : 'center',
    transition: isZoomActive ? 'transform 0.05s ease-out' : 'transform 0.3s ease'
  }), [isZoomActive, zoomLevel, mousePosition.x, mousePosition.y]);

  // All useCallback hooks must be called at the top level
  const handleImageMouseMove = useCallback((e) => {
    if (!imageRef.current || !isZoomActive) return;

    // Throttle the mouse movement for better performance
    if (!throttleTimer.current) {
      throttleTimer.current = requestAnimationFrame(() => {
        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        updateMousePosition(x, y);
        throttleTimer.current = null;
      });
    }
  }, [isZoomActive, updateMousePosition, throttleTimer]);

  const handleImageMouseEnter = useCallback(() => {
    if (imageZoom) {
      setIsZoomActive(true);
    }
  }, [imageZoom]);

  const handleImageMouseLeave = useCallback(() => {
    setIsZoomActive(false);
  }, []);

  const toggleZoom = useCallback(() => {
    const newZoomState = !imageZoom;
    setImageZoom(newZoomState);
    setIsZoomActive(newZoomState);
  }, [imageZoom]);

  const handleZoomLevelChange = useCallback((newLevel) => {
    setZoomLevel(Math.max(1.5, Math.min(4, newLevel)));
  }, []);

  // Animate content on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to top when component mounts or product changes
  useEffect(() => {
    // Immediate scroll for better mobile experience
    window.scrollTo(0, 0);
    
    // Smooth scroll as backup
    const smoothScroll = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    };
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(smoothScroll, 100);
    
    return () => clearTimeout(timer);
  }, [id]); // Trigger when product ID changes

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
          trackEvent('ViewContent', {
            content_name: transformedResponse.data.name,
            content_ids: [transformedResponse.data.id],
            content_type: 'product',
            value: transformedResponse.data.price,
            currency: 'PKR'
          });
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

  // Fix: Always call hooks at the top level
  const [moreProducts, setMoreProducts] = useState([]);
  useEffect(() => {
    const fetchMoreProducts = async () => {
      try {
        // TEMP: Remove featured filter for testing
        const response = await ApiService.getProducts({ limit: 6 });
        const transformed = ApiService.transformResponse(response);
        // Exclude current product
        const filtered = (transformed.data || []).filter(p => p.id !== id).slice(0, 6);
        setMoreProducts(filtered);
      } catch (err) {
        setMoreProducts([]);
      }
    };
    fetchMoreProducts();
  }, [id]);

  // Show loading state
  if (loading) {
    return (
      <div className="product-detail-luxury loading">
        <div className="loading-container">
          <div className="luxury-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <p className="loading-text">Loading Masterpiece...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="product-detail-luxury error">
        <div className="error-container">
          <div className="error-icon">⚠</div>
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="luxury-btn primary">
            Return to Collection
          </button>
        </div>
      </div>
    );
  }

  // Show if no product found
  if (!product) {
    return (
      <div className="product-detail-luxury not-found">
        <div className="not-found-container">
          <div className="not-found-icon">🔍</div>
          <h3>Timepiece Not Found</h3>
          <p>The masterpiece you're seeking has moved to a different realm.</p>
          <button onClick={() => navigate('/')} className="luxury-btn primary">
            Explore Collection
          </button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (change) => {
    setQuantity(prev => {
      const newQuantity = prev + change;
      const maxQuantity = product?.quantity || 0;
      return Math.max(1, Math.min(newQuantity, maxQuantity));
    });
  };

  const handleAddToCart = () => {    
    if (isAddingToCart) return; // Prevent multiple clicks
    
    console.log('🛒 Starting add to cart process...');
    
    const currentStock = getCurrentStock();
    if (!product.inStock || currentStock <= 0) {
      console.log('❌ Product out of stock');
      showLuxuryToast('Product is currently out of stock', 'error');
      return;
    }

    const cartItemId = selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id;
    if (isItemInCart(product.id, selectedVariant?.id)) {
      console.log('⚠️ Product variant already in cart');
      const variantText = selectedVariant ? ` (${selectedVariant.colorName})` : '';
      showLuxuryToast(`Product${variantText} is already in your cart`, 'info');
      return;
    }

    if (product && quantity > 0) {
      console.log('🔄 Setting isAddingToCart to true');
      setIsAddingToCart(true);      
      try {
        const currentCartQuantity = getItemQuantity(product.id, selectedVariant?.id);
        const maxQuantity = currentStock;
        const availableToAdd = maxQuantity - currentCartQuantity;
        
        console.log('📊 Cart quantities:', {
          currentCartQuantity,
          maxQuantity,
          availableToAdd,
          requestedQuantity: quantity,
          variant: selectedVariant?.colorName || 'No variant'
        });
        
        if (availableToAdd <= 0) {
          console.log('❌ Maximum quantity already in cart');
          showLuxuryToast('Maximum quantity already in cart', 'error');
          return;
        }
        
        const quantityToAdd = Math.min(quantity, availableToAdd);
        console.log('➕ Adding to cart:', quantityToAdd);
        
        // Add to cart first
        addToCart(product, quantityToAdd, selectedVariant);
        
        // Then show success message
        const variantText = selectedVariant ? ` (${selectedVariant.colorName})` : '';
        showLuxuryToast(`Added ${quantityToAdd} ${quantityToAdd === 1 ? 'piece' : 'pieces'}${variantText} to cart`, 'success');
        setQuantity(1);

        trackEvent('AddToCart', {
          content_name: product.name,
          content_ids: [product.id],
          content_type: 'product',
          value: product.price * quantityToAdd,
          currency: 'PKR',
          quantity: quantityToAdd,
          variant: selectedVariant?.colorName || null
        });
      } catch (error) {
        console.error('❌ Error adding to cart:', error);
        showLuxuryToast('Failed to add item to cart', 'error');
      } finally {
        console.log('🔄 Setting isAddingToCart to false');
        setTimeout(() => {
          setIsAddingToCart(false);
        }, 500);
      }
    }
  };

  const handleBuyNow = () => {
    if (!product.inStock || product.quantity <= 0) {
      showLuxuryToast('Product is currently out of stock', 'error');
      return;
    }

    if (product && quantity > 0) {
      addToCart(product, quantity, selectedVariant);
      const variantText = selectedVariant ? ` (${selectedVariant.colorName})` : '';
      showLuxuryToast(`Redirecting to checkout${variantText}...`, 'success');
      
      // Scroll to top before navigation
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      
      // Small delay to allow scroll before navigation
      setTimeout(() => {
        navigate('/checkout');
      }, 300);
    }
  };

  const handleWishlistToggle = () => {
    
    if (isTogglingWishlist) return; // Prevent multiple clicks
    
    if (product) {
      setIsTogglingWishlist(true);

      try {
        const wasInWishlist = isInWishlist(product.id);
        toggleWishlist(product);
        
        if (wasInWishlist) {
          showLuxuryToast('Removed from wishlist', 'remove');
        } else {
          showLuxuryToast('Added to wishlist', 'wishlist');
        }
      } catch (error) {
        console.error('Error toggling wishlist:', error);
        showLuxuryToast('Failed to update wishlist', 'error');
      } finally {
        setTimeout(() => {
          setIsTogglingWishlist(false);
        }, 500);
      }
    }
  };

  const showLuxuryToast = (message, type = 'info') => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleCopyLink = async () => {
    const productUrl = `${window.location.origin}/product/${product.id}`;
    try {
      await navigator.clipboard.writeText(productUrl);
      showLuxuryToast('Product link copied to clipboard!', 'success');
      setIsShareModalOpen(false);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = productUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showLuxuryToast('Product link copied to clipboard!', 'success');
      setIsShareModalOpen(false);
    }
  };

  const handleSocialShare = (platform) => {
    const productUrl = `${window.location.origin}/product/${product.id}`;
    const productTitle = `Check out ${product.name} from Prince Vibe`;
    const productDescription = `Luxury timepiece: ${product.name} - ${formatPrice(product.price)}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}&quote=${encodeURIComponent(productDescription)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${productTitle} - ${productUrl}`)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(productTitle)}%20${encodeURIComponent(productDescription)}%20${encodeURIComponent(productUrl)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(productTitle)}&body=${encodeURIComponent(productDescription)}%20${encodeURIComponent(productUrl)}`;
        break;
      default:
        shareUrl = productUrl;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
      setIsShareModalOpen(false);
      showLuxuryToast(`Shared on ${platform}!`, 'success');
    }
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  const handleVariantChange = (variant) => {
    console.log('🔄 Variant changed:', variant);
    console.log('🖼️ Variant images:', variant?.images);
    console.log('📦 Current product images:', product?.images);
    setSelectedVariant(variant);
    setSelectedImage(0); // Reset to first image of the variant
  };

  // Get current images (either from selected variant or main product)
  const getCurrentImages = () => {
    if (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) {
      console.log('🎯 Using variant images:', selectedVariant.images);
      return selectedVariant.images;
    }
    console.log('🎯 Using product images:', product?.images || []);
    return product?.images || [];
  };

  // Get current stock (either from selected variant or main product)
  const getCurrentStock = () => {
    if (selectedVariant) {
      return selectedVariant.stock;
    }
    return product?.quantity || 0;
  };

  // Get product type for breadcrumb navigation
  const getProductType = (product) => {
    if (!product) return '⌚ Product';
    
    // Check for different product types/badges
    if (product.badge) {
      switch (product.badge.toLowerCase()) {
        case 'exclusive':
          return '👑 Exclusive';
        case 'limited edition':
        case 'limited':
          return '💎 Limited Edition';
        case 'new arrival':
        case 'new':
          return '✨ New Arrival';
        case 'best seller':
        case 'bestseller':
          return '🔥 Best Seller';
        case 'featured':
          return '⭐ Featured';
        case 'premium':
          return '🏆 Premium';
        case 'vintage':
          return '🕰️ Vintage';
        case 'classic':
          return '📿 Classic';
        default:
          return `⌚ ${product.badge}`;
      }
    }
    
    // Fallback based on price range for luxury classification
    if (product.price > 500000) return '👑 Exclusive';
    if (product.price > 300000) return '🏆 Premium';
    if (product.price > 150000) return '💫 Luxury';
    
    // Check if it's a trending/popular item based on rating and reviews
    if (product.rating >= 4.8 && product.reviews?.count > 50) return '🔥 Best Seller';
    if (product.rating >= 4.5 && product.reviews?.count > 20) return '⭐ Featured';
    if (product.rating >= 4.0) return '👍 Popular';
    
    // Check brand for classification
    const brandClassification = {
      'patek philippe': '👑 Exclusive',
      'rolex': '🏆 Premium',
      'omega': '💫 Luxury',
      'cartier': '👑 Exclusive',
      'breitling': '🏆 Premium',
      'tag heuer': '💫 Luxury',
      'tissot': '📿 Classic',
      'seiko': '👍 Popular'
    };
    
    if (product.name) {
      const productName = product.name.toLowerCase();
      for (const [brand, type] of Object.entries(brandClassification)) {
        if (productName.includes(brand)) {
          return type;
        }
      }
    }
    
    // Default fallback
    return '⌚ Timepiece';
  };

  const formatPrice = (price) => {
    return `Rs.${parseInt(price, 10)}`;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div key={i} className="star-container">
        {i < Math.floor(rating) ? 
          <StarSolid className="star filled" /> : 
          <StarIcon className="star" />
        }
      </div>
    ));
  };

  return (
    <div className={`product-detail-luxury ${isVisible ? 'visible' : ''}`}>
      {/* Hero Section with Breadcrumbs */}
      <div className="luxury-hero">
        <div className="hero-background"></div>
        <div className="container">
          <nav className="luxury-breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
            <ChevronRightIcon className="breadcrumb-separator" />
            <Link 
              to="/" 
              className="breadcrumb-link"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
                setTimeout(() => {
                  const productsSection = document.getElementById('products');
                  if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
            >
              Collection
            </Link>
            <ChevronRightIcon className="breadcrumb-separator" />
            <span className="breadcrumb-current">{getProductType(product)}</span>
          </nav>
          <button 
            className="back-button"
            onClick={() => {
              // Scroll to top before navigation
              window.scrollTo(0, 0);
              navigate(-1);
            }}
          >
            <ArrowLeftIcon />
            <span>Back to Collection</span>
          </button>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="luxury-product-section">
        <div className="container">
          <div className="product-grid">
            
            {/* Product Gallery */}
            <div className="product-gallery">
              <div className="main-image-container">
                <div 
                  className={`main-image ${imageZoom ? 'zoomed' : ''} ${isZoomActive ? 'zoom-active' : ''}`}
                  ref={zoomContainerRef}
                >
                  <img 
                    ref={imageRef}
                    src={getCurrentImages()[selectedImage]} 
                    alt={product.name}
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      console.error('Image failed to load:', e.target.src);
                      e.target.src = '/placeholder-image.jpg';
                    }}
                    onMouseMove={handleImageMouseMove}
                    onMouseEnter={handleImageMouseEnter}
                    onMouseLeave={handleImageMouseLeave}
                    style={imageStyle}
                  />
                  {product.badge && (
                    <div className="luxury-badge">
                      <span>{product.badge}</span>
                    </div>
                  )}
                  <button 
                    className="zoom-button"
                    onClick={toggleZoom}
                  >
                    {imageZoom ? <EyeIcon /> : <MagnifyingGlassIcon />}
                  </button>
              
                </div>
              </div>
              
              <div className="image-thumbnails">
                {getCurrentImages().map((image, index) => (
                  <div 
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedImage(index);
                      setImageZoom(false);
                      setIsZoomActive(false);
                    }}
                  >
                    <img src={image} alt={`${product.name} view ${index + 1}`} />
                    <div className="thumbnail-overlay"></div>
                  </div>
                ))}
              </div>

              {/* Image Counter */}
              <div className="image-counter">
                <PhotoIcon />
                <span>{selectedImage + 1} / {getCurrentImages().length}</span>
              </div>

              {/* Countdown Timer moved here */}
              <div className="countdown-timer-desktop">
                <CountdownTimer duration={{ minutes: 10, seconds: 0 }} />
              </div>
            </div>

            {/* Product Information */}
            <div className="product-info">
              <div className="product-header">
                {/* <div className="luxury-category">EXCLUSIVE EDITION</div> */}
                <h1 className="product-title">{product.name}</h1>
                {/* <p className="product-subtitle">Elevate Your Style</p> */}
                <div className="product-rating">
                  <div className="stars-container">
                  {renderStars(product.rating)}
                  </div>
                  <span className="rating-score">{product.rating}</span>
                 { console.log(product)}
                  
                  <span className="reviews-count">({product?.reviews || 0} reviews)</span>
                </div>
              </div>

              

              {/* Price Section */}
              <div className="price-section">
                <div className="price-container">
                  <div className="current-price" style={{ color: 'red' }}>{formatPrice(product.price)}</div>
                  {product.originalPrice && (
                    <div className="original-price">{formatPrice(product.originalPrice)}</div>
                  )}
                  {product.originalPrice && (
                    <div className="savings-badge">
                      <span className="save-amount">
                        Save Rs.{parseInt(product.originalPrice) - parseInt(product.price)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Variants - MOVED BACK UNDER PRICE */}
              {product.variants && product.variants.length > 0 && 
               product.variants.filter(variant => variant && variant.colorName && variant.colorName.trim() !== '').length > 0 && (
                <VariantSelector
                  variants={product.variants.filter(variant => variant && variant.colorName && variant.colorName.trim() !== '')}
                  selectedVariant={selectedVariant}
                  onVariantChange={handleVariantChange}
                  productName={product.name}
                />
              )}

              {/* Quantity & Stock */}
              <div className="quantity-section">
                <div className="section-header">
                  <label>Quantity</label>
                  <div className="stock-indicator">
                    <div className={`stock-dot ${product.inStock && getCurrentStock() > 0 ? 'in-stock' : 'out-stock'}`}></div>
                    <span>
                      {getCurrentStock() > 0 
                        ? `${getCurrentStock()} Pieces Left` 
                        : 'Out of stock'
                      }
                    </span>
                  </div>
                </div>
                
                <div className="quantity-controls">
                  <button 
                    className="qty-btn minus"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <MinusIconSolid className="icon" />
                  </button>
                  <div className="quantity-display">
                    <span className="qty-number">{quantity}</span>
                  </div>
                  <button 
                    className="qty-btn plus"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= getCurrentStock() || getCurrentStock() <= 0}
                  >
                    <PlusIconSolid className="icon" />
                  </button>
                </div>

                {isItemInCart(product.id, selectedVariant?.id) && (
                  <div className="cart-status">
                    <ShoppingBagIcon />
                    <span>{getItemQuantity(product.id, selectedVariant?.id)} already in cart</span>
                  </div>
                )}
              </div>

              {/* Place timer here for mobile */}
              <div className="countdown-timer-mobile">
                <CountdownTimer duration={{ minutes: 10, seconds: 0 }} />
              </div>

              {/* Action Buttons */}
              <div className="luxury-actions">
                <div className="primary-actions">
                <button 
                    className="luxury-btn primary-gold buy-now"
                    onClick={handleBuyNow}
                    disabled={!product.inStock || getCurrentStock() <= 0}
                >
                    <span>{getCurrentStock() <= 0 ? 'Out of Stock' : 'Buy with Cash on Delivery 🔥'}</span>
                </button>
                  
                <button 
                    className={`luxury-btn secondary add-to-cart ${isAddingToCart ? 'loading' : ''}`}
                    onClick={handleAddToCart}
                    disabled={!product.inStock || getCurrentStock() <= 0 || isItemInCart(product.id, selectedVariant?.id) || isAddingToCart}
                  >
                    <ShoppingBagIcon />
                    <span>
                      {getCurrentStock() <= 0 
                        ? 'Out of Stock'
                        : isAddingToCart 
                          ? 'Adding...' 
                          : isItemInCart(product.id, selectedVariant?.id) 
                            ? 'Already in Cart' 
                            : 'Add to Cart'
                      }
                    </span>
                    {isItemInCart(product.id, selectedVariant?.id) && !isAddingToCart && (
                      <div className="cart-badge">{getItemQuantity(product.id, selectedVariant?.id)}</div>
                    )}
                </button>
                </div>

                {/* <div className="secondary-actions">
                <button 
                    className={`wishlist-btn ${isInWishlist(product.id) ? 'active loved' : ''} ${isTogglingWishlist ? 'loading' : ''}`}
                    onClick={handleWishlistToggle}
                    disabled={isTogglingWishlist}
                  >
                    {isInWishlist(product.id) ? <HeartSolid /> : <HeartIcon />}
                    <span>
                      {isTogglingWishlist 
                        ? 'Updating...' 
                        : isInWishlist(product.id) 
                          ? 'Wishlisted' 
                          : 'Add to Wishlist'
                      }
                    </span>
                  </button>
                  
                  <button className="share-btn" onClick={handleShare}>
                    <ShareIcon />
                    <span>Share</span>
                </button>
                </div> */}
              </div>

              {/* Features & Countdown Timer Row */}
              <div className="luxury-features">
                <h4>Key Features</h4>
                <div className="features-grid">
                  {product.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <CheckBadgeIcon />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Guarantees */}
              <div className="luxury-guarantees">
                <div className="guarantee-item">
                  <ShieldCheckIcon />
                  <div>
                    <strong>2-Year Warranty</strong>
                    <span>International coverage</span>
                  </div>
                </div>
                <div className="guarantee-item">
                  <TruckIcon />
                  <div>
                    <strong>Free Shipping</strong>
                    <span>Worldwide delivery</span>
                  </div>
                </div>
                <div className="guarantee-item">
                  <ArrowPathIcon />
                  <div>
                    <strong>30-Day Returns</strong>
                    <span>Hassle-free policy</span>
                  </div>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>

      {/* Move review section here, above the tabs */}
      <div className="container">
        <CompactReviewSection productId={product.id} reviewCount={product.reviews} />
          </div>

      {/* Product Details Tabs */}
      <div className="luxury-tabs-section">
        <div className="container">
          <div className="tabs-container">
            <div className="tab-navigation">
              <button 
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
              </button>
              <button 
                className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
                onClick={() => setActiveTab('shipping')}
              >
                Shipping & Returns
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'description' && (
                <div className="tab-pane description">
                  <div className="description-content">
                    <h3>About This Timepiece</h3>
                    <ul className="description-bullets">
                      {product.description && product.description.split(/\||\n/).map((point, idx) => (
                        <li key={idx}>{point.trim()}</li>
                      ))}
                    </ul>
                    
                    {product.longDescription && (
                      <div className="extended-description">
                        <p>{product.longDescription}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div className="tab-pane specifications">
                  <div className="specs-content">
                    <h3>Technical Specifications</h3>
                    <div className="specs-grid">
                      {product.specifications && Object.entries(product.specifications).map(([key, value]) => {
                        // Skip customFields as it's handled separately
                        if (key === 'customFields') return null;
                        
                        // Skip if value is null, undefined, or empty string
                        if (!value || (typeof value === 'string' && value.trim() === '')) return null;
                        
                        // Handle different value types
                        let displayValue = value;
                        if (Array.isArray(value)) {
                          displayValue = value.join(', ');
                        } else if (typeof value === 'object') {
                          displayValue = JSON.stringify(value);
                        }
                        
                        return (
                          <div key={key} className="spec-item">
                            <CheckCircleIcon />
                            <div className="spec-content">
                              <span className="spec-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                              <span className="spec-value">{displayValue}</span>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Render custom fields separately */}
                      {product.specifications?.customFields && product.specifications.customFields.length > 0 && 
                        product.specifications.customFields.map((field, index) => (
                          <div key={`custom-${index}`} className="spec-item">
                            <CheckCircleIcon />
                            <div className="spec-content">
                              <span className="spec-label">{field.key}</span>
                              <span className="spec-value">{field.value}</span>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'shipping' && (
                <div className="tab-pane shipping">
                  <div className="shipping-content">
                    <h3>Shipping & Returns</h3>
                    
                    <div className="shipping-info">
                      <div className="shipping-section">
                        <h4>Shipping Information</h4>
                        <ul>
                          <li>
                            <CheckCircleIcon />
                            <span><strong>Free shipping</strong> on all orders within Pakistan</span>
                          </li>
                          <li>
                            <CheckCircleIcon />
                            <span><strong>2-3 business days</strong> for major cities (Karachi, Lahore, Islamabad)</span>
                          </li>
                          <li>
                            <CheckCircleIcon />
                            <span><strong>3-5 business days</strong> for other cities</span>
                          </li>
                          <li>
                            <CheckCircleIcon />
                            <span><strong>Express delivery</strong> available (additional charges apply)</span>
                          </li>
                          <li>
                            <CheckCircleIcon />
                            <span>All items are <strong>insured</strong> during transit</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="returns-section">
                        <h4>Returns Policy</h4>
                        <ul>
                          <li>
                            <CheckCircleIcon />
                            <span><strong>30-day return</strong> window from delivery date</span>
                          </li>
                          <li>
                            <CheckCircleIcon />
                            <span>Items must be in <strong>original condition</strong> with tags attached</span>
                          </li>
                          <li>
                            <CheckCircleIcon />
                            <span><strong>Free return pickup</strong> for defective items</span>
                          </li>
                          <li>
                            <CheckCircleIcon />
                            <span>Customer pays return shipping for change of mind</span>
                          </li>
                          <li>
                            <CheckCircleIcon />
                            <span>Refund processed within <strong>5-7 business days</strong></span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="warranty-section">
                        <h4>Warranty</h4>
                        <ul>
                          <li>
                            <CheckCircleIcon />
                            <span><strong>2-year international warranty</strong> included</span>
                          </li>
                          <li>
                            <CheckCircleIcon />
                            <span>Covers manufacturing defects</span>
                          </li>
                          <li>
                            <CheckCircleIcon />
                            <span>Authorized service centers nationwide</span>
                          </li>
                          <li>
                            <CheckCircleIcon />
                            <span>Water damage not covered under warranty</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="share-modal-overlay" onClick={closeShareModal}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="share-modal-header">
              <h3>Share This Product</h3>
              <button className="close-modal-btn" onClick={closeShareModal}>×</button>
            </div>
            
            <div className="share-modal-content">
              <div className="product-preview">
                <img src={getCurrentImages()[0]} alt={product.name} />
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p className="product-price">{formatPrice(product.price)}</p>
                </div>
              </div>
              
              <div className="share-options">
                <button className="share-option copy-link" onClick={handleCopyLink}>
                  <div className="share-icon">🔗</div>
                  <div className="share-text">
                    <span className="share-title">Copy Link</span>
                    <span className="share-description">Copy product link to clipboard</span>
                  </div>
                </button>
                
                <button className="share-option whatsapp" onClick={() => handleSocialShare('whatsapp')}>
                  <div className="share-icon">📱</div>
                  <div className="share-text">
                    <span className="share-title">WhatsApp</span>
                    <span className="share-description">Share via WhatsApp message</span>
                  </div>
                </button>
                
                <button className="share-option facebook" onClick={() => handleSocialShare('facebook')}>
                  <div className="share-icon">📘</div>
                  <div className="share-text">
                    <span className="share-title">Facebook</span>
                    <span className="share-description">Share on Facebook timeline</span>
                  </div>
                </button>

                <button className="share-option twitter" onClick={() => handleSocialShare('twitter')}>
                  <div className="share-icon">🐦</div>
                  <div className="share-text">
                    <span className="share-title">Twitter</span>
                    <span className="share-description">Tweet this product</span>
                  </div>
                </button>

                <button className="share-option email" onClick={() => handleSocialShare('email')}>
                  <div className="share-icon">📧</div>
                  <div className="share-text">
                    <span className="share-title">Email</span>
                    <span className="share-description">Share via email</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="luxury-toasts">
        {toasts.map((toast) => (
          <div key={toast.id} className={`luxury-toast ${toast.type}`}>
            <div className="toast-content">
              <div className="toast-icon">
                {toast.type === 'success' && <CheckCircleIcon />}
                {toast.type === 'error' && <ExclamationTriangleIcon />}
                {toast.type === 'wishlist' && <HeartSolid />}
                {toast.type === 'remove' && <HeartIcon />}
                {toast.type === 'info' && <ShoppingBagIcon />}
              </div>
              <span>{toast.message}</span>
            </div>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>×</button>
          </div>
        ))}
      </div>

      <div className="luxury-more-products-section">
        <h2 className="luxury-section-title">More Luxury Products</h2>
        <div className="luxury-products-scroll">
          {moreProducts.length === 0 ? (
            <div className="no-more-products" style={{ color: '#fff', textAlign: 'center', width: '100%' }}>
              No luxury products found.
            </div>
          ) : (
            moreProducts.map((p) => (
              <div className="luxury-product-card" key={p.id}>
                <div className="luxury-product-image">
                  <img src={p.image || (p.images && p.images[0])} alt={p.name} />
                </div>
                <div className="luxury-product-info">
                  <div className="luxury-product-name">{p.name}</div>
                  <div className="luxury-product-price">Rs.{p.price?.toLocaleString()}.00</div>
                  <Link to={`/product/${p.id}`} className="luxury-view-btn">View</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* WhatsApp Button - Only show when product is loaded */}
      {product && (
        <WhatsAppButton
          productName={product.name}
          productPrice={formatPrice(product.price)}
          productUrl={window.location.href}
        />
      )}
    </div>
  );
};

export default ProductDetail;