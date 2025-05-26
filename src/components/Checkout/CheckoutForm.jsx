import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { 
  CreditCardIcon,
  TruckIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import './CheckoutForm.scss';

const CheckoutForm = ({ onOrderComplete }) => {
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    // Customer Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Shipping Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
    
    // Payment
    paymentMethod: 'cod',
    
    // Special Instructions
    notes: ''
  });

  const paymentMethods = [
    { id: 'cod', name: 'Cash on Delivery', icon: TruckIcon, desc: 'Pay when you receive your order' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCardIcon, desc: 'Pay securely with your card' },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: CreditCardIcon, desc: 'Direct bank transfer' },
    { id: 'wallet', name: 'Digital Wallet', icon: CreditCardIcon, desc: 'JazzCash, EasyPaisa' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 
      'address', 'city', 'state', 'zipCode'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
      }
    });
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[0-9\-\(\)\s]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare order data
      const orderData = {
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country
          }
        },
        items: cart.items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          sku: item.sku || 'N/A'
        })),
        summary: {
          subtotal: cartTotal,
          tax: Math.round(cartTotal * 0.1), // 10% tax
          shipping: cartTotal > 50000 ? 0 : 500, // Free shipping over Rs. 50,000
          discount: 0,
          total: cartTotal + Math.round(cartTotal * 0.1) + (cartTotal > 50000 ? 0 : 500)
        },
        payment: {
          method: formData.paymentMethod,
          status: 'pending'
        },
        notes: {
          customer: formData.notes
        }
      };
      
      // Create order via API
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://princevibe-eccomerce-backend-production.up.railway.app/api'}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Clear cart and show success
        clearCart();
        onOrderComplete(result.data);
      } else {
        throw new Error(result.message || 'Failed to create order');
      }
      
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const subtotal = cartTotal;
    const tax = Math.round(subtotal * 0.1);
    const shipping = subtotal > 50000 ? 0 : 500;
    return subtotal + tax + shipping;
  };

  const formatPrice = (price) => {
    return `Rs.${price.toLocaleString()}.00`;
  };

  return (
    <div className="checkout-form">
      <div className="checkout-container">
        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          
          <div className="order-items">
            {cart.items.map(item => (
              <div key={item.id} className="order-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>Qty: {item.quantity}</p>
                </div>
                <div className="item-price">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="total-row">
              <span>Tax (10%):</span>
              <span>{formatPrice(Math.round(cartTotal * 0.1))}</span>
            </div>
            <div className="total-row">
              <span>Shipping:</span>
              <span>{cartTotal > 50000 ? 'FREE' : formatPrice(500)}</span>
            </div>
            <div className="total-row final-total">
              <span>Total:</span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>
          </div>
          
          {cartTotal > 50000 && (
            <div className="shipping-notice">
              <CheckCircleIcon />
              <span>Congratulations! You qualify for free shipping</span>
            </div>
          )}
        </div>
        
        {/* Checkout Form */}
        <form className="checkout-details" onSubmit={handleSubmit}>
          <h3>Shipping Information</h3>
          
          {/* Customer Details */}
          <div className="form-section">
            <h4>Contact Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <div className="input-container">
                  <UserIcon className="input-icon" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? 'error' : ''}
                  />
                </div>
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <div className="input-container">
                  <UserIcon className="input-icon" />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? 'error' : ''}
                  />
                </div>
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-container">
                  <EnvelopeIcon className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                  />
                </div>
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <div className="input-container">
                  <PhoneIcon className="input-icon" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="+92 300 1234567"
                  />
                </div>
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>
          </div>
          
          {/* Shipping Address */}
          <div className="form-section">
            <h4>Shipping Address</h4>
            <div className="form-group">
              <label htmlFor="address">Street Address</label>
              <div className="input-container">
                <MapPinIcon className="input-icon" />
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? 'error' : ''}
                  placeholder="House no, street name, area"
                />
              </div>
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={errors.city ? 'error' : ''}
                />
                {errors.city && <span className="error-text">{errors.city}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="state">State/Province</label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={errors.state ? 'error' : ''}
                >
                  <option value="">Select State</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad Capital Territory">Islamabad Capital Territory</option>
                </select>
                {errors.state && <span className="error-text">{errors.state}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="zipCode">ZIP/Postal Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className={errors.zipCode ? 'error' : ''}
                />
                {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
              </div>
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="form-section">
            <h4>Payment Method</h4>
            <div className="payment-methods">
              {paymentMethods.map(method => (
                <label key={method.id} className={`payment-method ${formData.paymentMethod === method.id ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={formData.paymentMethod === method.id}
                    onChange={handleInputChange}
                  />
                  <div className="method-content">
                    <method.icon className="method-icon" />
                    <div className="method-details">
                      <span className="method-name">{method.name}</span>
                      <span className="method-desc">{method.desc}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          {/* Special Instructions */}
          <div className="form-section">
            <h4>Special Instructions (Optional)</h4>
            <div className="form-group">
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any special delivery instructions..."
                rows="3"
              />
            </div>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            className="place-order-btn"
            disabled={loading || cart.items.length === 0}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Place Order - {formatPrice(calculateTotal())}</span>
              </>
            )}
          </button>
          
          {formData.paymentMethod === 'cod' && (
            <div className="payment-notice">
              <ExclamationTriangleIcon />
              <span>You will pay {formatPrice(calculateTotal())} when your order is delivered</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm; 