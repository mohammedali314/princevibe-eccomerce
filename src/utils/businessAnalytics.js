// Business Analytics for Prince Vibe
// Track important business metrics and conversions

class BusinessAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
    this.isProduction = window.location.hostname !== 'localhost';
  }

  // Generate unique session ID
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get or create user ID
  getUserId() {
    let userId = localStorage.getItem('pv_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('pv_user_id', userId);
    }
    return userId;
  }

  // Track page views
  trackPageView(pageName, additionalData = {}) {
    const eventData = {
      event: 'page_view',
      page: pageName,
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
      url: window.location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      ...additionalData
    };

    this.sendEvent(eventData);

    // Google Analytics 4 (if available)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: pageName,
        page_location: window.location.href
      });
    }
  }

  // Track product views (crucial for retargeting)
  trackProductView(product) {
    const eventData = {
      event: 'view_item',
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
      product_id: product.id,
      product_name: product.name,
      product_category: product.category,
      product_price: product.price,
      product_brand: product.brand || 'Prince Vibe',
      currency: 'PKR'
    };

    this.sendEvent(eventData);

    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'view_item', {
        currency: 'PKR',
        value: product.price,
        items: [{
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
          quantity: 1
        }]
      });
    }
  }

  // Track add to cart (high-value event for ads)
  trackAddToCart(product, quantity = 1) {
    const eventData = {
      event: 'add_to_cart',
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      quantity: quantity,
      cart_value: product.price * quantity,
      currency: 'PKR'
    };

    this.sendEvent(eventData);

    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'add_to_cart', {
        currency: 'PKR',
        value: product.price * quantity,
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: quantity
        }]
      });
    }
  }

  // Track checkout initiation
  trackBeginCheckout(cartItems, cartTotal) {
    const eventData = {
      event: 'begin_checkout',
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
      cart_total: cartTotal,
      item_count: cartItems.length,
      items: cartItems.map(item => ({
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      currency: 'PKR'
    };

    this.sendEvent(eventData);

    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'begin_checkout', {
        currency: 'PKR',
        value: cartTotal,
        items: cartItems.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      });
    }
  }

  // Track successful purchase (conversion event)
  trackPurchase(order) {
    const eventData = {
      event: 'purchase',
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
      order_id: order.orderNumber,
      order_total: order.summary?.total || order.payment?.amount,
      payment_method: order.payment?.method || 'cod',
      customer_email: order.customer?.email,
      customer_city: order.customer?.address?.city,
      items: order.items?.map(item => ({
        product_id: item.productId || item.id,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity
      })) || [],
      currency: 'PKR'
    };

    this.sendEvent(eventData);

    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'purchase', {
        transaction_id: order.orderNumber,
        currency: 'PKR',
        value: order.summary?.total || order.payment?.amount,
        items: order.items?.map(item => ({
          item_id: item.productId || item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity
        })) || []
      });
    }
  }

  // Track WhatsApp clicks (important for Pakistani market)
  trackWhatsAppClick(source = 'unknown') {
    const eventData = {
      event: 'whatsapp_click',
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
      source: source,
      page: window.location.pathname
    };

    this.sendEvent(eventData);
  }

  // Track form submissions
  trackFormSubmission(formType, success = true) {
    const eventData = {
      event: 'form_submission',
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
      form_type: formType,
      success: success
    };

    this.sendEvent(eventData);
  }

  // Track search queries
  trackSearch(searchTerm, resultCount = 0) {
    const eventData = {
      event: 'search',
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
      search_term: searchTerm,
      result_count: resultCount
    };

    this.sendEvent(eventData);

    if (typeof gtag !== 'undefined') {
      gtag('event', 'search', {
        search_term: searchTerm
      });
    }
  }

  // Send event to backend for storage and analysis
  async sendEvent(eventData) {
    try {
      // Only send to backend in production or when explicitly enabled
      if (this.isProduction || localStorage.getItem('pv_analytics_debug') === 'true') {
        const response = await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(eventData)
        });

        if (!response.ok) {
          console.warn('Analytics tracking failed:', response.statusText);
        }
      }

      // Always log to console in development
      if (!this.isProduction) {
        console.log('📊 Analytics Event:', eventData);
      }

      // Store in localStorage for local analysis
      this.storeEventLocally(eventData);

    } catch (error) {
      console.warn('Analytics error:', error);
    }
  }

  // Store events locally for debugging and offline analysis
  storeEventLocally(eventData) {
    try {
      const events = JSON.parse(localStorage.getItem('pv_analytics_events') || '[]');
      events.push(eventData);
      
      // Keep only last 100 events to prevent storage bloat
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('pv_analytics_events', JSON.stringify(events));
    } catch (error) {
      console.warn('Failed to store analytics event locally:', error);
    }
  }

  // Get analytics summary for business insights
  getAnalyticsSummary() {
    try {
      const events = JSON.parse(localStorage.getItem('pv_analytics_events') || '[]');
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const recentEvents = events.filter(event => 
        new Date(event.timestamp) > last24Hours
      );

      return {
        total_events: events.length,
        events_24h: recentEvents.length,
        page_views_24h: recentEvents.filter(e => e.event === 'page_view').length,
        product_views_24h: recentEvents.filter(e => e.event === 'view_item').length,
        add_to_cart_24h: recentEvents.filter(e => e.event === 'add_to_cart').length,
        purchases_24h: recentEvents.filter(e => e.event === 'purchase').length,
        unique_sessions_24h: new Set(recentEvents.map(e => e.session_id)).size,
        conversion_rate_24h: this.calculateConversionRate(recentEvents)
      };
    } catch (error) {
      console.warn('Failed to get analytics summary:', error);
      return {};
    }
  }

  // Calculate conversion rate
  calculateConversionRate(events) {
    const sessions = new Set(events.map(e => e.session_id));
    const purchaseSessions = new Set(
      events.filter(e => e.event === 'purchase').map(e => e.session_id)
    );
    
    return sessions.size > 0 ? (purchaseSessions.size / sessions.size * 100).toFixed(2) : 0;
  }

  // Initialize Google Analytics (call this in your main app)
  initializeGoogleAnalytics(measurementId) {
    if (this.isProduction) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', measurementId);
      
      window.gtag = gtag;
    }
  }
}

// Create singleton instance
const businessAnalytics = new BusinessAnalytics();

export default businessAnalytics; 