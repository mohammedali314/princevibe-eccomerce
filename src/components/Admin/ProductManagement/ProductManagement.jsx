import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AdminApiService from '../../../services/adminApi';
import AddProductForm from './AddProductForm';
import ProductList from './ProductList';
import ProductDetails from './ProductDetails';
import ProductEdit from './ProductEdit';
import ProductStats from './ProductStats';
import './ProductManagement.scss';

const ProductManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    inStock: '',
    featured: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  // Load products
  const loadProducts = async (newFilters = filters, newPagination = pagination) => {
    try {
      setLoading(true);
      const response = await AdminApiService.getProducts({
        ...newFilters,
        page: newPagination.page,
        limit: newPagination.limit
      });
      
      if (response.success) {
        setProducts(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.total,
          pages: response.pagination.pages,
          hasNext: response.pagination.hasNext,
          hasPrev: response.pagination.hasPrev
        }));
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load stats
  const loadStats = async () => {
    try {
      const response = await AdminApiService.getProductStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Handle product creation success
  const handleProductCreated = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    loadStats(); // Refresh stats
    navigate('/admin/products');
  };

  // Handle product update success
  const handleProductUpdated = (updatedProduct) => {
    setProducts(prev => 
      prev.map(product => 
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
    loadStats(); // Refresh stats
  };

  // Handle product deletion
  const handleProductDeleted = (productId) => {
    setProducts(prev => prev.filter(product => product._id !== productId));
    loadStats(); // Refresh stats
  };

  // Handle bulk operations
  const handleBulkOperation = async (operation, productIds) => {
    try {
      setLoading(true);
      let success = false;

      switch (operation) {
        case 'delete':
          const deletePromises = productIds.map(id => AdminApiService.deleteProduct(id));
          await Promise.all(deletePromises);
          setProducts(prev => prev.filter(product => !productIds.includes(product._id)));
          success = true;
          break;
        
        case 'feature':
          // Implement bulk feature toggle
          success = true;
          break;
        
        case 'activate':
          // Implement bulk activate
          success = true;
          break;
        
        case 'deactivate':
          // Implement bulk deactivate
          success = true;
          break;
        
        default:
          break;
      }

      if (success) {
        loadStats();
        loadProducts();
      }
    } catch (error) {
      console.error('Bulk operation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    loadProducts();
    loadStats();
  }, []);

  // Update products when filters change
  useEffect(() => {
    const newPagination = { ...pagination, page: 1 };
    setPagination(newPagination);
    loadProducts(filters, newPagination);
  }, [filters]);

  return (
    <div className="product-management">
      <Routes>
        {/* Main product list view */}
        <Route 
          path="/" 
          element={
            <ProductList
              products={products}
              loading={loading}
              stats={stats}
              filters={filters}
              pagination={pagination}
              onFiltersChange={setFilters}
              onPaginationChange={(newPagination) => {
                setPagination(newPagination);
                loadProducts(filters, newPagination);
              }}
              onProductDeleted={handleProductDeleted}
              onBulkOperation={handleBulkOperation}
              onRefresh={() => {
                loadProducts();
                loadStats();
              }}
            />
          } 
        />
        
        {/* Add new product */}
        <Route 
          path="/add" 
          element={
            <AddProductForm 
              onProductCreated={handleProductCreated}
              onCancel={() => navigate('/admin/products')}
            />
          } 
        />
        
        {/* View product details */}
        <Route 
          path="/view/:id" 
          element={
            <ProductDetails 
              onProductUpdated={handleProductUpdated}
              onProductDeleted={handleProductDeleted}
            />
          } 
        />
        
        {/* Edit product */}
        <Route 
          path="/edit/:id" 
          element={
            <ProductEdit 
              onProductUpdated={handleProductUpdated}
              onCancel={() => navigate('/admin/products')}
            />
          } 
        />
        
        {/* Product statistics */}
        <Route 
          path="/stats" 
          element={
            <ProductStats 
              stats={stats}
              products={products}
              onRefresh={() => {
                loadProducts();
                loadStats();
              }}
            />
          } 
        />
      </Routes>
    </div>
  );
};

export default ProductManagement; 