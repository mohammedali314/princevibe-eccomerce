import React, { useState } from 'react';
import { 
  XMarkIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  TruckIcon,
  CheckCircleIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import './CheckoutTutorial.scss';

const CheckoutTutorial = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      id: 0,
      title: "Welcome to Checkout",
      icon: ShoppingCartIcon,
      content: (
        <div className="tutorial-content">
          <h3>🛒 Ready to Complete Your Purchase?</h3>
          <p>Let's walk through the simple checkout process at PrinceVibe. We've made it easy and secure!</p>
          <div className="tutorial-features">
            <div className="feature">
              <CheckCircleIcon className="feature-icon" />
              <span>Secure & Safe</span>
            </div>
            <div className="feature">
              <CheckCircleIcon className="feature-icon" />
              <span>Cash on Delivery</span>
            </div>
            <div className="feature">
              <CheckCircleIcon className="feature-icon" />
              <span>Fast Processing</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Step 1: Personal Information",
      icon: UserIcon,
      content: (
        <div className="tutorial-content">
          <h3>👤 Tell Us About Yourself</h3>
          <p>First, we need your basic information for delivery and contact.</p>
          <div className="tutorial-form-demo">
            <div className="form-field-demo">
              <UserIcon className="field-icon" />
              <span>Full Name</span>
            </div>
            <div className="form-field-demo">
              <EnvelopeIcon className="field-icon" />
              <span>Email Address</span>
            </div>
            <div className="form-field-demo">
              <PhoneIcon className="field-icon" />
              <span>Phone Number</span>
            </div>
          </div>
          <div className="tutorial-tip">
            💡 <strong>Tip:</strong> Make sure your phone number is correct - we'll call you to confirm your order!
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Step 2: Delivery Address",
      icon: MapPinIcon,
      content: (
        <div className="tutorial-content">
          <h3>📍 Where Should We Deliver?</h3>
          <p>Provide your complete delivery address. We deliver anywhere in Pakistan!</p>
          <div className="tutorial-form-demo">
            <div className="form-field-demo">
              <MapPinIcon className="field-icon" />
              <span>Street Address</span>
            </div>
            <div className="form-field-demo">
              <MapPinIcon className="field-icon" />
              <span>City</span>
            </div>
            <div className="form-field-demo">
              <MapPinIcon className="field-icon" />
              <span>Province & Postal Code</span>
            </div>
          </div>
          <div className="tutorial-tip">
            🚚 <strong>Delivery Time:</strong> 3-7 business days across Pakistan
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Step 3: Payment Method",
      icon: CreditCardIcon,
      content: (
        <div className="tutorial-content">
          <h3>💳 Choose Payment Method</h3>
          <p>We currently offer Cash on Delivery for your convenience and security.</p>
          <div className="payment-method-demo">
            <div className="payment-option">
              <div className="payment-icon">💰</div>
              <div className="payment-info">
                <h4>Cash on Delivery</h4>
                <p>Pay when you receive your order</p>
                <span className="payment-badge">Recommended</span>
              </div>
            </div>
          </div>
          <div className="tutorial-tip">
            🔒 <strong>Secure:</strong> No online payment needed - pay cash when your order arrives!
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Step 4: Review & Confirm",
      icon: CheckCircleIcon,
      content: (
        <div className="tutorial-content">
          <h3>✅ Final Review</h3>
          <p>Review your order details and confirm your purchase.</p>
          <div className="order-summary-demo">
            <div className="summary-section">
              <h4>📦 Your Items</h4>
              <p>Review watch(es) in your cart</p>
            </div>
            <div className="summary-section">
              <h4>📍 Delivery Address</h4>
              <p>Confirm delivery location</p>
            </div>
            <div className="summary-section">
              <h4>💰 Total Amount</h4>
              <p>Final price with delivery</p>
            </div>
          </div>
          <div className="tutorial-tip">
            🎉 <strong>Almost Done!</strong> Click "Place Order" to complete your purchase!
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Order Confirmation",
      icon: TruckIcon,
      content: (
        <div className="tutorial-content">
          <h3>🎉 Order Placed Successfully!</h3>
          <p>After placing your order, here's what happens next:</p>
          <div className="next-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>📧 Email Confirmation</h4>
                <p>You'll receive order details via email</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>📱 SMS Update</h4>
                <p>Order number sent to your phone</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>📞 Confirmation Call</h4>
                <p>Our team will call to confirm</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>🚚 Fast Delivery</h4>
                <p>Your order ships within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  if (!isOpen) return null;

  const currentTutorial = tutorialSteps[currentStep];
  const IconComponent = currentTutorial.icon;

  return (
    <div className="checkout-tutorial-overlay">
      <div className="checkout-tutorial-modal">
        {/* Header */}
        <div className="tutorial-header">
          <div className="tutorial-title">
            <IconComponent className="title-icon" />
            <h2>{currentTutorial.title}</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <XMarkIcon />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="tutorial-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>
          <div className="progress-dots">
            {tutorialSteps.map((step, index) => (
              <button
                key={step.id}
                className={`progress-dot ${index <= currentStep ? 'active' : ''}`}
                onClick={() => goToStep(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="tutorial-body">
          {currentTutorial.content}
        </div>

        {/* Navigation */}
        <div className="tutorial-navigation">
          <button 
            className="nav-button prev" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ChevronLeftIcon />
            Previous
          </button>
          
          <span className="step-indicator">
            Step {currentStep + 1} of {tutorialSteps.length}
          </span>
          
          {currentStep === tutorialSteps.length - 1 ? (
            <button className="nav-button finish" onClick={onClose}>
              Start Shopping
              <ShoppingCartIcon />
            </button>
          ) : (
            <button className="nav-button next" onClick={nextStep}>
              Next
              <ChevronRightIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutTutorial; 