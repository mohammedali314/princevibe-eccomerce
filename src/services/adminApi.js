const ADMIN_API_BASE_URL = 'http://localhost:5000/api/admin';

class AdminApiService {
  constructor() {
    this.token = localStorage.getItem('adminToken');
  }

  // Helper method for making authenticated requests
  async makeRequest(url, options = {}) {
    try {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Admin API Request failed:', error);
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