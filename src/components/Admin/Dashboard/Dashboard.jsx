import React, { useState, useEffect } from 'react';
import {
  CubeIcon,
  ShoppingBagIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  EyeIcon,
  PlusIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import {
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/solid';
import AdminApi from '../../../services/adminApi';
import AddProductForm from '../ProductManagement/AddProductForm';
import './Dashboard.scss';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if admin is authenticated
      const token = localStorage.getItem('adminToken');
      const adminData = localStorage.getItem('adminData');
      
      console.log('Dashboard loading - Token exists:', !!token);
      console.log('Dashboard loading - Admin data exists:', !!adminData);
      
      if (!token || !adminData) {
        setError('You are not logged in. Please log in to access the dashboard.');
        return;
      }

      // Fetch dashboard stats using AdminApi
      const statsResponse = await AdminApi.getDashboardStats();
      if (statsResponse.success) {
        setDashboardData(statsResponse.data);
      }

      // Fetch recent activity using AdminApi
      const activityResponse = await AdminApi.getRecentActions(10);
      if (activityResponse.success) {
        setRecentActivity(activityResponse.data || []);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      if (error.message.includes('Token expired') || error.message.includes('Invalid token') || error.message.includes('401')) {
        setError('Your session has expired. Please log in again.');
        // Clear invalid token
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      } else {
        setError('Failed to load dashboard data. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Create sample orders for demo
  const createSampleOrders = async () => {
    try {
      const response = await AdminApi.createSampleOrders();
      if (response.success) {
        // Reload dashboard data
        loadDashboardData();
        alert('Sample orders created successfully!');
      }
    } catch (err) {
      console.error('Error creating sample orders:', err);
      alert('Error creating sample orders: ' + err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <ExclamationTriangleIcon className="error-icon" />
        <h3>Error Loading Dashboard</h3>
        <p>{error}</p>
        <button onClick={loadDashboardData} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  const stats = dashboardData || {
    totalProducts: 0,
    totalOrders: 0,
    recentOrders: 0,
    totalRevenue: 0,
    confirmedRevenue: 0,
    pendingRevenue: 0,
    lowStockProducts: []
  };

  // Helper function to format activity description
  const formatActivityDescription = (activity) => {
    switch (activity.action) {
      case 'admin_login':
        return `Admin ${activity.adminName} logged in`;
      case 'product_created':
        return `Created product: ${activity.targetName}`;
      case 'product_updated':
        return `Updated product: ${activity.targetName}`;
      case 'product_deleted':
        return `Deleted product: ${activity.targetName}`;
      case 'inventory_updated':
        return `Updated inventory for: ${activity.targetName}`;
      case 'order_status_update':
        return `Updated order status: ${activity.targetName}`;
      case 'order_created':
        return `New order received: ${activity.targetName}`;
      case 'order_deleted':
        return `Deleted order: ${activity.targetName}`;
      case 'stock_added':
        return `Added stock to: ${activity.targetName}`;
      case 'stock_removed':
        return `Removed stock from: ${activity.targetName}`;
      default:
        return activity.description || `${activity.action} performed`;
    }
  };

  // Helper function to get activity icon type
  const getActivityIconType = (activity) => {
    switch (activity.action) {
      case 'admin_login':
      case 'admin_logout':
        return 'info';
      case 'product_created':
      case 'order_created':
      case 'stock_added':
        return 'new';
      case 'product_updated':
      case 'product_deleted':
      case 'inventory_updated':
      case 'order_status_update':
      case 'order_deleted':
      case 'stock_removed':
        return 'update';
      default:
        return 'info';
    }
  };

  // Helper function to format time ago
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - activityTime) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="admin-dashboard-overview">
      {/* Quick Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card products">
          <div className="stat-icon">
            <CubeIcon />
          </div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-number">{stats.totalProducts}</p>
            <div className="stat-change positive">
              <ArrowUpIcon />
              <span>Active & Ready</span>
            </div>
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-icon">
            <ShoppingBagIcon />
          </div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-number">{stats.totalOrders}</p>
            <div className="stat-change">
              <ClockIcon />
              <span>{stats.recentOrders} this week</span>
            </div>
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon">
            <CurrencyDollarIcon />
          </div>
          <div className="stat-content">
            <h3>Confirmed Revenue</h3>
            <p className="stat-number">PKR {(stats.confirmedRevenue || 0).toLocaleString()}</p>
            <div className="stat-change positive">
              <ArrowUpIcon />
              <span>Shipped & Delivered</span>
            </div>
          </div>
        </div>

        <div className="stat-card analytics">
          <div className="stat-icon">
            <ChartBarIcon />
          </div>
          <div className="stat-content">
            <h3>Pending Revenue</h3>
            <p className="stat-number">PKR {(stats.pendingRevenue || 0).toLocaleString()}</p>
            <div className="stat-change">
              <ClockIcon />
              <span>Awaiting Fulfillment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="action-section">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <div className="action-card">
            <div className="action-icon">
              <PlusIcon />
            </div>
            <h3>Add New Product</h3>
            <p>Create a new luxury watch product</p>
            <button className="action-btn primary" onClick={() => setShowAddProductForm(true)}>
              Add Product
            </button>
          </div>

          <div className="action-card">
            <div className="action-icon">
              <ShoppingBagIcon />
            </div>
            <h3>View Orders</h3>
            <p>Manage customer orders and tracking</p>
            <button className="action-btn secondary">
              View Orders
            </button>
          </div>

          <div className="action-card">
            <div className="action-icon">
              <ChartBarIcon />
            </div>
            <h3>Analytics Report</h3>
            <p>View detailed sales and performance metrics</p>
            <button className="action-btn secondary">
              View Analytics
            </button>
          </div>

          <div className="action-card">
            <div className="action-icon">
              <UsersIcon />
            </div>
            <h3>Demo Data</h3>
            <p>Create sample orders for testing</p>
            <button 
              className="action-btn warning"
              onClick={createSampleOrders}
            >
              Create Sample Orders
            </button>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockProducts && stats.lowStockProducts.length > 0 && (
        <div className="alerts-section">
          <h2>Inventory Alerts</h2>
          <div className="alert-card warning">
            <div className="alert-header">
              <ExclamationTriangleIcon className="alert-icon" />
              <h3>Low Stock Items</h3>
            </div>
            <div className="alert-content">
              {stats.lowStockProducts.map((product) => (
                <div key={product._id} className="low-stock-item">
                  <span className="product-name">{product.name}</span>
                  <span className="product-sku">SKU: {product.sku}</span>
                  <span className="stock-count">{product.quantity} left</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="activity-section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity._id} className="activity-item">
                <div className={`activity-icon ${getActivityIconType(activity)}`}>
                  {activity.action.includes('product') ? (
                    <CubeIcon />
                  ) : activity.action.includes('order') ? (
                    <ShoppingBagIcon />
                  ) : (
                    <UsersIcon />
                  )}
                </div>
                <div className="activity-content">
                  <p><strong>{formatActivityDescription(activity)}</strong></p>
                  <span className="activity-time">{formatTimeAgo(activity.timestamp || activity.createdAt)}</span>
                  {activity.adminName && (
                    <span className="activity-admin">by {activity.adminName}</span>
                  )}
                </div>
                {activity.severity && (
                  <div className={`activity-severity ${activity.severity}`}>
                    {activity.severity}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-activity">
              <p>No recent activity to display.</p>
              <p className="activity-help">Activity will appear here when admin actions are performed.</p>
            </div>
          )}
        </div>
      </div>

      {showAddProductForm && (
        <AddProductForm
          isOpen={showAddProductForm}
          onClose={() => setShowAddProductForm(false)}
          onProductAdded={loadDashboardData}
        />
      )}
    </div>
  );
};

export default Dashboard; 