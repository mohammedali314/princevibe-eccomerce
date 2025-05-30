import React, { useState, useEffect } from 'react';
import { 
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UserOrders.scss';

const UserOrders = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock orders data - replace with actual API call
  const mockOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 299.99,
      items: [
        { name: 'Rolex Submariner', price: 299.99, quantity: 1, image: 'https://images.unsplash.com/photo-1594576662802-b55ad80c2d46' }
      ]
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'shipped',
      total: 599.98,
      items: [
        { name: 'Apple Watch Series 9', price: 299.99, quantity: 2, image: 'https://images.unsplash.com/photo-1510017098667-27dfc7150e5d' }
      ]
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      status: 'processing',
      total: 1299.99,
      items: [
        { name: 'Omega Speedmaster', price: 1299.99, quantity: 1, image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3' }
      ]
    },
    {
      id: 'ORD-004',
      date: '2024-01-01',
      status: 'cancelled',
      total: 199.99,
      items: [
        { name: 'Casio G-Shock', price: 199.99, quantity: 1, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30' }
      ]
    }
  ];

  // Auto-scroll to top when component loads
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Load orders
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
        setIsLoading(false);
      }, 1000);
    };

    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchQuery]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="status-icon delivered" />;
      case 'shipped':
        return <TruckIcon className="status-icon shipped" />;
      case 'processing':
        return <ClipboardDocumentListIcon className="status-icon processing" />;
      case 'cancelled':
        return <XCircleIcon className="status-icon cancelled" />;
      default:
        return <ClipboardDocumentListIcon className="status-icon" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'processing':
        return 'Processing';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="user-orders-page">
      <div className="container">
        {/* Header */}
        <div className="orders-header">
          <div className="header-content">
            <h1>My Orders</h1>
            <p>Track and manage your watch orders</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="orders-controls">
          <div className="search-container">
            <MagnifyingGlassIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search orders or products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="status-filters">
            <button 
              className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All Orders
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'processing' ? 'active' : ''}`}
              onClick={() => setStatusFilter('processing')}
            >
              Processing
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'shipped' ? 'active' : ''}`}
              onClick={() => setStatusFilter('shipped')}
            >
              Shipped
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'delivered' ? 'active' : ''}`}
              onClick={() => setStatusFilter('delivered')}
            >
              Delivered
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="orders-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state">
              <ClipboardDocumentListIcon className="empty-icon" />
              <h3>No orders found</h3>
              <p>
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'You haven\'t placed any orders yet. Start shopping to see your orders here!'
                }
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <button 
                  className="shop-now-btn"
                  onClick={() => navigate('/')}
                >
                  Start Shopping
                </button>
              )}
            </div>
          ) : (
            <div className="orders-list">
              {filteredOrders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3 className="order-id">Order {order.id}</h3>
                      <div className="order-meta">
                        <span className="order-date">
                          <CalendarIcon />
                          {formatDate(order.date)}
                        </span>
                        <span className={`order-status ${order.status}`}>
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                    <div className="order-total">
                      ${order.total.toFixed(2)}
                    </div>
                  </div>

                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-image">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="item-details">
                          <h4 className="item-name">{item.name}</h4>
                          <div className="item-meta">
                            <span className="item-quantity">Qty: {item.quantity}</span>
                            <span className="item-price">${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-actions">
                    <button className="action-btn view-btn">
                      <EyeIcon />
                      View Details
                    </button>
                    {order.status === 'delivered' && (
                      <button className="action-btn review-btn">
                        Write Review
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button className="action-btn cancel-btn">
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrders; 