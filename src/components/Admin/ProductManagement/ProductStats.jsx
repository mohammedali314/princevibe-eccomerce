import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// SVG Icons
const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="19,12 5,12"></polyline>
    <polyline points="12,19 5,12 12,5"></polyline>
  </svg>
);

const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23,4 23,10 17,10"></polyline>
    <polyline points="1,20 1,14 7,14"></polyline>
    <path d="M20.49,9A9,9,0,0,0,5.64,5.64L1,10m22,4L18.36,18.36A9,9,0,0,1,3.51,15"></path>
  </svg>
);

const TrendUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline>
    <polyline points="17,6 23,6 23,12"></polyline>
  </svg>
);

const TrendDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23,18 13.5,8.5 8.5,13.5 1,6"></polyline>
    <polyline points="17,18 23,18 23,12"></polyline>
  </svg>
);

const PackageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
    <path d="M21,16V8a2,2,0,0,0-1-1.73l-7-4a2,2,0,0,0-2,0l-7,4A2,2,0,0,0,3,8v8a2,2,0,0,0,1,1.73l7,4a2,2,0,0,0,2,0l7-4A2,2,0,0,0,21,16Z"></path>
    <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const DollarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17,5H9.5a3.5,3.5,0,0,0,0,7h5a3.5,3.5,0,0,1,0,7H6"></path>
  </svg>
);

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
  </svg>
);

const ProductStats = ({ stats, products, onRefresh }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Calculate derived statistics
  const calculateStats = () => {
    if (!products || products.length === 0) {
      return {
        totalProducts: 0,
        activeProducts: 0,
        inactiveProducts: 0,
        inStockProducts: 0,
        outOfStockProducts: 0,
        featuredProducts: 0,
        averagePrice: 0,
        totalValue: 0,
        categoryDistribution: {},
        topProducts: [],
        lowStockProducts: []
      };
    }

    const activeProducts = products.filter(p => p.isActive).length;
    const inStockProducts = products.filter(p => p.inStock).length;
    const featuredProducts = products.filter(p => p.isFeatured).length;
    
    const totalValue = products.reduce((sum, product) => {
      return sum + (product.price * product.quantity);
    }, 0);

    const averagePrice = products.reduce((sum, product) => sum + product.price, 0) / products.length;

    // Category distribution
    const categoryDistribution = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    // Top products by sales or rating
    const topProducts = [...products]
      .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
      .slice(0, 5);

    // Low stock products (less than 10 units)
    const lowStockProducts = products
      .filter(p => p.quantity < 10)
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 10);

    return {
      totalProducts: products.length,
      activeProducts,
      inactiveProducts: products.length - activeProducts,
      inStockProducts,
      outOfStockProducts: products.length - inStockProducts,
      featuredProducts,
      averagePrice,
      totalValue,
      categoryDistribution,
      topProducts,
      lowStockProducts
    };
  };

  const calculatedStats = calculateStats();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value, total) => {
    if (total === 0) return '0%';
    return `${((value / total) * 100).toFixed(1)}%`;
  };

  // Handle refresh
  const handleRefresh = async () => {
    setLoading(true);
    await onRefresh();
    setLoading(false);
  };

  return (
    <div className="product-stats">
      {/* Header */}
      <div className="stats-header">
        <button 
          onClick={() => navigate('/admin/products')}
          className="back-btn"
        >
          <ArrowLeftIcon />
          Back to Products
        </button>
        
        <div className="header-actions">
          <button 
            onClick={handleRefresh}
            className="btn btn-secondary"
            disabled={loading}
          >
            <RefreshIcon />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="stats-content">
        <h1>Product Statistics</h1>

        {/* Overview Cards */}
        <div className="stats-overview">
          <div className="stat-card primary">
            <div className="stat-icon">
              <PackageIcon />
            </div>
            <div className="stat-info">
              <h3>Total Products</h3>
              <p className="stat-number">{calculatedStats.totalProducts}</p>
              <span className="stat-trend">
                <TrendUpIcon />
                Active: {calculatedStats.activeProducts}
              </span>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">
              <DollarIcon />
            </div>
            <div className="stat-info">
              <h3>Total Inventory Value</h3>
              <p className="stat-number">{formatCurrency(calculatedStats.totalValue)}</p>
              <span className="stat-trend">
                Avg: {formatCurrency(calculatedStats.averagePrice)}
              </span>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">
              <PackageIcon />
            </div>
            <div className="stat-info">
              <h3>In Stock</h3>
              <p className="stat-number">{calculatedStats.inStockProducts}</p>
              <span className="stat-trend">
                {formatPercentage(calculatedStats.inStockProducts, calculatedStats.totalProducts)} of total
              </span>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">
              <StarIcon />
            </div>
            <div className="stat-info">
              <h3>Featured Products</h3>
              <p className="stat-number">{calculatedStats.featuredProducts}</p>
              <span className="stat-trend">
                {formatPercentage(calculatedStats.featuredProducts, calculatedStats.totalProducts)} of total
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="stats-details">
          {/* Category Distribution */}
          <div className="stats-section">
            <h2>Category Distribution</h2>
            <div className="category-stats">
              {Object.entries(calculatedStats.categoryDistribution).map(([category, count]) => (
                <div key={category} className="category-item">
                  <div className="category-info">
                    <span className="category-name">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                    <span className="category-count">{count} products</span>
                  </div>
                  <div className="category-bar">
                    <div 
                      className="category-fill"
                      style={{ 
                        width: formatPercentage(count, calculatedStats.totalProducts),
                        backgroundColor: getCategoryColor(category)
                      }}
                    ></div>
                  </div>
                  <span className="category-percentage">
                    {formatPercentage(count, calculatedStats.totalProducts)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stock Status */}
          <div className="stats-section">
            <h2>Stock Status</h2>
            <div className="stock-grid">
              <div className="stock-item in-stock">
                <h4>In Stock</h4>
                <p className="stock-number">{calculatedStats.inStockProducts}</p>
                <span>{formatPercentage(calculatedStats.inStockProducts, calculatedStats.totalProducts)}</span>
              </div>
              <div className="stock-item out-of-stock">
                <h4>Out of Stock</h4>
                <p className="stock-number">{calculatedStats.outOfStockProducts}</p>
                <span>{formatPercentage(calculatedStats.outOfStockProducts, calculatedStats.totalProducts)}</span>
              </div>
              <div className="stock-item active">
                <h4>Active</h4>
                <p className="stock-number">{calculatedStats.activeProducts}</p>
                <span>{formatPercentage(calculatedStats.activeProducts, calculatedStats.totalProducts)}</span>
              </div>
              <div className="stock-item inactive">
                <h4>Inactive</h4>
                <p className="stock-number">{calculatedStats.inactiveProducts}</p>
                <span>{formatPercentage(calculatedStats.inactiveProducts, calculatedStats.totalProducts)}</span>
              </div>
            </div>
          </div>

          {/* Top Products */}
          {calculatedStats.topProducts.length > 0 && (
            <div className="stats-section">
              <h2>Top Products by Sales</h2>
              <div className="top-products">
                {calculatedStats.topProducts.map((product, index) => (
                  <div key={product._id} className="top-product-item">
                    <div className="product-rank">#{index + 1}</div>
                    <img 
                      src={product.images?.[0]?.url || '/placeholder-watch.jpg'} 
                      alt={product.name}
                      className="product-thumbnail"
                    />
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p>{product.category}</p>
                      <span className="product-sales">{product.salesCount || 0} sales</span>
                    </div>
                    <div className="product-price">
                      {formatCurrency(product.price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Low Stock Alert */}
          {calculatedStats.lowStockProducts.length > 0 && (
            <div className="stats-section low-stock-alert">
              <h2>Low Stock Alert</h2>
              <div className="low-stock-products">
                {calculatedStats.lowStockProducts.map((product) => (
                  <div key={product._id} className="low-stock-item">
                    <img 
                      src={product.images?.[0]?.url || '/placeholder-watch.jpg'} 
                      alt={product.name}
                      className="product-thumbnail"
                    />
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p>{product.sku}</p>
                    </div>
                    <div className="stock-warning">
                      <span className="stock-count">{product.quantity} left</span>
                      <button 
                        onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                        className="btn btn-sm btn-warning"
                      >
                        Restock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="stats-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button 
              onClick={() => navigate('/admin/products/add')}
              className="btn btn-primary"
            >
              Add New Product
            </button>
            <button 
              onClick={() => navigate('/admin/products')}
              className="btn btn-secondary"
            >
              View All Products
            </button>
            <button 
              onClick={() => navigate('/admin/products?filter=lowStock')}
              className="btn btn-warning"
            >
              View Low Stock
            </button>
            <button 
              onClick={() => navigate('/admin/products?filter=featured')}
              className="btn btn-info"
            >
              View Featured
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get category colors
const getCategoryColor = (category) => {
  const colors = {
    luxury: '#6366f1',
    sport: '#10b981',
    classic: '#f59e0b',
    vintage: '#ef4444'
  };
  return colors[category] || '#6b7280';
};

export default ProductStats; 