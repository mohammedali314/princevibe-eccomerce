import React, { useState } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { 
  XMarkIcon, 
  HeartIcon,
  ShoppingBagIcon,
  TrashIcon 
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import './Wishlist.scss';

const Wishlist = ({ isOpen, onClose }) => {
  const { 
    wishlist, 
    wishlistItemsCount, 
    removeFromWishlist, 
    clearWishlist 
  } = useWishlist();

  const { addToCart } = useCart();

  const [isClearing, setIsClearing] = useState(false);

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      setIsClearing(true);
      setTimeout(() => {
        clearWishlist();
        setIsClearing(false);
      }, 300);
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    // Optional: Remove from wishlist after adding to cart
    // removeFromWishlist(item.id);
  };

  const formatPrice = (price) => {
    return `Rs.${price.toLocaleString()}.00`;
  };

  if (!isOpen) return null;

  return (
    <div className="wishlist-overlay" onClick={onClose}>
      <div className="wishlist-sidebar" onClick={(e) => e.stopPropagation()}>
        {/* Wishlist Header */}
        <div className="wishlist-header">
          <h2>
            <HeartIcon className="wishlist-icon" />
            My Wishlist ({wishlistItemsCount})
          </h2>
          <button className="close-btn" onClick={onClose}>
            <XMarkIcon />
          </button>
        </div>

        {/* Wishlist Content */}
        <div className="wishlist-content">
          {wishlist.items.length === 0 ? (
            <div className="empty-wishlist">
              <HeartIcon className="empty-icon" />
              <h3>Your wishlist is empty</h3>
              <p>Save your favorite watches for later!</p>
              <Link to="/products" className="shop-now-btn" onClick={onClose}>
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              {/* Wishlist Items */}
              <div className="wishlist-items">
                {wishlist.items.map((item) => (
                  <div key={item.id} className={`wishlist-item ${isClearing ? 'clearing' : ''}`}>
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="item-price">{formatPrice(item.price)}</p>
                      
                      {item.description && (
                        <p className="item-description">
                          {item.description.length > 60 
                            ? `${item.description.substring(0, 60)}...` 
                            : item.description
                          }
                        </p>
                      )}
                      
                      <div className="item-actions">
                        <button
                          className="add-to-cart-btn"
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingBagIcon />
                          Add to Cart
                        </button>
                        
                        <button
                          className="remove-btn"
                          onClick={() => removeFromWishlist(item.id)}
                          title="Remove from wishlist"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Wishlist Actions */}
              <div className="wishlist-actions">
                <button className="clear-wishlist-btn" onClick={handleClearWishlist}>
                  Clear Wishlist
                </button>
                
                <Link 
                  to="/products" 
                  className="continue-shopping-btn"
                  onClick={onClose}
                >
                  Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist; 