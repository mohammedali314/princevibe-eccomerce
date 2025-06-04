const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://princevibe-eccomerce-backend-production.up.railway.app/api';

class OrderApi {
  /**
   * Create a new order
   * @param {Object} orderData - Order data including customer, items, payment info
   * @returns {Promise<Object>} Order creation response
   */
  static async createOrder(orderData) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(result.message || `Server error: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    }
  }

  /**
   * Get orders for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} List of user orders
   */
  static async getUserOrders(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Fetch orders error:', error);
      throw error;
    }
  }

  /**
   * Get order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Order details
   */
  static async getOrderById(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch order: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Fetch order error:', error);
      throw error;
    }
  }

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Update response
   */
  static async updateOrderStatus(orderId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error(`Failed to update order: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Update order error:', error);
      throw error;
    }
  }

  /**
   * Generate a unique order number
   * @returns {string} Order number
   */
  static generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PV${timestamp}${random}`;
  }

  /**
   * Validate order data before submission
   * @param {Object} orderData - Order data to validate
   * @returns {Object} Validation result
   */
  static validateOrderData(orderData) {
    const errors = {};

    // Validate customer data
    if (!orderData.customer?.name) {
      errors.customer = 'Customer name is required';
    }
    if (!orderData.customer?.email) {
      errors.email = 'Customer email is required';
    }
    if (!orderData.customer?.phone) {
      errors.phone = 'Customer phone is required';
    }
    if (!orderData.customer?.address?.street) {
      errors.address = 'Customer address is required';
    }

    // Validate items
    if (!orderData.items || orderData.items.length === 0) {
      errors.items = 'Order must contain at least one item';
    }

    // Validate payment
    if (!orderData.payment?.method) {
      errors.payment = 'Payment method is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

class OrderApi {
  /**
   * Create a new order
   * @param {Object} orderData - Order data including customer, items, payment info
   * @returns {Promise<Object>} Order creation response
   */
  static async createOrder(orderData) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(result.message || `Server error: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    }
  }

  /**
   * Get orders for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} List of user orders
   */
  static async getUserOrders(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Fetch orders error:', error);
      throw error;
    }
  }

  /**
   * Get order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Order details
   */
  static async getOrderById(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch order: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Fetch order error:', error);
      throw error;
    }
  }

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Update response
   */
  static async updateOrderStatus(orderId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error(`Failed to update order: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Update order error:', error);
      throw error;
    }
  }

  /**
   * Generate a unique order number
   * @returns {string} Order number
   */
  static generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PV${timestamp}${random}`;
  }

  /**
   * Validate order data before submission
   * @param {Object} orderData - Order data to validate
   * @returns {Object} Validation result
   */
  static validateOrderData(orderData) {
    const errors = {};

    // Validate customer data
    if (!orderData.customer?.name) {
      errors.customer = 'Customer name is required';
    }
    if (!orderData.customer?.email) {
      errors.email = 'Customer email is required';
    }
    if (!orderData.customer?.phone) {
      errors.phone = 'Customer phone is required';
    }
    if (!orderData.customer?.address?.street) {
      errors.address = 'Customer address is required';
    }

    // Validate items
    if (!orderData.items || orderData.items.length === 0) {
      errors.items = 'Order must contain at least one item';
    }

    // Validate payment
    if (!orderData.payment?.method) {
      errors.payment = 'Payment method is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

export default OrderApi; 