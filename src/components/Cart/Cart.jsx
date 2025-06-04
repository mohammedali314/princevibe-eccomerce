import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { 
  XMarkIcon, 
  PlusIcon, 
  MinusIcon,
  ShoppingBagIcon,
  TrashIcon 
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import './Cart.scss';

const Cart = ({ isOpen, onClose }) => {
  const { 
    cart, 
    cartTotal, 
    cartItemsCount, 
    removeFromCart, 
    updateQuantity, 
    clearCart 
  } = useCart();

  // Ensure cart is always an array
  const safeCart = Array.isArray(cart) ? cart : [];
  const safeCartTotal = typeof cartTotal === 'number' && !isNaN(cartTotal) ? cartTotal : 0;
  const safeCartItemsCount = typeof cartItemsCount === 'number' && !isNaN(cartItemsCount) ? cartItemsCount : 0;

  const [isClearing, setIsClearing] = useState(false);
  const [iconsLoaded, setIconsLoaded] = useState(false);

  useEffect(() => {
    // Check if icons are loaded properly
    const timer = setTimeout(() => {
      setIconsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setIsClearing(true);
      setTimeout(() => {
        clearCart();
        setIsClearing(false);
      }, 300);
    }
  };

  const formatPrice = (price) => {
    return `Rs.${price.toLocaleString()}.00`;
  };

  const calculateShipping = () => {
    return safeCartTotal > 50000 ? 0 : 500;
  };

  const calculateTax = () => {
    return Math.round(safeCartTotal * 0.1);
  };

  const calculateFinalTotal = () => {
    return safeCartTotal + calculateTax() + calculateShipping();
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
        {/* Cart Header */}
        <div className="cart-header">
          <h2>
            <ShoppingBagIcon className="cart-icon" />
            Shopping Cart ({safeCartItemsCount})
          </h2>
          <button className="close-btn" onClick={onClose}>
            <XMarkIcon />
          </button>
        </div>

        {/* Cart Content */}
        <div className="cart-content">
          {safeCart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBagIcon className="empty-icon" />
              <h3>Your cart is empty</h3>
              <p>Add some products to get started!</p>
              <Link to="/products" className="shop-now-btn" onClick={onClose}>
                Shop Now
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="cart-items">
                {safeCart.map((item) => (
                  <div key={item.id} className={`cart-item ${isClearing ? 'clearing' : ''}`}>
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="item-price">{formatPrice(item.price)}</p>
                      
                      <div className="quantity-controls">
                        <button
                          className="qty-btn minus-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          title="Decrease quantity"
                        >
                          <MinusIcon className="qty-icon" />
                          <span className="qty-text">−</span>
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          className="qty-btn plus-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          title="Increase quantity"
                        >
                          <PlusIcon className="qty-icon" />
                          <span className="qty-text">+</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="item-actions">
                      <div className="item-total">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove item"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(safeCartTotal)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Tax (10%):</span>
                  <span>{formatPrice(calculateTax())}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>{calculateShipping() === 0 ? 'FREE' : formatPrice(calculateShipping())}</span>
                </div>
                
                {safeCartTotal > 50000 && (
                  <div className="free-shipping-notice">
                    🎉 You qualify for free shipping!
                  </div>
                )}
                
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>{formatPrice(calculateFinalTotal())}</span>
                </div>
              </div>

              {/* Cart Actions */}
              <div className="cart-actions">
                <button className="clear-cart-btn" onClick={handleClearCart}>
                  Clear Cart
                </button>
                
                <Link 
                  to="/checkout" 
                  className="checkout-btn"
                  onClick={onClose}
                >
                  Proceed to Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart; 