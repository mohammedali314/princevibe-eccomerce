const ADMIN_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/admin` : 'https://princevibe-eccomerce-backend-production.up.railway.app/api/admin';

class AdminApiService {
  constructor() {
    this.token = localStorage.getItem('adminToken');
  }

  // Helper method for making authenticated requests
  async makeRequest(url, options = {}) {
    try {
      // Always get the latest token from localStorage
      this.token = localStorage.getItem('adminToken');
      
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // Add auth token if available
      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }

      const response = await fetch(`${ADMIN_API_BASE_URL}${url}`, {
        headers,
        ...options,
      });

      // Parse response JSON first
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse admin API response JSON:', parseError);
        throw new Error('Server error: Invalid response format');
      }

      if (!response.ok) {
        // Extract user-friendly error message from server response
        let errorMessage = 'An error occurred. Please try again.';
        
        if (data && data.message) {
          errorMessage = data.message;
        } else if (data && data.error) {
          errorMessage = data.error;
        } else {
          // Provide user-friendly messages for common HTTP status codes
          switch (response.status) {
            case 400:
              errorMessage = 'Invalid request. Please check your information and try again.';
              break;
            case 401:
              errorMessage = 'Invalid admin credentials. Please check your email and password.';
              break;
            case 403:
              errorMessage = 'Access denied. Admin privileges required.';
              break;
            case 404:
              errorMessage = 'The requested resource was not found.';
              break;
            case 422:
              errorMessage = 'Please check your information and try again.';
              break;
            case 423:
              errorMessage = 'Account is temporarily locked. Please try again later.';
              break;
            case 429:
              errorMessage = 'Too many requests. Please wait a moment and try again.';
              break;
            case 500:
              errorMessage = 'Server error. Please try again later.';
              break;
            case 503:
              errorMessage = 'Service temporarily unavailable. Please try again later.';
              break;
            default:
              errorMessage = 'Something went wrong. Please try again.';
          }
        }
        
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('Admin API Request failed:', error);
      
      // If it's a network error or fetch failed
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection and try again.');
      }
      
      // Re-throw our custom error messages
      throw error;
    }
  }

  // Authentication Methods
  async login(email, password) {
    const response = await this.makeRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success) {
      this.token = response.data.token;
      localStorage.setItem('adminToken', this.token);
      localStorage.setItem('adminData', JSON.stringify(response.data.admin));
    }

    return response;
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  }

  // Check if admin is authenticated
  isAuthenticated() {
    return !!this.token && !!localStorage.getItem('adminData');
  }

  // Get current admin data
  getCurrentAdmin() {
    const adminData = localStorage.getItem('adminData');
    return adminData ? JSON.parse(adminData) : null;
  }

  // Dashboard Analytics
  async getDashboardStats() {
    return this.makeRequest('/analytics/dashboard');
  }

  // Admin Activity Logs
  async getRecentActions(limit = 10) {
    return this.makeRequest(`/logs/recent?limit=${limit}`);
  }

  async getAdminLogs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `/logs${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest(url);
  }

  // Product Management
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `/products${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest(url);
  }

  async getProduct(id) {
    return this.makeRequest(`/products/${id}`);
  }

  async createProduct(productData) {
    // Check if productData is FormData (for file uploads)
    const isFormData = productData instanceof FormData;
    
    if (isFormData) {
      // Handle FormData separately to avoid Content-Type conflicts
      try {
        const headers = {};
        if (this.token) {
          headers.Authorization = `Bearer ${this.token}`;
        }

        const response = await fetch(`${ADMIN_API_BASE_URL}/products`, {
          method: 'POST',
          headers,
          body: productData,
        });

        // Parse response JSON first
        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          console.error('Failed to parse product creation response JSON:', parseError);
          throw new Error('Server error: Invalid response format');
        }

        if (!response.ok) {
          // Extract user-friendly error message from server response
          let errorMessage = 'Failed to create product. Please try again.';
          
          if (data && data.message) {
            errorMessage = data.message;
          } else if (data && data.error) {
            errorMessage = data.error;
          } else {
            // Provide user-friendly messages for common HTTP status codes
            switch (response.status) {
              case 400:
                errorMessage = 'Invalid product data. Please check all fields and try again.';
                break;
              case 401:
                errorMessage = 'Authentication required. Please log in again.';
                break;
              case 403:
                errorMessage = 'Access denied. Admin privileges required.';
                break;
              case 413:
                errorMessage = 'Images are too large. Please use smaller images and try again.';
                break;
              case 422:
                errorMessage = 'Please check all product information and try again.';
                break;
              case 429:
                errorMessage = 'Too many requests. Please wait a moment and try again.';
                break;
              case 500:
                errorMessage = 'Server error. Please try again later.';
                break;
              default:
                errorMessage = 'Failed to create product. Please try again.';
            }
          }
          
          throw new Error(errorMessage);
        }

        return data;
      } catch (error) {
        console.error('Admin API Request failed:', error);
        
        // If it's a network error or fetch failed
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          throw new Error('Unable to connect to server. Please check your internet connection and try again.');
        }
        
        // Re-throw our custom error messages
        throw error;
      }
    } else {
      // Handle regular JSON data
      return this.makeRequest('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
    }
  }

  async updateProduct(id, productData) {
    // Check if productData is FormData (for file uploads)
    const isFormData = productData instanceof FormData;
    
    if (isFormData) {
      // Handle FormData separately to avoid Content-Type conflicts
      try {
        const headers = {};
        if (this.token) {
          headers.Authorization = `Bearer ${this.token}`;
        }

        const response = await fetch(`${ADMIN_API_BASE_URL}/products/${id}`, {
          method: 'PUT',
          headers,
          body: productData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
      } catch (error) {
        console.error('Admin API Request failed:', error);
        throw error;
      }
    } else {
      // Handle regular JSON data
      return this.makeRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
    }
  }

  async deleteProduct(id) {
    return this.makeRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async updateInventory(id, quantity, operation = 'set') {
    return this.makeRequest(`/products/${id}/inventory`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity, operation }),
    });
  }

  // Order Management
  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `/orders${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest(url);
  }

  async getOrder(id) {
    return this.makeRequest(`/orders/${id}`);
  }

  async updateOrderStatus(id, status, note, trackingNumber) {
    const body = { status, note };
    if (trackingNumber) body.trackingNumber = trackingNumber;
    
    return this.makeRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async getOrderStats() {
    return this.makeRequest('/orders/stats');
  }

  // Product Stats
  async getProductStats() {
    return this.makeRequest('/products/stats');
  }

  async createSampleOrders() {
    return this.makeRequest('/orders/sample', {
      method: 'POST',
    });
  }

  // Image Upload
  async uploadProductImages(productId, formData) {
    // Don't set Content-Type for FormData, let browser set it with boundary
    return this.makeRequest(`/products/${productId}/images`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });
  }

  async deleteProductImage(productId, imageId) {
    return this.makeRequest(`/products/${productId}/images/${imageId}`, {
      method: 'DELETE',
    });
  }
}

export default new AdminApiService(); 