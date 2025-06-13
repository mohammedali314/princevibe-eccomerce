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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const UserOrders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch orders from API (only for authenticated users)
  const fetchOrdersFromAPI = async () => {
    // Check for user ID in different possible property names
    const userId = user?._id || user?.id;
    
    if (!isAuthenticated || !userId) {
      setOrders([]);
      setFilteredOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Get token from localStorage - Fix key name to match ApiService
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

        const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch orders');
      }

        if (result.success) {
        const userOrders = result.data || [];
        setOrders(userOrders);
        setFilteredOrders(userOrders);
        } else {
        throw new Error(result.message || 'Failed to fetch orders');
      }
      
    } catch (error) {
      console.error('Error fetching orders from API:', error);
      setError(error.message);
      
      // Fallback to localStorage for compatibility
      try {
        const storedOrders = localStorage.getItem('prince_vibe_orders');
        let allOrders = [];

        if (storedOrders) {
          allOrders = JSON.parse(storedOrders);
          if (!Array.isArray(allOrders)) {
            allOrders = [];
          }
        }
        
        // Filter orders for current user by email
        const userOrders = allOrders.filter(order => {
          const customerEmail = order.customer?.email;
          const userEmail = order.userEmail;
          const directEmail = order.email;
          const currentEmail = user.email;
          
          // Exact matches
          if (customerEmail === currentEmail || 
              userEmail === currentEmail ||
              directEmail === currentEmail) {
            return true;
          }
          
          // For development/testing: also match if the username part (before @) is the same
          const getCurrentEmailUsername = () => currentEmail.split('@')[0];
          const getCustomerEmailUsername = () => customerEmail ? customerEmail.split('@')[0] : null;
          
          if (getCustomerEmailUsername() === getCurrentEmailUsername()) {
            return true;
          }
          
          return false;
        });
        
        setOrders(userOrders);
        setFilteredOrders(userOrders);
        
        if (userOrders.length > 0) {
          setError('Orders loaded from local storage. Please refresh to sync with server.');
          }
        
      } catch (parseError) {
        console.error('Error parsing localStorage orders:', parseError);
          setOrders([]);
          setFilteredOrders([]);
        setError('Failed to load orders from both server and local storage.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersFromAPI();
  }, [user, isAuthenticated]);

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
          // Handle different data structures
          const amountA = a.summary?.total || a.payment?.amount || a.totalAmount || 0;
          const amountB = b.summary?.total || b.payment?.amount || b.totalAmount || 0;
          return amountB - amountA;
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
    fetchOrdersFromAPI();
  };

  // Expose refresh function for external use (when orders are placed)
  window.refreshUserOrders = handleRefresh;

  const formatDeliveryDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const deliveryDate = new Date(today.getTime() + (5 * 24 * 60 * 60 * 1000)); // 5 days from now
    
    return deliveryDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // Helper function to get order total amount from different data structures
  const getOrderTotal = (order) => {
    return order.summary?.total || order.payment?.amount || order.totalAmount || 0;
  };

  // Helper function to get order number from different data structures
  const getOrderNumber = (order) => {
    return order.orderNumber || order.id?.slice(0, 8) || 'N/A';
  };

  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="user-orders">
        <div className="orders-header-section">
          <div className="container">
            <h1>My Orders</h1>
            <p>Track your order history</p>
          </div>
        </div>
        <div className="orders-container">
          <div className="auth-required">
            <InboxIcon className="auth-icon" />
            <h3>Sign In Required</h3>
            <p>Please sign in to view your orders and track your purchases.</p>
            <button 
              className="auth-btn"
              onClick={() => window.location.href = '/'}
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            {error && (
              <div className="error-message">
                <span>⚠️ {error}</span>
              </div>
            )}
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
            <button className="refresh-btn" onClick={handleRefresh} disabled={loading}>
              <ArrowPathIcon className="refresh-icon" />
              <span>{loading ? 'Loading...' : 'Refresh'}</span>
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
            <h3>
              {filterStatus === 'all' ? 'No Orders Yet' : 'No Orders Found'}
            </h3>
            <p>
              {filterStatus === 'all' 
                ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                : `No orders found with status "${filterStatus}". Try changing the filter or browse our products to place your first order.`
              }
            </p>
          </div>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              const orderId = order._id || order.id;
              const orderTotal = getOrderTotal(order);
              const orderNumber = getOrderNumber(order);
              
              return (
                <div key={orderId} className="order-card">
                  <div className="card-header">
                    <div className="order-info">
                      <h3>Order #{orderNumber}</h3>
                      <div className="order-meta">
                        <div className="order-date">
                          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className={`status-badge status-${order.status?.toLowerCase() || 'pending'}`}>
                      <svg className="status-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {order.status || 'Pending'}
                    </div>
                  </div>

                  <div className="card-content">
                    {/* Order Summary - Always visible */}
                    <div className="order-summary-minimal">
                      <div className="summary-row total">
                        <span>Total</span>
                        <span className="total-amount">
                          <svg className="currency-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          PKR {orderTotal.toLocaleString('en-PK')}
                        </span>
                      </div>
                    </div>

                    {/* Expanded Details - Show only when expanded */}
                    {expandedOrders.has(orderId) && (
                      <div className="expanded-details">
                    <div className="order-items">
                          <h4>Order Items</h4>
                          <div className="order-items-grid">
                            {order.items?.map((item, index) => (
                              <div key={index} className="order-item-card">
                                <div className="item-card-header">
                                  <div className="item-image">
                                    {item.image ? (
                                      <img src={item.image} alt={item.name} />
                                    ) : (
                                      <div className="no-image">
                                        <svg className="placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="item-card-content">
                                  <div className="item-info">
                                    <h5 className="item-name">{item.name}</h5>
                                    <div className="item-pricing">
                                      <span className="item-price">PKR {(item.price || 0).toLocaleString('en-PK')}</span>
                                      <span className="item-quantity">Qty: {item.quantity || 1}</span>
                                    </div>
                                    <div className="item-total">
                                      Total: PKR {((item.price || 0) * (item.quantity || 1)).toLocaleString('en-PK')}
                                    </div>
                                  </div>
                                </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="order-summary">
                      <div className="summary-row">
                            <span>Subtotal</span>
                            <span>PKR {(order.summary?.subtotal || orderTotal).toLocaleString('en-PK')}</span>
                          </div>
                          <div className="summary-row">
                            <span>Shipping</span>
                            <span>PKR {(order.summary?.shipping || order.shipping?.fee || 0).toLocaleString('en-PK')}</span>
                          </div>
                          <div className="summary-row">
                            <span>Payment Method</span>
                        <span className="payment-method">
                              {(order.payment?.method || 'COD').toUpperCase()}
                        </span>
                      </div>
                      <div className="summary-row total">
                            <span>Total</span>
                            <span className="total-amount">
                              <svg className="currency-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              PKR {orderTotal.toLocaleString('en-PK')}
                            </span>
                      </div>
                    </div>

                        <div className="status-description">
                      <p>{getStatusDescription(order.status)}</p>
                          <div className="delivery-info">
                            <svg className="delivery-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Estimated Delivery: {order.shipping?.estimatedDelivery ? 
                              new Date(order.shipping.estimatedDelivery).toLocaleDateString('en-PK') : 
                              formatDeliveryDate(order.createdAt)
                            }
                          </div>
                        </div>
                        </div>
                      )}
                  </div>

                  <div className="card-actions">
                    <button 
                      className="action-btn primary"
                      onClick={() => toggleOrderExpansion(orderId)}
                    >
                      <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d={expandedOrders.has(orderId) 
                            ? "M5 15l7-7 7 7" 
                            : "M19 9l-7 7-7-7"
                          } />
                      </svg>
                      {expandedOrders.has(orderId) ? 'Hide Details' : 'View Details'}
                    </button>
                      <button className="action-btn secondary">
                      <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Contact Support
                      </button>
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

// Utility function to save a new order to API and localStorage backup
export const saveNewOrder = async (userToken, orderData) => {
  try {
    // First try to save to API
    if (userToken) {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        return { success: true, order: result.data };
      } else {
        throw new Error(result.message || 'Failed to save order to database');
      }
    }
    
    // Fallback to localStorage
    throw new Error('No authentication token provided');
    
  } catch (error) {
    console.error('Error saving order to API:', error);
    
    // Fallback to localStorage for backward compatibility
    try {
      const existingOrders = localStorage.getItem('prince_vibe_orders');
      let orders = [];
      
      if (existingOrders) {
        orders = JSON.parse(existingOrders);
        if (!Array.isArray(orders)) {
          orders = [];
        }
      }
      
      // Add the new order with current timestamp
      const newOrder = {
        ...orderData,
        id: orderData.id || `ORD_${Date.now()}`,
        createdAt: orderData.createdAt || new Date().toISOString(),
        status: orderData.status || 'pending',
        isLocalOnly: true // Flag to indicate this order is not in backend
      };
      
      orders.unshift(newOrder); // Add to beginning of array
      localStorage.setItem('prince_vibe_orders', JSON.stringify(orders));
      
      return { 
        success: true, 
        order: newOrder,
        warning: 'Order saved locally only. Please contact support if not processed within 24 hours.'
      };
    } catch (localError) {
      console.error('Error saving order to localStorage:', localError);
      return { success: false, error: localError.message };
    }
  }
};

export default UserOrders; 