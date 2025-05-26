import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  ChartBarIcon,
  CubeIcon,
  ShoppingBagIcon,
  CogIcon,
  PowerIcon,
  UserCircleIcon,
  BellIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  HomeIcon as HomeOutlineIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon,
  ShieldCheckIcon,
  ChartBarIcon as ChartBarSolidIcon,
  CubeIcon as CubeSolidIcon,
  ShoppingBagIcon as ShoppingBagSolidIcon,
  CogIcon as CogSolidIcon
} from '@heroicons/react/24/solid';

import Dashboard from './Dashboard/Dashboard';
import ProductManagement from './ProductManagement/ProductManagement';
import OrderManagement from './OrderManagement/OrderManagement';
import Analytics from './Analytics/Analytics';
import Settings from './Settings/Settings';
import AdminApi from '../../services/adminApi';
import './AdminDashboard.scss';

const AdminDashboard = ({ currentAdmin, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Navigation items
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/admin',
      icon: HomeOutlineIcon,
      activeIcon: HomeIcon
    },
    {
      id: 'products',
      label: 'Products',
      path: '/admin/products',
      icon: CubeIcon,
      activeIcon: CubeSolidIcon
    },
    {
      id: 'orders',
      label: 'Orders',
      path: '/admin/orders',
      icon: ShoppingBagIcon,
      activeIcon: ShoppingBagSolidIcon
    },
    {
      id: 'analytics',
      label: 'Analytics',
      path: '/admin/analytics',
      icon: ChartBarIcon,
      activeIcon: ChartBarSolidIcon
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/admin/settings',
      icon: CogIcon,
      activeIcon: CogSolidIcon
    }
  ];

  // Get current active route
  const getCurrentRoute = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/') return 'dashboard';
    if (path.startsWith('/admin/products')) return 'products';
    if (path.startsWith('/admin/orders')) return 'orders';
    if (path.startsWith('/admin/analytics')) return 'analytics';
    if (path.startsWith('/admin/settings')) return 'settings';
    return 'dashboard';
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
      navigate('/');
    }
  };

  // Load notifications (placeholder)
  useEffect(() => {
    setNotifications([
      { id: 1, message: 'New order received', time: '2 min ago', type: 'info' },
      { id: 2, message: 'Low stock alert: Rolex Submariner', time: '1 hour ago', type: 'warning' },
      { id: 3, message: 'Monthly report ready', time: '3 hours ago', type: 'success' }
    ]);
  }, []);

  return (
    <div className={`admin-dashboard ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        {/* Logo */}
        <div className="sidebar-header">
          <div className="logo-container">
            <ShieldCheckIcon className="logo-icon" />
            <span className="logo-text">Admin Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navItems.map((item) => {
              const isActive = getCurrentRoute() === item.id;
              const IconComponent = isActive ? item.activeIcon : item.icon;

              return (
                <li key={item.id} className={`nav-item ${isActive ? 'active' : ''}`}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className="nav-link"
                  >
                    <IconComponent className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Admin Info */}
        <div className="sidebar-footer">
          <div className="admin-info">
            <UserCircleIcon className="admin-avatar" />
            <div className="admin-details">
              <span className="admin-name">{currentAdmin?.name || 'Admin'}</span>
              <span className="admin-role">{currentAdmin?.role || 'Administrator'}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <PowerIcon />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Top Bar */}
        <header className="admin-header">
          <div className="header-left">
            <h1 className="page-title">
              {navItems.find(item => item.id === getCurrentRoute())?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="header-right">
            {/* Search */}
            <div className="search-container">
              <MagnifyingGlassIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Notifications */}
            <div className="notifications-container">
              <button className="notification-btn">
                <BellIcon className="notification-icon" />
                {notifications.length > 0 && (
                  <span className="notification-badge">{notifications.length}</span>
                )}
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="theme-toggle"
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="admin-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products/*" element={<ProductManagement />} />
            <Route path="/orders/*" element={<OrderManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 