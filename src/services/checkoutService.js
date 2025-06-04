const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://princevibe-eccomerce-backend-production.up.railway.app/api';

class CheckoutService {
  // Create order
  async createOrder(orderData) {
    try {
      // Get current user from local storage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Add user ID to order data if user is logged in
      if (userData && userData._id) {
        orderData.customer.userId = userData._id;
      }

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      return data;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  }

  // Track order by order number
  async trackOrder(orderNumber) {
    try {
      const response = await fetch(`${API_URL}/orders/${orderNumber}/tracking`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to track order');
      }

      return data;
    } catch (error) {
      console.error('Track order error:', error);
      throw error;
    }
  }

  // Get order details by order number
  async getOrderDetails(orderNumber) {
    try {
      const response = await fetch(`${API_URL}/orders/${orderNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get order details');
      }

      return data;
    } catch (error) {
      console.error('Get order details error:', error);
      throw error;
    }
  }
}

const checkoutService = new CheckoutService();
export default checkoutService; 