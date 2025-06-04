// Order Service for Cash on Delivery
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://princevibe-eccomerce-backend-production.up.railway.app/api';

class OrderService {
  constructor() {
    this.orders = JSON.parse(localStorage.getItem('prince_vibe_orders') || '[]');
  }

  // Generate unique order number
  generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PV${timestamp}${random}`;
  }

  // Create a new COD order
  async createCODOrder(orderData) {
    try {
      // Prepare the order data for the backend API
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
        }
      };

      console.log('Sending order to backend:', apiOrderData);

      // Make API call to backend
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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
        
        // Also save locally as backup
        const localOrder = {
          id: result.data._id,
          orderNumber: result.data.orderNumber,
          ...orderData,
          status: result.data.status,
          paymentStatus: result.data.payment.status,
          createdAt: result.data.createdAt,
          updatedAt: result.data.updatedAt,
          trackingNumber: result.data.trackingNumber,
          estimatedDelivery: this.calculateEstimatedDelivery(orderData.shipping.city),
          orderNotes: [],
          confirmationEmailSent: true, // Backend handles email sending
          confirmationSmsSent: false
        };

        this.orders.push(localOrder);
        localStorage.setItem('prince_vibe_orders', JSON.stringify(this.orders));

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
      
      // Fallback to local storage if API fails
      console.log('API failed, falling back to local storage...');
      
      const fallbackOrder = {
        id: Date.now(),
        orderNumber: this.generateOrderNumber(),
        ...orderData,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        trackingNumber: null,
        estimatedDelivery: this.calculateEstimatedDelivery(orderData.shipping.city),
        orderNotes: [],
        confirmationEmailSent: false,
        confirmationSmsSent: false,
        isLocalOnly: true // Flag to indicate this order is not in backend
      };

      this.orders.push(fallbackOrder);
      localStorage.setItem('prince_vibe_orders', JSON.stringify(this.orders));

      return {
        success: true,
        order: fallbackOrder,
        message: 'Order saved locally. We will process it as soon as our servers are available.',
        warning: 'Order could not be sent to our servers. Please contact support if you don\'t receive confirmation within 24 hours.'
      };
    }
  }

  // Calculate estimated delivery date based on city
  calculateEstimatedDelivery(city) {
    const businessDays = this.getDeliveryDaysForCity(city);
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + businessDays);
    
    // Skip weekends
    while (estimatedDate.getDay() === 0 || estimatedDate.getDay() === 6) {
      estimatedDate.setDate(estimatedDate.getDate() + 1);
    }
    
    return estimatedDate.toISOString();
  }

  // Get delivery days based on city
  getDeliveryDaysForCity(city) {
    const cityDeliveryMap = {
      'karachi': 2,
      'lahore': 2,
      'islamabad': 2,
      'rawalpindi': 2,
      'faisalabad': 3,
      'multan': 3,
      'peshawar': 3,
      'quetta': 5,
      'hyderabad': 3,
      'gujranwala': 3,
      'sialkot': 3,
      'bahawalpur': 4,
      'sargodha': 4,
      'sukkur': 4,
      'larkana': 4,
      'sheikhupura': 3,
      'jhang': 4,
      'rahim yar khan': 4,
      'gujrat': 3,
      'kasur': 3,
      'mardan': 4,
      'mingora': 4,
      'sahiwal': 3,
      'nawabshah': 4,
      'okara': 3,
      'mirpur khas': 4,
      'chiniot': 4,
      'kamoke': 3,
      'mandi bahauddin': 4,
      'jhelum': 3,
      'sadiqabad': 4,
      'khanewal': 3,
      'hafizabad': 3,
      'kohat': 4,
      'jacobabad': 5,
      'shikarpur': 4,
      'muzaffargarh': 4,
      'khanpur': 4,
      'pakpattan': 4,
      'abbottabad': 4,
      'tando allahyar': 4,
      'daharki': 5,
      'ahmadpur east': 4,
      'vihari': 3,
      'wah cantonment': 2,
      'burewala': 3,
      'muridke': 3,
      'tando adam': 4,
      'jaranwala': 3,
      'chishtian': 4,
      'daska': 3,
      'mianwali': 4,
      'attock': 3,
      'vehari': 3,
      'ferozewala': 3,
      'chakwal': 3,
      'gojra': 4,
      'mian channu': 4,
      'kot adu': 4,
      'kamalia': 4,
      'nowshera': 4,
      'khushab': 4,
      'dera ghazi khan': 4,
      'shahdadkot': 4,
      'nankana sahib': 3,
      'bannu': 5,
      'turbat': 7,
      'gwadar': 7,
      'khuzdar': 6,
      'zhob': 6,
      'chaman': 6,
      'gilgit': 7,
      'skardu': 7,
      'muzaffarabad': 4,
      'mirpur': 4,
      'kotli': 4,
      'bhimber': 4
    };

    const normalizedCity = city.toLowerCase().trim();
    return cityDeliveryMap[normalizedCity] || 5; // Default to 5 days for unknown cities
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

  // Get order by order number
  getOrderByNumber(orderNumber) {
    return this.orders.find(order => order.orderNumber === orderNumber);
  }

  // Get all orders for admin
  getAllOrders() {
    return this.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Update order status
  updateOrderStatus(orderNumber, status, notes = '') {
    const order = this.getOrderByNumber(orderNumber);
    if (!order) {
      throw new Error('Order not found');
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();
    
    if (notes) {
      order.orderNotes.push({
        note: notes,
        timestamp: new Date().toISOString(),
        type: 'status_update'
      });
    }

    this.updateOrderInStorage(order);
    return order;
  }

  // Update payment status
  updatePaymentStatus(orderNumber, paymentStatus, transactionId = null) {
    const order = this.getOrderByNumber(orderNumber);
    if (!order) {
      throw new Error('Order not found');
    }

    order.paymentStatus = paymentStatus;
    order.updatedAt = new Date().toISOString();
    
    if (transactionId) {
      order.transactionId = transactionId;
    }

    if (paymentStatus === 'paid') {
      order.paidAt = new Date().toISOString();
    }

    this.updateOrderInStorage(order);
    return order;
  }

  // Add tracking number
  addTrackingNumber(orderNumber, trackingNumber, courier = 'TCS') {
    const order = this.getOrderByNumber(orderNumber);
    if (!order) {
      throw new Error('Order not found');
    }

    order.trackingNumber = trackingNumber;
    order.courier = courier;
    order.status = 'shipped';
    order.shippedAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();

    order.orderNotes.push({
      note: `Order shipped via ${courier}. Tracking: ${trackingNumber}`,
      timestamp: new Date().toISOString(),
      type: 'shipping_update'
    });

    this.updateOrderInStorage(order);
    
    // Send shipping notification
    this.sendShippingNotification(order);
    
    return order;
  }

  // Send shipping notification
  async sendShippingNotification(order) {
    try {
      // Send shipping email
      const emailData = {
        to: order.customer.email,
        subject: `Your Order ${order.orderNumber} Has Been Shipped!`,
        template: 'shipping-notification',
        data: {
          customerName: `${order.customer.firstName} ${order.customer.lastName}`,
          orderNumber: order.orderNumber,
          trackingNumber: order.trackingNumber,
          courier: order.courier,
          trackingUrl: this.getTrackingUrl(order.courier, order.trackingNumber),
          estimatedDelivery: new Date(order.estimatedDelivery).toLocaleDateString('en-PK')
        }
      };

      console.log('Sending shipping notification email:', emailData);

      // Send shipping SMS
      const phoneNumber = order.customer.phone.replace(/\D/g, '');
      const formattedPhone = phoneNumber.startsWith('92') ? phoneNumber : `92${phoneNumber.replace(/^0/, '')}`;
      
      const message = `Prince Vibe: Your order ${order.orderNumber} has been shipped via ${order.courier}! Tracking: ${order.trackingNumber}. Expected delivery: ${new Date(order.estimatedDelivery).toLocaleDateString('en-PK')}`;
      
      console.log(`Sending shipping SMS to ${formattedPhone}: ${message}`);

    } catch (error) {
      console.error('Shipping notification error:', error);
    }
  }

  // Get tracking URL based on courier
  getTrackingUrl(courier, trackingNumber) {
    const trackingUrls = {
      'TCS': `https://www.tcsexpress.com/track/${trackingNumber}`,
      'Leopards': `https://leopardscod.com/track/${trackingNumber}`,
      'Trax': `https://sonic.pk/tracking/${trackingNumber}`,
      'PostEx': `https://postex.pk/track/${trackingNumber}`,
      'CallCourier': `https://callcourier.com.pk/tracking/${trackingNumber}`
    };

    return trackingUrls[courier] || '#';
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