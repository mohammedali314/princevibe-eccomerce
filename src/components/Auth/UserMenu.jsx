import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCircleIcon, 
  ClipboardDocumentListIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import './UserMenu.scss';

const UserMenu = ({ isOpen, setIsOpen, buttonRef }) => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const menuRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen, buttonRef]);

  const handleMenuItemClick = (path, callback) => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
      if (callback) {
        callback();
      } else if (path) {
        // Scroll to top when navigating to user profile pages
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(path);
      }
    }, 150);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      icon: UserCircleIcon,
      label: 'My Profile',
      path: '/profile',
      description: 'Manage your account'
    },
    {
      icon: ClipboardDocumentListIcon,
      label: 'My Orders',
      path: '/orders',
      description: 'Track your purchases'
    },
    {
      icon: QuestionMarkCircleIcon,
      label: 'Help & Support',
      path: '/help',
      description: 'Get assistance'
    }
  ];

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div 
      ref={menuRef}
      className={`user-menu ${isOpen ? 'open' : ''} ${isAnimating ? 'animating' : ''}`}
    >
      <div className="menu-container">
        {/* User Info Header */}
        <div className="user-info-header">
          <div className="user-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.firstName} />
            ) : (
              <div className="avatar-placeholder">
                <UserCircleIcon />
              </div>
            )}
          </div>
          <div className="user-details">
            <h3 className="user-name">
              {user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user.email?.split('@')[0] || 'User'
              }
            </h3>
            <p className="user-email">{user.email}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="menu-items">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={index}
                className="menu-item"
                onClick={() => handleMenuItemClick(item.path)}
              >
                <div className="item-icon">
                  <IconComponent />
                </div>
                <div className="item-content">
                  <span className="item-label">{item.label}</span>
                  <span className="item-description">{item.description}</span>
                </div>
                <ChevronDownIcon className="item-arrow" />
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <div className="menu-footer">
          <button
            className="logout-btn"
            onClick={() => handleMenuItemClick(null, handleLogout)}
          >
            <ArrowRightOnRectangleIcon />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMenu; 