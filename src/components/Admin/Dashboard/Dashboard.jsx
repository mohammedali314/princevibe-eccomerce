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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await AdminApi.getDashboardStats();
      
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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

  if (loading) {
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
    lowStockProducts: []
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
            <h3>Total Revenue</h3>
            <p className="stat-number">PKR {stats.totalRevenue.toLocaleString()}</p>
            <div className="stat-change positive">
              <ArrowUpIcon />
              <span>All time</span>
            </div>
          </div>
        </div>

        <div className="stat-card analytics">
          <div className="stat-icon">
            <ChartBarIcon />
          </div>
          <div className="stat-content">
            <h3>Analytics</h3>
            <p className="stat-number">Active</p>
            <div className="stat-change positive">
              <EyeIcon />
              <span>Real-time tracking</span>
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
          <div className="activity-item">
            <div className="activity-icon new">
              <ShoppingBagIcon />
            </div>
            <div className="activity-content">
              <p><strong>New order received</strong></p>
              <span className="activity-time">2 minutes ago</span>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon update">
              <CubeIcon />
            </div>
            <div className="activity-content">
              <p><strong>Product inventory updated</strong></p>
              <span className="activity-time">15 minutes ago</span>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon info">
              <UsersIcon />
            </div>
            <div className="activity-content">
              <p><strong>Admin logged in</strong></p>
              <span className="activity-time">1 hour ago</span>
            </div>
          </div>
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