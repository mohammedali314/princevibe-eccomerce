import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import orderService from '../../services/orderService';
import { 
  CreditCardIcon,
  TruckIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  SparklesIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import './CheckoutForm.scss';

const CheckoutForm = ({ onOrderComplete }) => {
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [orderResult, setOrderResult] = useState(null);
  const [discountApplied, setDiscountApplied] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  
  // Move formData state declaration BEFORE early return to fix hooks error
  const [formData, setFormData] = useState({
    // Customer Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    
    // Shipping Address
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Pakistan',
    
    // Payment Method - Only COD for now
    paymentMethod: 'cod',
    
    // Additional Options
    discountCode: '',
    specialInstructions: '',
    
    // Terms
    agreeToTerms: false,
    subscribeNewsletter: false
  });

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Ensure cart is always an array and handle edge cases
  const safeCart = Array.isArray(cart) ? cart : [];
  const safeCartTotal = typeof cartTotal === 'number' && !isNaN(cartTotal) ? cartTotal : 0;

  // Steps configuration
  const steps = [
    {
      number: 1,
      title: 'Customer Information',
      description: 'Your personal details',
      icon: UserIcon
    },
    {
      number: 2,
      title: 'Shipping Address',
      description: 'Where to deliver your order',
      icon: TruckIcon
    },
    {
      number: 3,
      title: 'Order Review',
      description: 'Review your order details',
      icon: CheckCircleIcon
    },
    {
      number: 4,
      title: 'Order Confirmation',
      description: 'Your order has been placed',
      icon: SparklesIcon
    }
  ];

  // Define all functions after hooks but before early return
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1: // Customer Information
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
        if (!formData.phone.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^(\+92|0)?[0-9]{10,11}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
          newErrors.phone = 'Please enter a valid Pakistani phone number';
        }
        break;

      case 2: // Shipping Address
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State/Province is required';
        if (!formData.postalCode.trim()) {
          newErrors.postalCode = 'Postal code is required';
        } else if (!/^[0-9]{5}$/.test(formData.postalCode)) {
          newErrors.postalCode = 'Please enter a valid 5-digit postal code';
        }
        break;

      case 3: // Order Review
        if (!formData.agreeToTerms) {
          newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      scrollToTop();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollToTop();
    }
  };

  const applyDiscount = async () => {
    if (!formData.discountCode.trim()) {
      setErrors(prev => ({ ...prev, discountCode: 'Please enter a discount code' }));
      return;
    }
    
    setLoading(true);
    try {
      const discountCodeData = await orderService.validateDiscountCode(formData.discountCode);
      
      if (!discountCodeData) {
        setErrors(prev => ({ ...prev, discountCode: 'Invalid discount code' }));
        setLoading(false);
        return;
      }

      const currentTotal = safeCartTotal;
      const discount = orderService.calculateDiscount(currentTotal, discountCodeData);
      
      setDiscountApplied(discountCodeData);
      setDiscountAmount(discount);
      
      // Clear any existing error
      setErrors(prev => ({ ...prev, discountCode: '' }));
      
      // Show success message
      alert(`Discount applied! You saved PKR ${discount.toLocaleString()}`);
      
    } catch (error) {
      setErrors(prev => ({ ...prev, discountCode: error.message }));
    } finally {
      setLoading(false);
    }
  };

  const removeDiscount = () => {
    setDiscountApplied(null);
    setDiscountAmount(0);
    setFormData(prev => ({ ...prev, discountCode: '' }));
  };

  const getFinalTotal = () => {
    const subtotal = safeCartTotal || 0;
    const discount = discountAmount || 0;
    const finalTotal = subtotal - discount;
    return Math.max(finalTotal, 0); // Ensure total is never negative
  };

  const handleOrderSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      const finalTotal = getFinalTotal();
      
      // Prepare order data for orderService
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company
        },
        shipping: {
          address: formData.address,
            city: formData.city,
            state: formData.state,
          postalCode: formData.postalCode,
            country: formData.country
        },
        items: safeCart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          total: item.price * item.quantity
        })),
        payment: {
          method: 'cod',
          amount: finalTotal,
          subtotal: safeCartTotal,
          discount: discountAmount,
          discountCode: discountApplied ? formData.discountCode : null,
          status: 'pending'
        },
        specialInstructions: formData.specialInstructions,
        subscribeNewsletter: formData.subscribeNewsletter
      };

      // Create the order using orderService
      const result = await orderService.createCODOrder(orderData);
      
      if (result.success) {
        setOrderResult(result.order);
        
        // Clear cart
        clearCart();
        
        // Move to confirmation step
        setCurrentStep(4);
        scrollToTop();
        
        // Call completion callback
        if (onOrderComplete) {
          onOrderComplete(result.order);
        }
      } else {
        setErrors({ general: result.error || 'Failed to place order. Please try again.' });
      }
      
    } catch (error) {
      console.error('Order submission error:', error);
      setErrors({ general: 'Failed to place order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
  return (
          <div className="step-content">
          <div className="form-section">
              <h3 className="section-title">
                <UserIcon className="section-icon" />
                Personal Information
              </h3>
              <div className="form-grid">
              <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? 'error' : ''}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>
              
              <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? 'error' : ''}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
            
              <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="+92 300 1234567"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="company">Company (Optional)</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Your company name"
                  />
                </div>
              </div>
            </div>
          </div>
        );
          
      case 2:
        return (
          <div className="step-content">
          <div className="form-section">
              <h3 className="section-title">
                <MapPinIcon className="section-icon" />
                Shipping Address
              </h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="address">Street Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? 'error' : ''}
                    placeholder="House/Building number and street name"
                />
                  {errors.address && <span className="error-message">{errors.address}</span>}
            </div>
            
              <div className="form-group">
                  <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={errors.city ? 'error' : ''}
                    placeholder="Karachi, Lahore, Islamabad..."
                />
                  {errors.city && <span className="error-message">{errors.city}</span>}
              </div>
              
              <div className="form-group">
                  <label htmlFor="state">State/Province *</label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={errors.state ? 'error' : ''}
                >
                    <option value="" disabled>Select State/Province</option>
                    <option value="Sindh">Sindh</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                  <option value="Balochistan">Balochistan</option>
                    <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                    <option value="Azad Kashmir">Azad Kashmir</option>
                  <option value="Islamabad Capital Territory">Islamabad Capital Territory</option>
                </select>
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code *</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className={errors.postalCode ? 'error' : ''}
                    placeholder="74000"
                  />
                  {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
              </div>
              
              <div className="form-group">
                  <label htmlFor="country">Country</label>
                <input
                  type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    disabled
                    className="disabled"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="specialInstructions">Special Instructions (Optional)</label>
                  <textarea
                    id="specialInstructions"
                    name="specialInstructions"
                    value={formData.specialInstructions}
                  onChange={handleInputChange}
                    placeholder="Any special delivery instructions..."
                    rows="3"
                />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <div className="order-review-section">
              <h3 className="section-title">
                <CheckCircleIcon style={{ width: '40px', height: '40px' }} className="section-icon" />
                Review Your Order
              </h3>

              {/* Customer Information Review */}
              <div className="review-card">
                <h4>Customer Information</h4>
                <div className="review-details">
                  <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Phone:</strong> {formData.phone}</p>
                  {formData.company && <p><strong>Company:</strong> {formData.company}</p>}
                </div>
              </div>

              {/* Shipping Address Review */}
              <div className="review-card">
                <h4>Shipping Address</h4>
                <div className="review-details">
                  <p><strong>Address:</strong> {formData.address}</p>
                  <p><strong>City:</strong> {formData.city}, {formData.state} {formData.postalCode}</p>
                  <p><strong>Country:</strong> {formData.country}</p>
                  {formData.specialInstructions && (
                    <p><strong>Special Instructions:</strong> {formData.specialInstructions}</p>
                  )}
            </div>
          </div>
          
          {/* Payment Method */}
              <div className="review-card">
            <h4>Payment Method</h4>
                <div className="payment-method-display">
                  <BanknotesIcon className="payment-icon" />
                  <div>
                    <p>Cash on Delivery (COD)</p>
                    <p className="payment-description">Pay when your order arrives at your doorstep</p>
                  </div>
                </div>
              </div>

              {/* Discount Code Section */}
              <div className="review-card">
                <h4>Discount Code</h4>
                {!discountApplied ? (
                  <div className="discount-section">
                    <div className="discount-input-group">
                  <input
                        type="text"
                        name="discountCode"
                        value={formData.discountCode}
                    onChange={handleInputChange}
                        placeholder="Enter discount code"
                        className={`discount-input ${errors.discountCode ? 'error' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={applyDiscount}
                        disabled={loading || !formData.discountCode.trim()}
                        className="apply-discount-btn"
                      >
                        {loading ? (
                          <div className="loading-spinner"></div>
                        ) : (
                          <>
                            <GiftIcon className="btn-icon" />
                            Apply
                          </>
                        )}
                      </button>
                    </div>
                    {errors.discountCode && (
                      <span className="error-message">{errors.discountCode}</span>
                    )}
                  </div>
                ) : (
                  <div className="discount-applied">
                    <div className="discount-success">
                      <CheckCircleIcon className="success-icon" />
                      <div>
                        <p>Discount Applied: {formData.discountCode}</p>
                        <p>You saved PKR {discountAmount.toLocaleString()}</p>
                      </div>
                      <button
                        type="button"
                        onClick={removeDiscount}
                        className="remove-discount-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="review-card">
                <h4>Terms & Conditions</h4>
                <div className="terms-section">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className={errors.agreeToTerms ? 'error' : ''}
                    />
                    <span className="checkbox-text">
                      I agree to the <a href="/terms" target="_blank">Terms & Conditions</a> and 
                      <a href="/privacy" target="_blank"> Privacy Policy</a>
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <span className="error-message">{errors.agreeToTerms}</span>
                  )}

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="subscribeNewsletter"
                      checked={formData.subscribeNewsletter}
                      onChange={handleInputChange}
                    />
                    <span className="checkbox-text">
                      Subscribe to our newsletter for exclusive offers and updates
                    </span>
                </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <div className="order-confirmation">
              <div className="confirmation-icon">
                <CheckCircleIcon />
              </div>
              <h2>Order Placed Successfully!</h2>
              <p className="confirmation-message">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>

              {orderResult && (
                <div className="order-details-card">
                  <h3>Order Information</h3>
                  <p><strong>Order Number:</strong> {orderResult.orderNumber}</p>
                  <p><strong>Customer Phone:</strong> {formData.phone}</p>
                  <p><strong>Customer Email:</strong> {formData.email}</p>
                  <p><strong>Total Amount:</strong> PKR {(orderResult.payment?.amount || 0).toLocaleString()}</p>
                  <p><strong>Payment Method:</strong> Cash on Delivery</p>
                  <p><strong>Estimated Delivery:</strong> {orderResult.estimatedDelivery ? new Date(orderResult.estimatedDelivery).toLocaleDateString('en-PK') : '3-5 business days'}</p>
                </div>
              )}

              {/* PHONE-FIRST PRIORITY SECTION */}
              <div className="phone-verification-priority" style={{
                background: 'linear-gradient(135deg, #0066cc, #004499)',
                color: '#ffffff',
                padding: '1.5rem',
                borderRadius: '12px',
                margin: '1.5rem 0',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📞</div>
                <h3 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Phone Verification Priority</h3>
                <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                  <strong>We will call you within 24 hours to confirm your order</strong>
                </p>
                <p style={{ fontSize: '0.95rem', opacity: '0.9' }}>
                  Our team will verify your details and ensure perfect delivery.
                  Please keep your phone available: <strong>{formData.phone}</strong>
                </p>
              </div>

              <div className="guest-tracking-info">
                <h4>📦 Track Your Order</h4>
                <p>You can track your order anytime using:</p>
                <ul>
                  <li><strong>Order Number:</strong> {orderResult?.orderNumber}</li>
                  <li><strong>Email Address:</strong> {formData.email}</li>
                </ul>
                <button
                  onClick={() => {
                    window.open('/track-order', '_blank');
                  }}
                  className="track-order-btn"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #0066cc, #004499)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '10px',
                    marginRight: '10px'
                  }}
                >
                  🔍 Track Your Order
                </button>
              </div>

              <div className="next-steps">
                <h4>What Happens Next?</h4>
                <ol>
                  <li><strong>📞 Phone Verification (Within 24 hours):</strong> Our team will call to confirm your order and delivery details</li>
                  <li><strong>📧 Email Confirmation:</strong> Order confirmation sent to your email</li>
                  <li><strong>📦 Order Preparation:</strong> Your luxury watch will be carefully prepared and packed</li>
                  <li><strong>🚚 Shipping Notification:</strong> You'll be notified when your order is out for delivery</li>
                  <li><strong>💰 Cash on Delivery:</strong> Pay when your premium watch arrives at your doorstep</li>
                </ol>
              </div>

              <div style={{
                background: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '1rem',
                margin: '1rem 0'
              }}>
                <h5 style={{ color: '#495057', marginBottom: '0.5rem' }}>💡 Important Notes:</h5>
                <ul style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0' }}>
                  <li>Keep your phone accessible for our verification call</li>
                  <li>We'll confirm your delivery address and timing preferences</li>
                  <li>Orders are typically delivered within 3-5 business days after confirmation</li>
                  <li>For urgent delivery needs, please mention during our call</li>
                </ul>
              </div>

              <div className="confirmation-actions">
                <button
                  onClick={() => {
                    scrollToTop();
                    setTimeout(() => {
                      window.location.href = '/';
                    }, 300);
                  }}
                  className="continue-shopping-btn"
                >
                  <ArrowLeftIcon className="btn-icon" />
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Early return if cart is empty (now AFTER all hooks are declared)
  if (safeCart.length === 0 && currentStep !== 4) {
    return (
      <div className="prince-luxury-checkout">
        <div className="luxury-checkout-header">
          <div className="container">
            <h1 className="luxury-title">Your Cart is Empty</h1>
            <p className="luxury-subtitle">Add some luxury watches to your cart to proceed with checkout</p>
          </div>
        </div>
        <div className="checkout-container">
          <div className="container">
            <div className="empty-cart-message" style={{ textAlign: 'center', padding: '4rem 0' }}>
              <button 
                className="continue-shopping-btn"
                onClick={() => {
                  scrollToTop();
                  setTimeout(() => {
                    window.location.href = '/';
                  }, 300);
                }}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #000000, #333333)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  try {
    return (
      <div className="prince-luxury-checkout">
        {/* Luxury Header */}
        <div className="luxury-checkout-header">
          <div className="container">
            <h1 className="luxury-title">Secure Checkout</h1>
            <p className="luxury-subtitle">Complete your luxury watch purchase</p>
          </div>
        </div>

        <div className="checkout-container">
          <div className="container">
            {/* Progress Indicator */}
            <div className="progress-steps">
              {steps.map((step, index) => (
                <div 
                  key={step.number}
                  className={`progress-step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
                >
                  <div className="step-circle">
                    {currentStep > step.number ? (
                      <CheckCircleIcon className="step-icon" />
                    ) : (
                      <step.icon className="step-icon" />
                    )}
                    <span className="step-number">{step.number}</span>
                  </div>
                  <div className="step-info">
                    <h4 className="step-title">{step.title}</h4>
                    <p className="step-description">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && <div className="step-connector"></div>}
                </div>
              ))}
            </div>

            <div className="checkout-content">
              <div className="checkout-main">
                <form onSubmit={(e) => e.preventDefault()}>
                  {errors.general && (
                    <div className="error-banner">
                      <ExclamationTriangleIcon className="error-icon" />
                      {errors.general}
                    </div>
                  )}

                  {renderStepContent()}

                  {/* Navigation Buttons */}
                  {currentStep < 4 && (
                    <div className="step-navigation">
                      {currentStep > 1 && (
                        <button 
                          type="button" 
                          onClick={prevStep}
                          className="nav-btn prev-btn"
                          disabled={loading}
                        >
                          <ArrowLeftIcon className="btn-icon" />
                          Back
                        </button>
                      )}
                      
                      {currentStep < 3 ? (
                        <button 
                          type="button" 
                          onClick={nextStep}
                          className="nav-btn next-btn"
                          disabled={loading}
                        >
                          Continue
                          <ArrowRightIcon className="btn-icon" />
                        </button>
                      ) : (
          <button 
                          type="button" 
                          onClick={handleOrderSubmit}
                          className="nav-btn place-order-btn"
                          disabled={loading}
          >
            {loading ? (
              <>
                              <div className="loading-spinner"></div>
                              Processing Order...
              </>
            ) : (
              <>
                              <SparklesIcon className="btn-icon" />
                              Place Order
              </>
            )}
          </button>
                      )}
            </div>
          )}
        </form>
              </div>

              {/* Order Summary Sidebar */}
              {currentStep !== 4 && (
                <div className="order-summary">
                  <div className="summary-card">
                    <h3 className="summary-title">Order Summary</h3>
                    
                    <div className="cart-items">
                      {safeCart.map((item) => (
                        <div key={item.id} className="cart-item">
                          <img src={item.image} alt={item.name} className="item-image" />
                          <div className="item-details">
                            <h4 className="item-name">{item.name}</h4>
                            <p className="item-price">PKR {item.price.toLocaleString()}</p>
                            <p className="item-quantity">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="summary-totals">
                      <div className="total-row">
                        <span>Subtotal:</span>
                        <span>PKR {safeCartTotal.toLocaleString()}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="total-row discount">
                          <span>Discount ({formData.discountCode}):</span>
                          <span>-PKR {discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="total-row">
                        <span>Shipping:</span>
                        <span>FREE</span>
                      </div>
                      <div className="total-row grand-total">
                        <span>Total:</span>
                        <span>PKR {getFinalTotal().toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Security Badges */}
                    <div className="security-badges">
                      <div className="security-badge">
                        <ShieldCheckIcon className="security-icon" />
                        <span>Secure Checkout</span>
                      </div>
                      <div className="security-badge">
                        <LockClosedIcon className="security-icon" />
                        <span>SSL Protected</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('CheckoutForm render error:', error);
    return (
      <div className="prince-luxury-checkout">
        <div className="luxury-checkout-header">
          <div className="container">
            <h1 className="luxury-title">Error</h1>
            <p className="luxury-subtitle">Something went wrong. Please try again.</p>
          </div>
        </div>
        <div className="checkout-container">
          <div className="container">
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p>We're experiencing technical difficulties. Please refresh the page or try again later.</p>
              <button 
                onClick={() => window.location.reload()}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #000000, #333333)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                Refresh Page
              </button>
            </div>
          </div>
      </div>
    </div>
  );
  }
};

export default CheckoutForm; 