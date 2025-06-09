import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const checkPasswordStrength = (password) => {
    if (password.length < 6) return 'weak';
    if (password.length >= 6 && password.length < 10) return 'medium';
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 'strong';
    return 'medium';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        
        // Auto-login user after successful password reset
        if (data.data?.token && data.data?.user) {
          login(data.data.user, data.data.token);
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'strong': return '#27ae60';
      default: return '#ddd';
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>✅ Password Reset Successful!</h2>
          </div>
          
          <div className="success-message">
            <div className="success-icon">🎉</div>
            <h3>Welcome Back!</h3>
            <p>
              Your password has been reset successfully. You are now logged in and will be redirected to your dashboard.
            </p>
            <div className="info-box">
              <p><strong>Redirecting in 2 seconds...</strong></p>
            </div>
          </div>

          <div className="auth-footer">
            <p>
              <Link to="/dashboard">Go to Dashboard Now</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>🔐 Reset Password</h2>
          <p>Create a new password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">❌</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              required
              disabled={loading}
            />
            {formData.password && (
              <div className="password-strength">
                <div 
                  className="strength-bar"
                  style={{ 
                    width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%',
                    backgroundColor: getPasswordStrengthColor()
                  }}
                ></div>
                <span className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                  {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              required
              disabled={loading}
            />
            {formData.confirmPassword && (
              <div className={`password-match ${formData.password === formData.confirmPassword ? 'match' : 'no-match'}`}>
                {formData.password === formData.confirmPassword ? '✅ Passwords match' : '❌ Passwords do not match'}
              </div>
            )}
          </div>

          <div className="password-requirements">
            <p><strong>Password Requirements:</strong></p>
            <ul>
              <li className={formData.password.length >= 6 ? 'requirement-met' : ''}>
                At least 6 characters
              </li>
              <li className={/[A-Z]/.test(formData.password) ? 'requirement-met' : ''}>
                One uppercase letter (recommended)
              </li>
              <li className={/[0-9]/.test(formData.password) ? 'requirement-met' : ''}>
                One number (recommended)
              </li>
            </ul>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Remember your password? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 