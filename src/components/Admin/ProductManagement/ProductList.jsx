import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminApiService from '../../../services/adminApi';

// SVG Icons
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const ViewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"></polyline>
    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
  </svg>
);

const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23,4 23,10 17,10"></polyline>
    <polyline points="1,20 1,14 7,14"></polyline>
    <path d="M20.49,9A9,9,0,0,0,5.64,5.64L1,10m22,4a9,9,0,0,1-14.85,4.36L23,14"></path>
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15,18 9,12 15,6"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9,18 15,12 9,6"></polyline>
  </svg>
);

const DollarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17,5H9.5a3.5,3.5,0,0,0,0,7h5a3.5,3.5,0,0,1,0,7H6"></path>
  </svg>
);

const PackageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
    <path d="M21,16V8a2,2,0,0,0-1-1.73l-7-4a2,2,0,0,0-2,0l-7,4A2,2,0,0,0,3,8v8a2,2,0,0,0,1,1.73l7,4a2,2,0,0,0,2,0l7-4A2,2,0,0,0,21,16Z"></path>
    <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const TableIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9,9H15V15H9V9Z"></path>
    <path d="M21,9H15V15H21V9Z"></path>
    <path d="M21,3H15V9H21V3Z"></path>
    <path d="M15,15H9V21H15V15Z"></path>
    <path d="M9,3H3V9H9V3Z"></path>
    <path d="M3,9H9V15H3V9Z"></path>
    <path d="M3,15H9V21H3V15Z"></path>
    <path d="M15,21H21V15H15V21Z"></path>
  </svg>
);

// Component for displaying product images with fallback
const ProductImage = ({ product, className = "" }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const imageUrl = product?.images?.[0]?.url;

  if (!imageUrl || imageError) {
    return (
      <div className={`product-image-placeholder ${className}`}>
        <PackageIcon />
      </div>
    );
  }

  return (
    <img 
      src={imageUrl}
      alt={product.name}
      className={`product-image ${className} ${imageLoading ? 'loading' : ''}`}
      onError={() => {
        setImageError(true);
        setImageLoading(false);
      }}
      onLoad={() => setImageLoading(false)}
    />
  );
};

const ProductList = ({ 
  products, 
  loading, 
  stats, 
  filters, 
  pagination, 
  onFiltersChange, 
  onPaginationChange, 
  onProductDeleted, 
  onBulkOperation, 
  onRefresh 
}) => {
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  // Handle search
  const handleSearch = (searchTerm) => {
    onFiltersChange({ ...filters, search: searchTerm });
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p._id));
    }
  };

  // Handle single product select
  const handleProductSelect = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    try {
      await AdminApiService.deleteProduct(productId);
      onProductDeleted(productId);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      onBulkOperation('delete', selectedProducts);
      setSelectedProducts([]);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="product-list">
      {/* Header */}
      <div className="product-list-header">
        <div className="header-left">
          <h2 className="page-title">Products</h2>
          {stats && (
            <div className="stats-summary">
              <span className="stat-item">
                <strong>{stats.general?.totalProducts || 0}</strong> Total
              </span>
              <span className="stat-item">
                <strong>{products.filter(p => p.inStock).length}</strong> In Stock
              </span>
              <span className="stat-item">
                <strong>{products.filter(p => p.isFeatured).length}</strong> Featured
              </span>
            </div>
          )}
        </div>
        
        <div className="header-actions">
          <div className="view-toggle">
            <button 
              onClick={() => setViewMode('cards')}
              className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              title="Card View"
            >
              <GridIcon />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              title="Table View"
            >
              <TableIcon />
            </button>
          </div>
          
          <button 
            onClick={onRefresh}
            className="btn btn-secondary"
            disabled={loading}
          >
            <RefreshIcon />
            Refresh
          </button>
          
          <button 
            onClick={() => navigate('/admin/products/add')}
            className="btn btn-primary"
          >
            <PlusIcon />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="product-filters">
        <div className="search-container">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
        >
          <FilterIcon />
          Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="advanced-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>Category</label>
              <select 
                value={filters.category} 
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="luxury">Luxury</option>
                <option value="sport">Sport</option>
                <option value="classic">Classic</option>
                <option value="vintage">Vintage</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Stock Status</label>
              <select 
                value={filters.inStock} 
                onChange={(e) => handleFilterChange('inStock', e.target.value)}
              >
                <option value="">All Products</option>
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Featured</label>
              <select 
                value={filters.featured} 
                onChange={(e) => handleFilterChange('featured', e.target.value)}
              >
                <option value="">All Products</option>
                <option value="true">Featured Only</option>
                <option value="false">Non-Featured</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Sort By</label>
              <select 
                value={filters.sortBy} 
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="createdAt">Date Created</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="salesCount">Sales</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Order</label>
              <select 
                value={filters.sortOrder} 
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bulk-actions">
          <span className="selected-count">
            {selectedProducts.length} product(s) selected
          </span>
          <div className="bulk-buttons">
            <button 
              onClick={handleBulkDelete}
              className="btn btn-danger"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="products-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <PackageIcon />
            </div>
            <h3>No products found</h3>
            <p>Get started by adding your first product to the catalog.</p>
            <button 
              onClick={() => navigate('/admin/products/add')}
              className="btn btn-primary"
            >
              <PlusIcon />
              Add Your First Product
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'cards' ? (
              /* Card View */
              <div className="products-cards">
                {products.map((product) => (
                  <div key={product._id} className="product-card">
                    {/* Card Header with selection */}
                    <div className="card-header">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleProductSelect(product._id)}
                        className="product-checkbox"
                      />
                      {product.isFeatured && (
                        <span className="featured-badge">
                          <StarIcon />
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Product Image */}
                    <div className="card-image">
                      <ProductImage product={product} className="product-thumbnail" />
                      <div className="image-overlay">
                        <button 
                          onClick={() => navigate(`/admin/products/view/${product._id}`)}
                          className="overlay-btn view"
                          title="View Details"
                        >
                          <ViewIcon />
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="card-content">
                      <div className="product-title-section">
                        <h3 className="product-name">{product.name}</h3>
                        <span className="product-sku">SKU: {product.sku}</span>
                      </div>

                      <div className="product-details">
                        <div className="detail-row">
                          <span className="detail-label">Category:</span>
                          <span className={`category-badge ${product.category}`}>
                            {product.category}
                          </span>
                        </div>

                        <div className="detail-row">
                          <span className="detail-label">Price:</span>
                          <span className="product-price">{formatPrice(product.price)}</span>
                        </div>

                        <div className="detail-row">
                          <span className="detail-label">Stock:</span>
                          <span className={`stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                            {product.quantity} {product.quantity === 1 ? 'unit' : 'units'}
                          </span>
                        </div>

                        <div className="detail-row">
                          <span className="detail-label">Rating:</span>
                          <div className="rating">
                            <StarIcon />
                            <span>{product.rating?.toFixed(1) || '0.0'}</span>
                          </div>
                        </div>

                        <div className="detail-row">
                          <span className="detail-label">Status:</span>
                          <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>

                      <div className="card-meta">
                        <span className="created-date">Created {formatDate(product.createdAt)}</span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="card-actions">
                      <button 
                        onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                        className="action-btn edit"
                        title="Edit Product"
                      >
                        <EditIcon />
                        Edit
                      </button>
                      
                      <button 
                        onClick={() => setDeleteConfirm(product._id)}
                        className="action-btn delete"
                        title="Delete Product"
                      >
                        <DeleteIcon />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Table View (Existing) */
              <div className="products-table">
                <div className="table-header">
                  <div className="header-cell checkbox-cell">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === products.length && products.length > 0}
                      onChange={handleSelectAll}
                    />
                  </div>
                  <div className="header-cell">Product</div>
                  <div className="header-cell">Category</div>
                  <div className="header-cell">Price</div>
                  <div className="header-cell">Stock</div>
                  <div className="header-cell">Rating</div>
                  <div className="header-cell">Status</div>
                  <div className="header-cell">Created</div>
                  <div className="header-cell">Actions</div>
                </div>

                {/* Products */}
                {products.map((product) => (
                  <div key={product._id} className="table-row">
                    <div className="table-cell checkbox-cell">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleProductSelect(product._id)}
                      />
                    </div>
                    
                    <div className="table-cell product-cell">
                      <div className="product-info">
                        <ProductImage product={product} className="product-thumbnail" />
                        <div className="product-details">
                          <h4 className="product-name">{product.name}</h4>
                          <p className="product-sku">SKU: {product.sku}</p>
                          {product.isFeatured && (
                            <span className="featured-badge">
                              <StarIcon />
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="table-cell">
                      <span className={`category-badge ${product.category}`}>{product.category}</span>
                    </div>
                    
                    <div className="table-cell">
                      <span className="price">{formatPrice(product.price)}</span>
                    </div>
                    
                    <div className="table-cell">
                      <span className={`stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                        {product.quantity} {product.quantity === 1 ? 'unit' : 'units'}
                      </span>
                    </div>
                    
                    <div className="table-cell">
                      <div className="rating">
                        <StarIcon />
                        <span>{product.rating?.toFixed(1) || '0.0'}</span>
                      </div>
                    </div>
                    
                    <div className="table-cell">
                      <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="table-cell">
                      <span className="date">{formatDate(product.createdAt)}</span>
                    </div>
                    
                    <div className="table-cell actions-cell">
                      <div className="action-buttons">
                        <button 
                          onClick={() => navigate(`/admin/products/view/${product._id}`)}
                          className="action-btn view"
                          title="View Details"
                        >
                          <ViewIcon />
                        </button>
                        
                        <button 
                          onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                          className="action-btn edit"
                          title="Edit Product"
                        >
                          <EditIcon />
                        </button>
                        
                        <button 
                          onClick={() => setDeleteConfirm(product._id)}
                          className="action-btn delete"
                          title="Delete Product"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => onPaginationChange({ ...pagination, page: pagination.page - 1 })}
            disabled={!pagination.hasPrev}
            className="pagination-btn"
          >
            <ChevronLeftIcon />
            Previous
          </button>
          
          <div className="pagination-info">
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </div>
          
          <button 
            onClick={() => onPaginationChange({ ...pagination, page: pagination.page + 1 })}
            disabled={!pagination.hasNext}
            className="pagination-btn"
          >
            Next
            <ChevronRightIcon />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteProduct(deleteConfirm)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;