import React, { useState, useEffect } from 'react';
import {
  TruckIcon,
  CalendarIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  CogIcon,
  PaperAirplaneIcon,
  InboxIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import './UserOrders.scss';

const UserOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Fetch orders from backend API
  const fetchOrders = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://princevibe-eccomerce-backend-production.up.railway.app/api';
      
      const response = await fetch(`${API_BASE_URL}/orders/user/${user.id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken') || user.token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setOrders(result.data || []);
          setFilteredOrders(result.data || []);
        } else {
          console.error('Failed to fetch orders:', result.message);
          setOrders([]);
          setFilteredOrders([]);
        }
      } else {
        // If API is not available, fall back to email-based lookup for now
        console.log('API not available, using fallback method');
        
        // Try to get orders by email as fallback
        const emailResponse = await fetch(`${API_BASE_URL}/orders/by-email/${user.email}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (emailResponse.ok) {
          const emailResult = await emailResponse.json();
          if (emailResult.success) {
            setOrders(emailResult.data || []);
            setFilteredOrders(emailResult.data || []);
          } else {
            setOrders([]);
            setFilteredOrders([]);
          }
        } else {
          setOrders([]);
          setFilteredOrders([]);
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    let filtered = [...orders];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'amount':
          return (b.summary?.total || 0) - (a.summary?.total || 0);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredOrders(filtered);
  }, [orders, filterStatus, sortBy]);

  const getStatusIcon = (status) => {
    const icons = {
      pending: ClockIcon,
      confirmed: CheckCircleIcon,
      processing: CogIcon,
      shipped: TruckIcon,
      delivered: CheckCircleIcon,
      cancelled: XMarkIcon,
      returned: ArrowPathIcon
    };
    return icons[status] || ClockIcon;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'color: #f59e0b;',
      confirmed: 'color: #3b82f6;',
      processing: 'color: #8b5cf6;',
      shipped: 'color: #06b6d4;',
      delivered: 'color: #10b981;',
      cancelled: 'color: #ef4444;',
      returned: 'color: #f97316;'
    };
    return colors[status] || 'color: #6b7280;';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusDescription = (status) => {
    const descriptions = {
      pending: 'Your order has been received and is awaiting confirmation.',
      confirmed: 'Your order has been confirmed and is being prepared.',
      processing: 'Your order is currently being processed and prepared for shipment.',
      shipped: 'Your order has been shipped and is on its way to you.',
      delivered: 'Your order has been successfully delivered.',
      cancelled: 'This order has been cancelled.',
      returned: 'This order has been returned.'
    };
    return descriptions[status] || 'Order status is being updated.';
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      delivered: orders.filter(o => o.status === 'delivered').length
    };
    return stats;
  };

  const handleRefresh = () => {
    fetchOrders();
  };

  if (loading) {
    return (
      <div className="user-orders">
        <div className="orders-header-section">
          <div className="container">
            <h1>My Orders</h1>
            <p>Track your order history</p>
          </div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  const stats = getOrderStats();

  return (
    <div className="user-orders">
      {/* Luxury Header */}
      <div className="orders-header-section">
        <div className="container">
          <h1>My Orders</h1>
          <p>Track your order history</p>
        </div>
      </div>

      <div className="orders-container">
        <div className="orders-header">
          <div className="header-left">
            <h2>Order History</h2>
            <p>Manage and track all your orders</p>
          </div>
          <div className="header-right">
            <div className="header-stats">
              <div className="stat">
                <span className="stat-number">{stats.total}</span>
                <span className="stat-label">Total Orders</span>
              </div>
              <div className="stat">
                <span className="stat-number">{stats.pending}</span>
                <span className="stat-label">Pending</span>
              </div>
              <div className="stat">
                <span className="stat-number">{stats.delivered}</span>
                <span className="stat-label">Delivered</span>
              </div>
            </div>
            <button className="refresh-btn" onClick={handleRefresh}>
              <ArrowPathIcon className="refresh-icon" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="orders-filters">
          <div className="filter-group">
            <label>Filter by Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Sort by</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Date (Newest First)</option>
              <option value="amount">Amount (Highest First)</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <InboxIcon className="no-orders-icon" />
            <h3>No Orders Found</h3>
            <p>
              {filterStatus === 'all' 
                ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                : `No orders found with status "${filterStatus}". Try changing the filter.`
              }
            </p>
          </div>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <div key={order._id || order.id} className="order-card">
                  <div className="card-header">
                    <div className="order-info">
                      <h3>Order #{order.orderNumber}</h3>
                      <div className="order-meta">
                        <div className="order-date">
                          <CalendarIcon className="icon" />
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="status-badge" style={{ [getStatusColor(order.status).split(':')[0]]: getStatusColor(order.status).split(':')[1] }}>
                      <StatusIcon className="status-icon" />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="order-items">
                      <h4>Items ({order.items?.length || 0})</h4>
                      <div className="items-list">
                        {(order.items || []).slice(0, 2).map((item, index) => (
                          <div key={index} className="item-summary">
                            <span className="item-name">{item.name}</span>
                            <span className="item-quantity">x{item.quantity}</span>
                          </div>
                        ))}
                        {(order.items || []).length > 2 && (
                          <div className="more-items">
                            +{(order.items || []).length - 2} more items
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="order-summary">
                      <div className="summary-row">
                        <span>Payment Method:</span>
                        <span className="payment-method">
                          <CreditCardIcon className="payment-icon" />
                          {order.payment?.method?.toUpperCase() || 'COD'}
                        </span>
                      </div>
                      <div className="summary-row total">
                        <span>Total Amount:</span>
                        <span className="total-amount">{formatCurrency(order.summary?.total || 0)}</span>
                      </div>
                    </div>

                    <div className="order-status-description">
                      <p>{getStatusDescription(order.status)}</p>
                      {order.shipping?.trackingNumber && (
                        <div className="tracking-info">
                          <TruckIcon className="tracking-icon" />
                          <span>Tracking: {order.shipping.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card-actions">
                    <button className="action-btn primary">
                      <EyeIcon className="btn-icon" />
                      View Details
                    </button>
                    {order.status === 'delivered' && (
                      <button className="action-btn secondary">
                        <ArrowDownTrayIcon className="btn-icon" />
                        Download Invoice
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders; 