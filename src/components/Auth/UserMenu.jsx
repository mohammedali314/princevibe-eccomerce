import React, { useState, useRef, useEffect } from 'react';
import { 
  UserIcon, 
  CogIcon, 
  ShoppingBagIcon, 
  HeartIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UserMenu.scss';

const UserMenu = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      if (onClose) onClose();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleMenuClick = (action) => {
    setIsOpen(false);
    if (onClose) onClose();
    
    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'orders':
        navigate('/orders');
        break;
      case 'wishlist':
        navigate('/wishlist');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'help':
        navigate('/help');
        break;
      default:
        break;
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="user-menu" ref={menuRef}>
      <button 
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="user-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.firstName} />
          ) : (
            <div className="avatar-placeholder">
              {(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
            </div>
          )}
        </div>
        <span className="user-name">
          {user.firstName || user.email?.split('@')[0] || 'User'}
        </span>
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="menu-header">
            <div className="user-info">
              <div className="user-avatar large">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.firstName} />
                ) : (
                  <div className="avatar-placeholder">
                    {(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-details">
                <h4>{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}</h4>
                <p>{user.email}</p>
              </div>
            </div>
          </div>

          <div className="menu-content">
            <div className="menu-section">
              <button 
                className="menu-item"
                onClick={() => handleMenuClick('profile')}
              >
                <UserCircleIcon />
                <span>My Profile</span>
              </button>
              
              <button 
                className="menu-item"
                onClick={() => handleMenuClick('orders')}
              >
                <ClipboardDocumentListIcon />
                <span>My Orders</span>
              </button>
              
              <button 
                className="menu-item"
                onClick={() => handleMenuClick('wishlist')}
              >
                <HeartIcon />
                <span>Wishlist</span>
              </button>
            </div>

            <div className="menu-divider"></div>

            <div className="menu-section">
              <button 
                className="menu-item"
                onClick={() => handleMenuClick('settings')}
              >
                <CogIcon />
                <span>Settings</span>
              </button>
              
              <button 
                className="menu-item"
                onClick={() => handleMenuClick('help')}
              >
                <QuestionMarkCircleIcon />
                <span>Help & Support</span>
              </button>
            </div>

            <div className="menu-divider"></div>

            <div className="menu-section">
              <button 
                className="menu-item logout"
                onClick={handleLogout}
              >
                <ArrowRightOnRectangleIcon />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 