import React, { useState } from 'react';
import { 
  XMarkIcon, 
  EyeIcon, 
  EyeSlashIcon,
  LockClosedIcon,
  UserIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await AdminApi.login(formData.email, formData.password);
      
      if (response.success) {
        // Reset form
        setFormData({ email: '', password: '' });
        setShowPassword(false);
        onSuccess(response.data.admin);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ email: '', password: '' });
    setShowPassword(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="icon-container">
              <ShieldCheckIcon className="shield-icon" />
            </div>
            <h2>Admin Access</h2>
            <p>Enter your credentials to access the admin dashboard</p>
          </div>
          <button className="close-btn" onClick={handleClose}>
            <XMarkIcon />
          </button>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <ExclamationTriangleIcon />
              <span>{error}</span>
            </div>
          )}

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
                placeholder="Princevibe.store@gmail.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

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
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
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
        </form>

        {/* Security Notice */}
        <div className="security-notice">
          <div className="notice-content">
            <LockClosedIcon />
            <span>This is a secure admin area. All actions are logged and monitored.</span>
          </div>
        </div>

        {/* Demo Credentials (for testing) */}
        <div className="demo-info">
          <p><strong>Demo Credentials:</strong></p>
          <p>Email: Princevibe.store@gmail.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 