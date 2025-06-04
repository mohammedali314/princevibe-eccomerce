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
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch orders from localStorage (only real orders, no sample data)
  const fetchOrders = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get real orders from the existing localStorage key
      const storedOrders = localStorage.getItem('prince_vibe_orders');
      let allOrders = [];
      
      if (storedOrders) {
        try {
          allOrders = JSON.parse(storedOrders);
          // Ensure orders is an array
          if (!Array.isArray(allOrders)) {
            allOrders = [];
          }
        } catch (parseError) {
          console.error('Error parsing stored orders:', parseError);
          allOrders = [];
        }
      }
      
      // Filter orders for current user by email
      // Check multiple email fields and also allow partial matching for similar emails
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
          return (b.payment?.amount || b.totalAmount || 0) - (a.payment?.amount || a.totalAmount || 0);
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
              return (
                <div key={order.id} className="order-card">
                  <div className="card-header">
                    <div className="order-info">
                      <h3>Order #{order.orderNumber || order.id?.slice(0, 8)}</h3>
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
                          PKR {(order.payment?.amount || order.totalAmount || 0).toLocaleString('en-PK')}
                        </span>
                      </div>
                    </div>

                    {/* Expanded Details - Show only when expanded */}
                    {expandedOrders.has(order.id) && (
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
                            <span>PKR {(order.payment?.subtotal || order.payment?.amount || 0).toLocaleString('en-PK')}</span>
                          </div>
                          <div className="summary-row">
                            <span>Shipping</span>
                            <span>PKR {(order.shipping?.cost || 0).toLocaleString('en-PK')}</span>
                          </div>
                          <div className="summary-row">
                            <span>Payment Method</span>
                            <span className="payment-method">{(order.payment?.method || 'COD').toUpperCase()}</span>
                      </div>
                      <div className="summary-row total">
                            <span>Total</span>
                            <span className="total-amount">
                              <svg className="currency-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              PKR {(order.payment?.amount || order.totalAmount || 0).toLocaleString('en-PK')}
                            </span>
                      </div>
                    </div>

                        <div className="status-description">
                          <p>Your order has been received and is awaiting confirmation.</p>
                          <div className="delivery-info">
                            <svg className="delivery-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Estimated Delivery: {formatDeliveryDate(order.createdAt)}
                          </div>
                        </div>
                        </div>
                      )}
                  </div>

                  <div className="card-actions">
                    <button 
                      className="action-btn primary"
                      onClick={() => toggleOrderExpansion(order.id)}
                    >
                      <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d={expandedOrders.has(order.id) 
                            ? "M5 15l7-7 7 7" 
                            : "M19 9l-7 7-7-7"
                          } />
                      </svg>
                      {expandedOrders.has(order.id) ? 'Hide Details' : 'View Details'}
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

// Utility function to save a new order (can be used by checkout components)
export const saveNewOrder = (userEmail, orderData) => {
  try {
    const existingOrders = localStorage.getItem('prince_vibe_orders');
    let orders = [];
    
    if (existingOrders) {
      orders = JSON.parse(existingOrders);
      if (!Array.isArray(orders)) {
        orders = [];
      }
    }
    
    // Add the new order with current timestamp and user email
    const newOrder = {
      ...orderData,
      id: orderData.id || `ORD_${Date.now()}`,
      createdAt: orderData.createdAt || new Date().toISOString(),
      status: orderData.status || 'pending',
      userEmail: userEmail, // Ensure we track which user this order belongs to
      customer: {
        ...orderData.customer,
        email: userEmail
      }
    };
    
    orders.unshift(newOrder); // Add to beginning of array
    localStorage.setItem('prince_vibe_orders', JSON.stringify(orders));
    
    return { success: true, order: newOrder };
  } catch (error) {
    console.error('Error saving order:', error);
    return { success: false, error: error.message };
  }
};

export default UserOrders; 