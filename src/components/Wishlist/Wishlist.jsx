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

  const { addToCart, getItemQuantity } = useCart();

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
    // Check if item is in stock
    if (!item.inStock) {
      alert(`Sorry! ${item.name} is currently out of stock.`);
      return;
    }

    // Check current quantity in cart
    const currentCartQuantity = getItemQuantity(item.id);
    const availableStock = item.quantity || 0;

    // Check if adding one more would exceed stock
    if (availableStock > 0 && currentCartQuantity >= availableStock) {
      alert(`Sorry! Only ${availableStock} units available in stock for ${item.name}. You already have ${currentCartQuantity} in your cart.`);
      return;
    }

    // Add to cart with explicit quantity of 1
    addToCart(item, 1);
    
    // Show success message
    const successMessage = `${item.name} has been added to your cart!`;
    // You can replace this with a toast notification if available
    console.log(successMessage);
    
    // Optional: Remove from wishlist after adding to cart
    // removeFromWishlist(item.id);
  };

  const formatPrice = (price) => {
    return `Rs.${price.toLocaleString()}.00`;
  };

  // Helper function to check if item can be added to cart
  const canAddToCart = (item) => {
    if (!item.inStock) return false;
    
    const currentCartQuantity = getItemQuantity(item.id);
    const availableStock = item.quantity || 0;
    
    return availableStock === 0 || currentCartQuantity < availableStock;
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
                {wishlist.items.map((item) => {
                  const currentCartQuantity = getItemQuantity(item.id);
                  const availableStock = item.quantity || 0;
                  const isAddable = canAddToCart(item);
                  
                  return (
                    <div key={item.id} className={`wishlist-item ${isClearing ? 'clearing' : ''}`}>
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
                        {!item.inStock && (
                          <div className="out-of-stock-badge">Out of Stock</div>
                        )}
                      </div>
                      
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p className="item-price">{formatPrice(item.price)}</p>
                        
                        {/* Stock status */}
                        <div className="stock-status">
                          {!item.inStock ? (
                            <span className="out-of-stock">Out of Stock</span>
                          ) : availableStock > 0 ? (
                            <span className="in-stock">
                              {currentCartQuantity > 0 
                                ? `${availableStock - currentCartQuantity} more available (${currentCartQuantity} in cart)`
                                : `${availableStock} available`
                              }
                            </span>
                          ) : (
                            <span className="in-stock">In Stock</span>
                          )}
                        </div>
                        
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
                            className={`add-to-cart-btn ${!isAddable ? 'disabled' : ''}`}
                            onClick={() => handleAddToCart(item)}
                            disabled={!isAddable}
                            title={
                              !item.inStock 
                                ? 'Out of stock' 
                                : !isAddable 
                                ? 'Maximum quantity in cart' 
                                : 'Add to cart'
                            }
                          >
                            <ShoppingBagIcon />
                            {!item.inStock 
                              ? 'Out of Stock' 
                              : !isAddable 
                              ? 'Max in Cart' 
                              : 'Add to Cart'
                            }
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
                  );
                })}
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