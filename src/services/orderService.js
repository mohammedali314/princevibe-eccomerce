// Order Service for Cash on Delivery
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://princevibe-eccomerce-backend-production.up.railway.app/api';

class OrderService {
  constructor() {
    this.orders = this.loadOrdersFromStorage();
  }

  loadOrdersFromStorage() {
    try {
      const stored = localStorage.getItem('prince_vibe_orders');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading orders from storage:', error);
      return [];
    }
  }

  // Generate unique order number
  generateOrderNumber() {
    const prefix = 'PV';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  // Create a new COD order (updated to use API for authenticated users)
  async createCODOrder(orderData) {
    try {
      // Get user authentication data
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');
      const isAuthenticated = !!token && !!userData._id;

      // For guest users (not authenticated), don't save the order
      if (!isAuthenticated) {
        console.log('Guest user detected - order will not be saved');
        
        // Return success but with a message about guest orders
        return {
          success: true,
          order: {
            orderNumber: this.generateOrderNumber(),
            customer: orderData.customer,
            items: orderData.items,
            payment: orderData.payment,
            status: 'pending',
            createdAt: new Date().toISOString(),
            isGuestOrder: true
          },
          message: 'Order placed successfully! As a guest user, your order details will not be saved to your account. Please keep your order number for tracking.',
          warning: 'Guest orders are not saved. Sign in to track your orders and access order history.'
        };
      }

      // For authenticated users, prepare order data for the backend API
      const apiOrderData = {
        customer: {
          userId: userData._id,  // Include user ID for authenticated users
          name: `${orderData.customer.firstName} ${orderData.customer.lastName}`.trim(),
          email: orderData.customer.email,
          phone: orderData.customer.phone,
          address: {
            street: orderData.shipping.address,
            city: orderData.shipping.city,
            state: orderData.shipping.state,
            zipCode: orderData.shipping.postalCode,
            country: orderData.shipping.country || 'Pakistan'
          }
        },
        items: orderData.items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          sku: item.sku || `SKU${item.id}`
        })),
        summary: {
          subtotal: orderData.payment.subtotal,
          tax: 0, // No tax as mentioned in previous conversations
          shipping: 0, // Free shipping as mentioned
          discount: orderData.payment.discount || 0,
          total: orderData.payment.amount
        },
        payment: {
          method: orderData.payment.method || 'cod',
          status: 'pending'
        },
        notes: {
          customer: orderData.specialInstructions || ''
        }
      };

      console.log('Sending order to backend API:', apiOrderData);

      // Make API call to backend
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiOrderData)
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        console.error('Backend API error:', result);
        throw new Error(result.message || `Server error: ${response.status}`);
      }

      if (result.success && result.data) {
        console.log('Order created successfully in backend:', result.data);
        
        return {
          success: true,
          order: result.data,
          message: 'Order placed successfully! We will contact you within 24 hours to confirm delivery details.'
        };
      } else {
        throw new Error(result.message || 'Failed to create order');
      }

    } catch (error) {
      console.error('Order creation error:', error);
      
      // For authenticated users, if API fails, still don't fall back to localStorage
      // This ensures consistency with the new API-first approach
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');
      const isAuthenticated = !!token && !!userData._id;
      
      if (isAuthenticated) {
        return {
          success: false,
          error: error.message || 'Failed to create order. Please try again or contact support.',
          message: 'Unable to process your order at this time. Please try again or contact our customer support.'
        };
      } else {
        // For guest users, return the guest order response
        return {
          success: true,
          order: {
            orderNumber: this.generateOrderNumber(),
            customer: orderData.customer,
            items: orderData.items,
            payment: orderData.payment,
            status: 'pending',
            createdAt: new Date().toISOString(),
            isGuestOrder: true
          },
          message: 'Order placed successfully! As a guest user, your order details will not be saved.',
          warning: 'Guest orders are not saved. Sign in to track your orders and access order history.'
        };
      }
    }
  }

  // Get orders for current user (authenticated users only)
  async getUserOrders() {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token || !userData._id) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch orders');
      }

      return {
        success: true,
        orders: result.data || []
      };

    } catch (error) {
      console.error('Error fetching user orders:', error);
      return {
        success: false,
        error: error.message,
        orders: []
      };
    }
  }

  // Track order by order number (public method)
  async trackOrder(orderNumber) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderNumber}/tracking`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to track order');
      }

      return {
        success: true,
        tracking: result.data
      };

    } catch (error) {
      console.error('Error tracking order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get order details by order number (public method)
  async getOrderDetails(orderNumber) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to get order details');
      }

      return {
        success: true,
        order: result.data
      };

    } catch (error) {
      console.error('Error getting order details:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Calculate estimated delivery date based on city
  calculateEstimatedDelivery(city) {
    const today = new Date();
    const deliveryDays = this.getDeliveryDays(city);
    const deliveryDate = new Date(today.getTime() + (deliveryDays * 24 * 60 * 60 * 1000));
    return deliveryDate.toISOString();
  }

  getDeliveryDays(city) {
    const majorCities = ['karachi', 'lahore', 'islamabad', 'rawalpindi', 'faisalabad'];
    const normalizedCity = city.toLowerCase().trim();
    return majorCities.includes(normalizedCity) ? 2 : 5;
  }

  // Legacy methods for backward compatibility (deprecated)
  getFilteredOrders(filterStatus = 'all') {
    console.warn('getFilteredOrders is deprecated. Use getUserOrders() instead.');
    return this.orders.filter(order => 
      filterStatus === 'all' || order.status === filterStatus
    );
  }

  getAllOrders() {
    console.warn('getAllOrders is deprecated. Use getUserOrders() instead.');
    return this.orders;
  }

  getOrderById(id) {
    console.warn('getOrderById is deprecated. Use getOrderDetails() instead.');
    return this.orders.find(order => order.id === id);
  }

  // Utility method to check if user is authenticated
  isUserAuthenticated() {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    return !!token && !!userData._id;
  }

  // Method to clear local orders (for cleanup purposes)
  clearLocalOrders() {
    this.orders = [];
    localStorage.removeItem('prince_vibe_orders');
  }

  // Send confirmation notifications
  async sendConfirmationNotifications(order) {
    try {
      // Send confirmation email
      await this.sendConfirmationEmail(order);
      
      // Send confirmation SMS
      await this.sendConfirmationSMS(order);
      
      // Update order status
      order.confirmationEmailSent = true;
      order.confirmationSmsSent = true;
      order.updatedAt = new Date().toISOString();
      
      // Save updated order
      this.updateOrderInStorage(order);

    } catch (error) {
      console.error('Notification sending error:', error);
    }
  }

  // Send confirmation email
  async sendConfirmationEmail(order) {
    const emailData = {
      to: order.customer.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      template: 'order-confirmation',
      data: {
        customerName: `${order.customer.firstName} ${order.customer.lastName}`,
        orderNumber: order.orderNumber,
        orderDate: new Date(order.createdAt).toLocaleDateString('en-PK'),
        items: order.items,
        total: order.payment.amount,
        shippingAddress: order.shipping,
        estimatedDelivery: new Date(order.estimatedDelivery).toLocaleDateString('en-PK'),
        paymentMethod: 'Cash on Delivery',
        supportEmail: 'support@princevibe.com',
        supportPhone: '+92-300-1234567'
      }
    };

    // In production, integrate with email service (SendGrid, Mailgun, etc.)
    console.log('Sending confirmation email:', emailData);
    
    // Simulate email sending
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Confirmation email sent to ${order.customer.email}`);
        resolve(true);
      }, 1000);
    });
  }

  // Send confirmation SMS
  async sendConfirmationSMS(order) {
    const phoneNumber = order.customer.phone.replace(/\D/g, ''); // Remove non-digits
    const formattedPhone = phoneNumber.startsWith('92') ? phoneNumber : `92${phoneNumber.replace(/^0/, '')}`;
    
    const message = `Prince Vibe: Order ${order.orderNumber} confirmed! Total: PKR ${order.payment.amount.toLocaleString()}. We'll call you within 24hrs to confirm delivery. Track: princevibe.com/track/${order.orderNumber}`;
    
    const smsData = {
      to: formattedPhone,
      message: message,
      orderNumber: order.orderNumber
    };

    // In production, integrate with SMS service (Twilio, local SMS gateway, etc.)
    console.log('Sending confirmation SMS:', smsData);
    
    // Simulate SMS sending
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Confirmation SMS sent to ${formattedPhone}`);
        resolve(true);
      }, 1000);
    });
  }

  // Update order in localStorage (in production, this would update database)
  updateOrderInStorage(updatedOrder) {
    const orderIndex = this.orders.findIndex(order => order.orderNumber === updatedOrder.orderNumber);
    if (orderIndex !== -1) {
      this.orders[orderIndex] = updatedOrder;
      localStorage.setItem('prince_vibe_orders', JSON.stringify(this.orders));
    }
  }

  // Validate discount code
  async validateDiscountCode(code) {
    const discountCodes = {
      'WELCOME10': { discount: 10, type: 'percentage', minOrder: 5000 },
      'SAVE500': { discount: 500, type: 'fixed', minOrder: 10000 },
      'LUXURY15': { discount: 15, type: 'percentage', minOrder: 15000 },
      'FIRST20': { discount: 20, type: 'percentage', minOrder: 8000 },
      'VIP25': { discount: 25, type: 'percentage', minOrder: 20000 }
    };

    return discountCodes[code.toUpperCase()] || null;
  }

  // Calculate discount amount
  calculateDiscount(orderTotal, discountCode) {
    if (!discountCode) return 0;

    if (orderTotal < discountCode.minOrder) {
      throw new Error(`Minimum order amount is PKR ${discountCode.minOrder.toLocaleString()} for this discount`);
    }

    if (discountCode.type === 'percentage') {
      return Math.round(orderTotal * (discountCode.discount / 100));
    } else {
      return discountCode.discount;
    }
  }

  // Get order statistics for admin dashboard
  getOrderStatistics() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    const stats = {
      total: this.orders.length,
      today: 0,
      thisMonth: 0,
      thisYear: 0,
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      topCities: {},
      paymentMethods: { cod: 0 }
    };

    this.orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      
      // Date-based counts
      if (orderDate >= today) stats.today++;
      if (orderDate >= thisMonth) stats.thisMonth++;
      if (orderDate >= thisYear) stats.thisYear++;

      // Status counts
      stats[order.status] = (stats[order.status] || 0) + 1;

      // Revenue calculation
      if (order.status !== 'cancelled') {
        stats.totalRevenue += order.payment.amount;
      }

      // Top cities
      const city = order.shipping.city.toLowerCase();
      stats.topCities[city] = (stats.topCities[city] || 0) + 1;

      // Payment methods
      stats.paymentMethods[order.payment.method] = (stats.paymentMethods[order.payment.method] || 0) + 1;
    });

    stats.averageOrderValue = stats.total > 0 ? Math.round(stats.totalRevenue / stats.total) : 0;

    // Sort top cities
    stats.topCities = Object.entries(stats.topCities)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .reduce((obj, [city, count]) => {
        obj[city] = count;
        return obj;
      }, {});

    return stats;
  }

  // Export orders to CSV for admin
  exportOrdersToCSV() {
    if (this.orders.length === 0) {
      return 'No orders to export';
    }

    const headers = [
      'Order Number',
      'Date',
      'Customer Name',
      'Email',
      'Phone',
      'City',
      'Total Amount',
      'Payment Method',
      'Status',
      'Payment Status'
    ].join(',');

    const rows = this.orders.map(order => [
      order.orderNumber,
      new Date(order.createdAt).toLocaleDateString('en-PK'),
      `${order.customer.firstName} ${order.customer.lastName}`,
      order.customer.email,
      order.customer.phone,
      order.shipping.city,
      order.payment.amount,
      order.payment.method.toUpperCase(),
      order.status,
      order.paymentStatus
    ].join(','));

    return [headers, ...rows].join('\n');
  }
}

// Create singleton instance
const orderService = new OrderService();

export default orderService; 