import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CheckoutForm from './CheckoutForm';
import { 
  CheckCircleIcon,
  TruckIcon,
  ClockIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import './Checkout.scss';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartItemsCount } = useCart();
  const { isAuthenticated } = useAuth();
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-scroll to top when component loads
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoading && cartItemsCount === 0 && !orderComplete) {
      navigate('/');
    }
  }, [cartItemsCount, navigate, isLoading, orderComplete]);

  const handleOrderComplete = (order) => {
    setOrderData(order);
    setOrderComplete(true);
    
    // Scroll to top to show success message
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrder = () => {
    if (isAuthenticated) {
      navigate('/orders');
    } else {
      navigate('/');
    }
  };

  // Order Success Component
  const OrderSuccess = () => (
    <div className="order-success">
      <div className="success-container">
        <div className="success-header">
          <div className="success-icon">
            <CheckCircleIcon />
          </div>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for your purchase. Your order has been received and is being processed.</p>
        </div>

        {orderData && (
          <div className="order-details">
            <div className="order-info-card">
              <h3>Order Information</h3>
              <div className="order-info-grid">
                <div className="info-item">
                  <span className="label">Order Number:</span>
                  <span className="value">{orderData.orderNumber}</span>
                </div>
                <div className="info-item">
                  <span className="label">Total Amount:</span>
                  <span className="value">Rs. {orderData?.payment?.amount}</span>
                </div>
                <div className="info-item">
                  <span className="label">Payment Method:</span>
                  <span className="value">
                    {orderData.payment?.method === 'cod' ? 'Cash on Delivery' : 
                     orderData.payment?.method === 'card' ? 'Credit/Debit Card' :
                     orderData.payment?.method === 'bank_transfer' ? 'Bank Transfer' :
                     orderData.payment?.method === 'wallet' ? 'Digital Wallet' :
                     'Cash on Delivery'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Estimated Delivery:</span>
                  <span className="value">3-5 business days</span>
                </div>
              </div>
            </div>

            <div className="order-items-card">
              <h3>Order Items</h3>
              <div className="order-items-list">
                {orderData.items?.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="next-steps">
              <h3>What's Next?</h3>
              <div className="steps-grid">
                <div className="step">
                  <div className="step-icon">
                    <ClockIcon />
                  </div>
                  <div className="step-content">
                    <h4>Processing</h4>
                    <p>We're preparing your order for shipment</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-icon">
                    <TruckIcon />
                  </div>
                  <div className="step-content">
                    <h4>Shipping</h4>
                    <p>You'll receive tracking information via email</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-icon">
                    <ShoppingBagIcon />
                  </div>
                  <div className="step-content">
                    <h4>Delivery</h4>
                    <p>Your order will arrive in 3-5 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="success-actions">
          <button className="primary-btn" onClick={handleViewOrder}>
            {isAuthenticated ? 'View My Orders' : 'Go to Homepage'}
          </button>
          <button className="secondary-btn" onClick={handleContinueShopping}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );

  // If order is complete, show success page
  if (orderComplete) {
    return <OrderSuccess />;
  }

  // Main checkout page
  return (
    // <div className="checkout-page">
    //   <div className="checkout-header">
    //     <div className="container">
    //       <h1>Checkout</h1>
    //       <p>Complete your purchase securely</p>
    //     </div>
    //   </div>

      <div className="checkout-content">
        <CheckoutForm onOrderComplete={handleOrderComplete} />
      </div>
  );
};

export default Checkout; 