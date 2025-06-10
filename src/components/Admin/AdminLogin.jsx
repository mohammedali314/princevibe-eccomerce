import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  EyeIcon, 
  EyeSlashIcon,
  LockClosedIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/solid';
import AdminApi from '../../services/adminApi';
import './AdminLogin.scss';

const AdminLogin = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Auto-hide success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Real-time validation
  const validateField = (name, value) => {
    const errors = { ...formErrors };
    switch (name) {
      case 'email':
        if (!value) {
          errors.email = 'Email is required';
        } else if (!validateEmail(value)) {
          errors.email = 'Please enter a valid email';
        } else {
          delete errors.email;
        }
        break;
      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (!validatePassword(value)) {
          errors.password = 'Password must be at least 6 characters';
        } else {
          delete errors.password;
        }
        break;
      default:
        break;
    }
    setFormErrors(errors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error and validate field
    if (error) setError('');
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    validateField('email', formData.email);
    validateField('password', formData.password);
    
    if (Object.keys(formErrors).length > 0 || !formData.email || !formData.password) {
      setError('Please correct the errors and try again');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await AdminApi.login(formData.email, formData.password);
      
      if (response.success) {
        setSuccess('Login successful! Redirecting to dashboard...');
        
        // Delay to show success message
        setTimeout(() => {
          setFormData({ email: '', password: '' });
          setShowPassword(false);
          setFormErrors({});
          onSuccess(response.data.admin);
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ email: '', password: '' });
    setShowPassword(false);
    setError('');
    setSuccess('');
    setFormErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="admin-login-overlay" onClick={handleClose}>
      <div className="admin-login-modal" onClick={(e) => e.stopPropagation()}>
        {/* Animated Background Elements */}
        <div className="modal-bg-elements">
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="bg-circle bg-circle-3"></div>
        </div>

        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="icon-container">
              <ShieldCheckIcon className="shield-icon" />
              <SparklesIcon className="sparkle-icon sparkle-1" />
              <SparklesIcon className="sparkle-icon sparkle-2" />
              <SparklesIcon className="sparkle-icon sparkle-3" />
            </div>
            <h2>Admin Portal</h2>
            <p>Secure access to your dashboard</p>
          </div>
          <button className="close-btn" onClick={handleClose}>
            <XMarkIcon />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          {/* Success Message */}
          {success && (
            <div className="success-message">
              <CheckCircleIcon />
              <span>{success}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <ExclamationTriangleIcon />
              <span>{error}</span>
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-container">
              <UserIcon className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="admin@princevibe.com"
                className={formErrors.email ? 'error' : ''}
                required
              />
              {formErrors.email && (
                <div className="field-error">{formErrors.email}</div>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <LockClosedIcon className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your secure password"
                className={formErrors.password ? 'error' : ''}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
              {formErrors.password && (
                <div className="field-error">{formErrors.password}</div>
              )}
            </div>
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading || Object.keys(formErrors).length > 0}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <ShieldCheckIcon />
                <span>Access Dashboard</span>
              </>
            )}
          </button>

          {/* Forgot Password Link */}
          <div className="forgot-password">
            <a href="#" onClick={(e) => e.preventDefault()}>
              Forgot your password?
            </a>
          </div>
        </form>

        {/* Security Notice */}
        <div className="security-notice">
          <div className="notice-content">
            <LockClosedIcon />
            <span>Protected by enterprise-grade security. All access attempts are logged and monitored.</span>
          </div>
        </div>

        {/* Demo Info */}
        <div className="demo-info">
          <p>🚀 Demo Access Available</p>
          <p>Email: admin@princevibe.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 