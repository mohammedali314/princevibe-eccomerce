// Order Service for Cash on Delivery
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
      // Get user authentication data - Fix localStorage key names to match ApiService
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const token = localStorage.getItem('userToken');
      
      // Check for user ID in different possible property names
      const userId = userData._id || userData.id;
      const isAuthenticated = !!token && !!userId;

      // Prepare order data for the backend API (for both guest and authenticated users)
      const apiOrderData = {
        customer: {
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
        },
        orderConfirmation: {
          message: `Thank you for your order! Your order has been placed successfully and will be processed within 24 hours. You'll receive updates via SMS/WhatsApp.`,
          supportEmail: 'Princevibe.store@gmail.com',
          supportPhone: '03089747141 • 03325122666'
        }
      };

      // Add userId only for authenticated users
      if (isAuthenticated) {
        apiOrderData.customer.userId = userId;
        console.log('Authenticated user order - saving with user ID:', userId);
      } else {
        console.log('Guest user order - saving without user ID for tracking via email/phone');
      }

      console.log('Sending order to backend API:', apiOrderData);

      // Make API call to backend (works for both guest and authenticated users)
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Include Authorization header only for authenticated users
          ...(isAuthenticated && { 'Authorization': `Bearer ${token}` })
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
        
        // Different success messages for guest vs authenticated users
        const successMessage = isAuthenticated 
          ? 'Order placed successfully! You can track it in your account under "My Orders".'
          : 'Order placed successfully! Please save your order number for tracking. You can track your order using your email and order number.';

        return {
          success: true,
          order: result.data,
          message: successMessage,
          isAuthenticated: isAuthenticated,
          trackingInfo: {
            orderNumber: result.data.orderNumber,
            email: apiOrderData.customer.email,
            phone: apiOrderData.customer.phone
          }
        };
      } else {
        throw new Error(result.message || 'Failed to create order');
      }

    } catch (error) {
      console.error('Order creation error:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to create order. Please try again or contact support.',
        message: 'Unable to process your order at this time. Please try again or contact our customer support.'
      };
    }
  }

  // Get orders for current user (authenticated users only)
  async getUserOrders() {
    try {
      const token = localStorage.getItem('userToken');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const userId = userData._id || userData.id;
      
      if (!token || !userId) {
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

  // Track guest order by order number and email (for guest users)
  async trackGuestOrder(orderNumber, email) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/track-guest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderNumber: orderNumber,
          email: email.toLowerCase()
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to track order');
      }

      return {
        success: true,
        order: result.data
      };

    } catch (error) {
      console.error('Error tracking guest order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get guest orders by email (for guest users)
  async getGuestOrders(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/by-email/${encodeURIComponent(email.toLowerCase())}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
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
      console.error('Error fetching guest orders:', error);
      return {
        success: false,
        error: error.message,
        orders: []
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
    const token = localStorage.getItem('userToken');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData._id || userData.id;
    return !!token && !!userId;
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
        supportEmail: 'Princevibe.store@gmail.com',
        supportPhone: '03089747141 • 03325122666'
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
      confirmedRevenue: 0,
      pendingRevenue: 0,
      averageOrderValue: 0,
      topCities: {},
      paymentMethods: { cod: 0 }
    };

    this.orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const orderTotal = order.payment.amount || order.summary?.total || 0;
      
      // Date-based counts
      if (orderDate >= today) stats.today++;
      if (orderDate >= thisMonth) stats.thisMonth++;
      if (orderDate >= thisYear) stats.thisYear++;

      // Status counts
      stats[order.status] = (stats[order.status] || 0) + 1;

      // Revenue calculation
      if (!['cancelled', 'returned'].includes(order.status)) {
        stats.totalRevenue += orderTotal;
        
        if (['shipped', 'delivered'].includes(order.status)) {
          stats.confirmedRevenue += orderTotal;
        }
        
        if (['confirmed', 'processing'].includes(order.status)) {
          stats.pendingRevenue += orderTotal;
        }
      }

      // Top cities
      const city = order.shipping?.city?.toLowerCase() || 'unknown';
      stats.topCities[city] = (stats.topCities[city] || 0) + 1;

      // Payment methods
      const paymentMethod = order.payment?.method || 'cod';
      stats.paymentMethods[paymentMethod] = (stats.paymentMethods[paymentMethod] || 0) + 1;
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