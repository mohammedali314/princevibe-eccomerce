import React, { useState, useRef, useEffect } from 'react';
import { 
  XMarkIcon, 
  EyeIcon, 
  EyeSlashIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.scss';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup' or 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  
  const modalRef = useRef(null);
  const { login, signup } = useAuth();

  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    rememberMe: false
  });

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
        rememberMe: false
      });
      setError('');
      setSuccess('');
      setIsLoading(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, mode]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Validate form
  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (mode === 'signup') {
      if (!formData.firstName || !formData.lastName) {
        setError('First name and last name are required');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }

      if (!formData.agreeToTerms) {
        setError('Please agree to the terms and conditions');
        return false;
      }

      if (formData.phone && !/^(\+92|92|0)?[\d\s-()]{10,13}$/.test(formData.phone.replace(/[\s-()]/g, ''))) {
        setError('Please enter a valid Pakistani phone number (e.g., +92 XXX XXXXXXX)');
        return false;
      }
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (mode === 'forgot') {
      await handleForgotPassword(formData.email);
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      let result;
      
      if (mode === 'login') {
        result = await login(formData.email, formData.password);
      } else {
        const signupData = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth
        };
        result = await signup(signupData);
      }

      if (result.success) {
        setSuccess(mode === 'login' ? 'Welcome back!' : 'Account created successfully!');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (email) => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Parse response JSON first
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse forgot password response:', parseError);
        setError('Server error. Please try again later.');
        return;
      }

      if (response.ok && data.success) {
        setPasswordResetSent(true);
        setSuccess('Password reset email sent! Please check your inbox.');
        setFormData(prev => ({ ...prev, email: '' }));
      } else {
        // Extract user-friendly error message
        let errorMessage = 'Unable to send reset email. Please try again.';
        
        if (data && data.message) {
          errorMessage = data.message;
        } else if (data && data.error) {
          errorMessage = data.error;
        } else {
          // Provide user-friendly messages for common HTTP status codes
          switch (response.status) {
            case 400:
              errorMessage = 'Please enter a valid email address.';
              break;
            case 404:
              errorMessage = 'No account found with this email address.';
              break;
            case 429:
              errorMessage = 'Too many reset attempts. Please wait a few minutes and try again.';
              break;
            case 500:
              errorMessage = 'Server error. Please try again later.';
              break;
            default:
              errorMessage = 'Unable to send reset email. Please try again.';
          }
        }
        
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Unable to connect to server. Please check your internet connection and try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle click outside modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal" ref={modalRef}>
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>
          <span className="close-icon">×</span>
        </button>

        {/* Header */}
        <div className="auth-header">
          <h2>{mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Forgot Password'}</h2>
          <p>
            {mode === 'login' 
              ? 'Welcome back! Please sign in to your account.'
              : mode === 'signup' ? 'Create a new account to get started.' : 'Enter your email address to reset your password.'
            }
          </p>
        </div>

        {/* Tab Switcher */}
        {/* <div className="auth-tabs">
          <button
            type="button"
            className={`tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setPasswordResetSent(false);
              setError('');
              setSuccess('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => {
              setMode('signup');
              setPasswordResetSent(false);
              setError('');
              setSuccess('');
            }}
          >
            Create Account
          </button>
        </div> */}

        {/* Messages */}
        {success && (
          <div className="message success">
            <CheckCircleIcon />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="message error">
            <ExclamationTriangleIcon />
            <span>{error}</span>
          </div>
        )}

        {/* Forgot Password Success Message */}
        {passwordResetSent && mode === 'forgot' && (
          <div className="password-reset-success">
            <div className="success-icon">📧</div>
            <h3>Check Your Email</h3>
            <p>We've sent a password reset link to your email address. Please check your inbox and follow the instructions.</p>
            <div className="reset-info">
              <p><strong>⏰ Link expires in 10 minutes</strong></p>
              <p>If you don't see the email, check your spam folder.</p>
            </div>
            <button 
              type="button" 
              className="back-to-login"
              onClick={() => {
                setMode('login');
                setPasswordResetSent(false);
                setError('');
                setSuccess('');
              }}
            >
              Back to Sign In
            </button>
          </div>
        )}

        {/* Form */}
        {!(passwordResetSent && mode === 'forgot') && (
          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Forgot Password Mode */}
            {mode === 'forgot' && (
              <>
                <div className="forgot-header">
                  <h3>🔐 Forgot Password</h3>
                  <p>Enter your email address and we'll send you a link to reset your password.</p>
                </div>
                
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-container">
                    <EnvelopeIcon />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <span>Sending Reset Link...</span>
                    </div>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>

                <div className="forgot-footer">
                  <button 
                    type="button" 
                    className="back-link"
                    onClick={() => {
                      setMode('login');
                      setError('');
                      setSuccess('');
                    }}
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </>
            )}

            {/* Regular Login/Signup Forms */}
            {mode !== 'forgot' && (
              <>
                {mode === 'signup' && (
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <div className="input-container">
                        <UserIcon />
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <div className="input-container">
                        <UserIcon />
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-container">
                    <EnvelopeIcon />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {mode === 'signup' && (
                  <>
                    <div className="form-group">
                      <label>Phone Number <span className="optional">(Optional)</span></label>
                      <div className="input-container">
                        <PhoneIcon />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+92 XXX XXXXXXX"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Date of Birth <span className="optional">(Optional)</span></label>
                      <div className="input-container">
                        <CalendarDaysIcon />
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>Password</label>
                  <div className="input-container">
                    <LockClosedIcon />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <div className="input-container">
                      <LockClosedIcon />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'signup' && (
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        required
                      />
                      <span className="checkmark">
                        <CheckCircleIcon />
                      </span>
                      <span className="checkbox-text">
                        I agree to the <a href="/terms" target="_blank">Terms of Service</a> and{' '}
                        <a href="/privacy" target="_blank">Privacy Policy</a>
                      </span>
                    </label>
                  </div>
                )}

                {mode === 'login' && (
                  <div className="form-options">
                    <label className="remember-me">
                      <input type="checkbox" name="rememberMe" />
                      <span className="checkmark">
                        <CheckCircleIcon />
                      </span>
                      <span>Remember me</span>
                    </label>
                    <button 
                      type="button"
                      className="forgot-password"
                      onClick={() => {
                        setMode('forgot');
                        setError('');
                        setSuccess('');
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <span>{mode === 'login' ? 'Signing In...' : 'Creating Account...'}</span>
                    </div>
                  ) : (
                    <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  )}
                </button>
              </>
            )}
          </form>
        )}

        {/* Footer */}
        <div className="auth-footer">
          <p>
            {mode === 'login' ? "Don't have an account? " : mode === 'signup' ? "Already have an account? " : "Remember your password? "}
            <button 
              className="switch-mode"
              onClick={() => setMode(mode === 'login' ? 'signup' : mode === 'signup' ? 'login' : 'login')}
            >
              {mode === 'login' ? 'Create one' : mode === 'signup' ? 'Sign in' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 