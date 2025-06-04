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

// Icons
const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
  </svg>
);

const OrdersIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
  </svg>
);

const ProductsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const CustomersIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
  </svg>
);

const AnalyticsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2.5 2.5h-15V5h15v14.5zm0-16.5h-15c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
  </svg>
);

const AdminDashboard = ({ currentAdmin, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const ordersResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://princevibe-eccomerce-backend-production.up.railway.app/api'}/orders`);
      const ordersData = await ordersResponse.json();
      
      if (ordersData.success) {
        setOrders(ordersData.data.orders || []);
      }

      // Fetch basic stats
      const statsData = {
        totalOrders: ordersData.data?.orders?.length || 0,
        totalRevenue: ordersData.data?.orders?.reduce((sum, order) => sum + order.summary.total, 0) || 0,
        pendingOrders: ordersData.data?.orders?.filter(order => order.status === 'pending').length || 0,
        completedOrders: ordersData.data?.orders?.filter(order => order.status === 'delivered').length || 0
      };
      
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, trackingNumber = '') => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://princevibe-eccomerce-backend-production.up.railway.app/api'}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: trackingNumber,
          note: `Order status updated to ${newStatus}`
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, status: newStatus, ...(trackingNumber && { shipping: { ...order.shipping, trackingNumber } }) }
              : order
          )
        );
        alert(`Order status updated to ${newStatus}. Customer will be notified via email.`);
      } else {
        alert('Failed to update order status: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      processing: '#8b5cf6',
      shipped: '#06b6d4',
      delivered: '#10b981',
      cancelled: '#ef4444',
      returned: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const DashboardOverview = () => (
    <div className="dashboard-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orders">
            <OrdersIcon />
          </div>
          <div className="stat-info">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <span>₨</span>
          </div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <OrdersIcon />
          </div>
          <div className="stat-info">
            <h3>{stats.pendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">
            <OrdersIcon />
          </div>
          <div className="stat-info">
            <h3>{stats.completedOrders}</h3>
            <p>Completed Orders</p>
          </div>
        </div>
      </div>

      <div className="recent-orders">
        <h3>Recent Orders</h3>
        <div className="orders-table">
          {orders.slice(0, 5).map(order => (
            <div key={order._id} className="order-row">
              <div className="order-info">
                <span className="order-number">{order.orderNumber}</span>
                <span className="customer-name">{order.customer.name}</span>
              </div>
              <div className="order-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
              </div>
              <div className="order-total">
                {formatCurrency(order.summary.total)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const OrdersManagement = () => (
    <div className="orders-management">
      <div className="orders-header">
        <h3>Order Management</h3>
        <button onClick={fetchDashboardData} className="refresh-btn">
          Refresh
        </button>
      </div>

      <div className="orders-table-full">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div className="order-basic">
                <h4>{order.orderNumber}</h4>
                <p>{order.customer.name} ({order.customer.email})</p>
                <p>{formatDate(order.createdAt)}</p>
              </div>
              <div className="order-status-section">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
                <span className="order-total">{formatCurrency(order.summary.total)}</span>
              </div>
            </div>

            <div className="order-items">
              <h5>Items:</h5>
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="order-actions">
              <select 
                value={order.status} 
                onChange={(e) => {
                  if (e.target.value === 'shipped') {
                    const trackingNumber = prompt('Enter tracking number:');
                    if (trackingNumber) {
                      updateOrderStatus(order._id, e.target.value, trackingNumber);
                    }
                  } else {
                    updateOrderStatus(order._id, e.target.value);
                  }
                }}
                className="status-select"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>
            </div>

            {order.shipping?.trackingNumber && (
              <div className="tracking-info">
                <strong>Tracking Number:</strong> {order.shipping.trackingNumber}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

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