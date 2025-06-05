import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import orderService from '../../services/orderService';
import './TrackOrder.scss';

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchMode, setSearchMode] = useState('specific'); // 'specific' or 'all'

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    
    if (!orderNumber.trim() || !email.trim()) {
      setError('Please enter both order number and email address');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);
    setOrders(null);

    try {
      const result = await orderService.trackGuestOrder(orderNumber.trim(), email.trim());
      
      if (result.success) {
        setOrder(result.order);
      } else {
        setError(result.error || 'Order not found');
      }
    } catch (error) {
      setError('Failed to track order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFindAllOrders = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);
    setOrders(null);

    try {
      const result = await orderService.getGuestOrders(email.trim());
      
      if (result.success && result.orders && result.orders.length > 0) {
        setOrders(result.orders);
      } else {
        setError('No orders found for this email address');
      }
    } catch (error) {
      setError('Failed to find orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectOrder = (selectedOrder) => {
    setOrder(selectedOrder);
    setOrders(null);
    setOrderNumber(selectedOrder.orderNumber);
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: ClockIcon,
      confirmed: CheckCircleIcon,
      processing: ClockIcon,
      shipped: TruckIcon,
      delivered: CheckCircleIcon,
      cancelled: ExclamationTriangleIcon
    };
    return icons[status] || ClockIcon;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      processing: '#8b5cf6',
      shipped: '#06b6d4',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="track-order">
      <div className="track-order-header">
        <div className="container">
          <h1>Track Your Order</h1>
          <p>Enter your order details to track your shipment</p>
        </div>
      </div>

      <div className="track-order-container">
        <div className="track-form-section">
          {/* Search Mode Toggle */}
          <div className="search-mode-toggle">
            <h2>Order Tracking</h2>
            <div className="toggle-buttons">
              <button
                type="button"
                className={`toggle-btn ${searchMode === 'specific' ? 'active' : ''}`}
                onClick={() => {
                  setSearchMode('specific');
                  setOrder(null);
                  setOrders(null);
                  setError('');
                }}
              >
                <DocumentTextIcon className="toggle-icon" />
                Track Specific Order
              </button>
              <button
                type="button"
                className={`toggle-btn ${searchMode === 'all' ? 'active' : ''}`}
                onClick={() => {
                  setSearchMode('all');
                  setOrder(null);
                  setOrders(null);
                  setError('');
                  setOrderNumber('');
                }}
              >
                <EnvelopeIcon className="toggle-icon" />
                Find All My Orders
              </button>
            </div>
          </div>

          {/* Track Specific Order Form */}
          {searchMode === 'specific' && (
            <form onSubmit={handleTrackOrder} className="track-form">
              <p>Enter your order number and email address to track your order</p>
              
              <div className="form-group">
                <label>Order Number</label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Enter your order number (e.g. PVMBHXNEKD2LG)"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {error && (
                <div className="error-message">
                  <ExclamationTriangleIcon className="error-icon" />
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="track-button">
                <MagnifyingGlassIcon className="button-icon" />
                {loading ? 'Tracking...' : 'Track Order'}
              </button>
            </form>
          )}

          {/* Find All Orders Form */}
          {searchMode === 'all' && (
            <form onSubmit={handleFindAllOrders} className="track-form">
              <div className="forgot-order-info">
                <h3>📧 Forgot Your Order Number?</h3>
                <p>No problem! Enter your email address and we'll show you all your recent orders.</p>
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter the email used during checkout"
                  required
                />
              </div>

              {error && (
                <div className="error-message">
                  <ExclamationTriangleIcon className="error-icon" />
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="track-button">
                <MagnifyingGlassIcon className="button-icon" />
                {loading ? 'Searching...' : 'Find My Orders'}
              </button>
            </form>
          )}
        </div>

        {/* Orders List (when user searched by email only) */}
        {orders && (
          <div className="orders-list-section">
            <div className="orders-header">
              <h3>Your Orders ({orders.length} found)</h3>
              <p>Click on any order to view details</p>
            </div>

            <div className="orders-grid">
              {orders.map((orderItem) => (
                <div key={orderItem._id} className="order-card" onClick={() => selectOrder(orderItem)}>
                  <div className="order-card-header">
                    <div className="order-number">#{orderItem.orderNumber}</div>
                    <div className="order-status" style={{ color: getStatusColor(orderItem.status) }}>
                      {orderItem.status.charAt(0).toUpperCase() + orderItem.status.slice(1)}
                    </div>
                  </div>
                  
                  <div className="order-card-body">
                    <p className="order-date">
                      <strong>Date:</strong> {formatDate(orderItem.createdAt)}
                    </p>
                    <p className="order-total">
                      <strong>Total:</strong> {formatCurrency(orderItem.summary?.total || 0)}
                    </p>
                    <p className="order-items">
                      <strong>Items:</strong> {orderItem.items?.length || 0} item(s)
                    </p>
                  </div>
                  
                  <div className="order-card-footer">
                    <button className="view-details-btn">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {order && (
          <div className="order-details-section">
            <div className="order-header">
              <h3>Order Details</h3>
              <div className="order-number">Order #{order.orderNumber}</div>
            </div>

            <div className="order-status">
              <div className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                {React.createElement(getStatusIcon(order.status), { className: 'status-icon' })}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
              <div className="order-date">
                Placed on {formatDate(order.createdAt)}
              </div>
            </div>

            <div className="order-summary">
              <h4>Order Summary</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <span>Total Amount</span>
                  <span className="amount">{formatCurrency(order.summary?.total || 0)}</span>
                </div>
                <div className="summary-item">
                  <span>Payment Method</span>
                  <span>{(order.payment?.method || 'COD').toUpperCase()}</span>
                </div>
                <div className="summary-item">
                  <span>Items</span>
                  <span>{order.items?.length || 0} item(s)</span>
                </div>
              </div>
            </div>

            <div className="shipping-details">
              <h4>Shipping Details</h4>
              <div className="shipping-address">
                <strong>{order.customer?.name}</strong><br />
                {order.customer?.address?.street}<br />
                {order.customer?.address?.city}, {order.customer?.address?.state} {order.customer?.address?.zipCode}<br />
                {order.customer?.address?.country}<br />
                Phone: {order.customer?.phone}
              </div>
            </div>

            <div className="items-list">
              <h4>Items Ordered</h4>
              {order.items?.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="no-image">📦</div>
                    )}
                  </div>
                  <div className="item-details">
                    <h5>{item.name}</h5>
                    <p>Quantity: {item.quantity}</p>
                    <p className="item-price">{formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            {order.timeline && order.timeline.length > 0 && (
              <div className="order-timeline">
                <h4>Order Timeline</h4>
                <div className="timeline">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h5>{event.status.charAt(0).toUpperCase() + event.status.slice(1)}</h5>
                        <p>{event.note}</p>
                        <span className="timeline-date">{formatDate(event.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="track-actions">
              <button onClick={() => window.print()} className="print-button">
                Print Order Details
              </button>
              <button onClick={() => {setOrder(null); setOrderNumber(''); setEmail('');}} className="track-another">
                Track Another Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder; 