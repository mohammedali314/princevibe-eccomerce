const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  // Helper method for making requests
  async makeRequest(url, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Get all products
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `/products${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest(url);
  }

  // Get featured products
  async getFeaturedProducts() {
    return this.makeRequest('/products/featured');
  }

  // Get products by category
  async getProductsByCategory(category) {
    return this.makeRequest(`/products/category/${category}`);
  }

  // Search products
  async searchProducts(query) {
    return this.makeRequest(`/products/search?q=${encodeURIComponent(query)}`);
  }

  // Get single product by ID
  async getProduct(id) {
    return this.makeRequest(`/products/${id}`);
  }

  // Get product by slug (if needed)
  async getProductBySlug(slug) {
    return this.makeRequest(`/products/slug/${slug}`);
  }

  // Get product statistics
  async getProductStats() {
    return this.makeRequest('/products/stats');
  }

  // Transform backend product data to match frontend expectations
  transformProduct(product) {
    return {
      id: product._id || product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images?.[0]?.url || product.image || 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop&q=80',
      images: product.images?.map(img => img.url) || [product.image] || ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop&q=80'],
      rating: product.rating,
      reviews: product.reviews?.count || 0,
      badge: product.badge,
      features: product.features || [],
      description: product.description,
      shortDescription: product.shortDescription,
      specifications: product.specifications || {},
      inStock: product.inStock,
      quantity: product.quantity,
      tags: product.tags || [],
      sku: product.sku,
      weight: product.weight,
      dimensions: product.dimensions,
      isNew: product.badge === 'New',
      shipping: "Free shipping within Pakistan", // Default shipping text
      warranty: this.getWarrantyText(product.category), // Generate warranty based on category
      discountPercentage: product.discountPercentage,
      salesCount: product.salesCount,
      viewCount: product.viewCount
    };
  }

  // Generate warranty text based on product category
  getWarrantyText(category) {
    const warranties = {
      luxury: "2 Year International Warranty",
      smart: "1 Year Manufacturer Warranty",
      sport: "1 Year Manufacturer Warranty",
      classic: "2 Year International Warranty"
    };
    return warranties[category] || "1 Year Warranty";
  }

  // Transform API response to include transformed products
  transformResponse(response) {
    if (response.data) {
      return {
        ...response,
        data: Array.isArray(response.data) 
          ? response.data.map(product => this.transformProduct(product))
          : this.transformProduct(response.data)
      };
    }
    return response;
  }

  // User Authentication Methods

  // User login
  async login(email, password) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // User signup/register
  async signup(userData) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // User logout
  async logout() {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        await this.makeRequest('/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout API error:', error);
      }
    }
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  }

  // Get current user profile
  async getUserProfile() {
    const token = localStorage.getItem('userToken');
    if (!token) throw new Error('No authentication token');
    
    return this.makeRequest('/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Update user profile
  async updateUserProfile(userData) {
    const token = localStorage.getItem('userToken');
    const user = this.getCurrentUser();
    
    if (!token) throw new Error('No authentication token');
    if (!user || !user._id) throw new Error('User ID not found');
    
    return this.makeRequest(`/users/${user._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  }

  // Check if user is authenticated
  isUserAuthenticated() {
    return !!localStorage.getItem('userToken');
  }

  // Get current user data from localStorage
  getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  // Store user authentication data
  storeUserAuth(token, userData) {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
  }
}

export default new ApiService(); 