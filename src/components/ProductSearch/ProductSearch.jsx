import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import './ProductSearch.scss';

const ProductSearch = ({ 
  onSearch, 
  onFilter, 
  categories = [], 
  isLoading = false,
  initialFilters = {}
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sortBy: 'newest',
    inStock: false,
    ...initialFilters
  });

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' }
  ];

  const ratingOptions = [
    { value: '', label: 'All Ratings' },
    { value: '4', label: '4+ Stars' },
    { value: '3', label: '3+ Stars' },
    { value: '2', label: '2+ Stars' },
    { value: '1', label: '1+ Stars' }
  ];

  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      onSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: value
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    const defaultFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sortBy: 'newest',
      inStock: false
    };
    setFilters(defaultFilters);
    setSearchTerm('');
    onFilter(defaultFilters);
    onSearch('');
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.rating) count++;
    if (filters.inStock) count++;
    if (searchTerm) count++;
    return count;
  };

  return (
    <div className="product-search">
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <MagnifyingGlassIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search for luxury watches..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => {
                setSearchTerm('');
                onSearch('');
              }}
            >
              <XMarkIcon />
            </button>
          )}
        </div>

        <button
          className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FunnelIcon />
          <span>Filters</span>
          {getActiveFilterCount() > 0 && (
            <span className="filter-count">{getActiveFilterCount()}</span>
          )}
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h3>
              <AdjustmentsHorizontalIcon />
              Advanced Filters
            </h3>
            <button className="close-filters-btn" onClick={() => setShowFilters(false)}>
              <XMarkIcon />
            </button>
          </div>

          <div className="filters-content">
            {/* Category Filter */}
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="filter-group">
              <label>Price Range (Rs.)</label>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  min="0"
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  min="0"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="filter-group">
              <label>Customer Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
              >
                {ratingOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* In Stock Filter */}
            <div className="filter-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                />
                <span className="checkmark"></span>
                In Stock Only
              </label>
            </div>

            {/* Filter Actions */}
            <div className="filter-actions">
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear All
              </button>
              <button 
                className="apply-filters-btn" 
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters:</span>
          
          {searchTerm && (
            <span className="filter-tag">
              Search: "{searchTerm}"
              <button onClick={() => {
                setSearchTerm('');
                onSearch('');
              }}>
                <XMarkIcon />
              </button>
            </span>
          )}

          {filters.category && (
            <span className="filter-tag">
              Category: {filters.category}
              <button onClick={() => handleFilterChange('category', '')}>
                <XMarkIcon />
              </button>
            </span>
          )}

          {(filters.minPrice || filters.maxPrice) && (
            <span className="filter-tag">
              Price: Rs.{filters.minPrice || '0'} - Rs.{filters.maxPrice || '∞'}
              <button onClick={() => {
                handleFilterChange('minPrice', '');
                handleFilterChange('maxPrice', '');
              }}>
                <XMarkIcon />
              </button>
            </span>
          )}

          {filters.rating && (
            <span className="filter-tag">
              {filters.rating}+ Stars
              <button onClick={() => handleFilterChange('rating', '')}>
                <XMarkIcon />
              </button>
            </span>
          )}

          {filters.inStock && (
            <span className="filter-tag">
              In Stock
              <button onClick={() => handleFilterChange('inStock', false)}>
                <XMarkIcon />
              </button>
            </span>
          )}

          <button className="clear-all-filters" onClick={clearFilters}>
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductSearch; 