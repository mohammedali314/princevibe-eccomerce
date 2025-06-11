// Meta Pixel Testing and Debug Helper
export class PixelHelper {
  static pixelId = '1675994553051015';

  // Test if Facebook Pixel is loaded
  static isPixelLoaded() {
    return typeof window !== 'undefined' && window.fbq && typeof window.fbq === 'function';
  }

  // Test pixel connection
  static testPixelConnection() {
    console.log('🔍 Meta Pixel Debug Info:');
    console.log('Domain:', window.location.hostname);
    console.log('Pixel ID:', this.pixelId);
    console.log('fbq function exists:', this.isPixelLoaded());
    
    if (this.isPixelLoaded()) {
      console.log('✅ Meta Pixel is loaded successfully');
      
      // Test if we can track events
      try {
        window.fbq('track', 'PageView');
        console.log('✅ PageView event tracked successfully');
        
        // Test custom event
        window.fbq('trackCustom', 'PixelTest', {
          test: true,
          domain: window.location.hostname,
          timestamp: new Date().toISOString()
        });
        console.log('✅ Custom test event sent');
        
      } catch (error) {
        console.error('❌ Error tracking events:', error);
      }
    } else {
      console.error('❌ Meta Pixel not loaded properly');
      this.diagnoseIssues();
    }
  }

  // Diagnose common issues
  static diagnoseIssues() {
    console.log('🔧 Diagnosing Pixel Issues:');
    
    // Check if script is loaded
    const pixelScript = document.querySelector('script[src*="fbevents.js"]');
    console.log('Pixel script found:', !!pixelScript);
    
    // Check for ad blockers
    if (window.navigator && window.navigator.userAgent.includes('Adblock')) {
      console.warn('⚠️ Ad blocker detected - this may block pixel');
    }
    
    // Check for HTTPS
    if (window.location.protocol !== 'https:') {
      console.warn('⚠️ Site not using HTTPS - pixels work better with HTTPS');
    }
    
    // Check domain
    console.log('Current domain:', window.location.hostname);
    if (window.location.hostname === 'localhost') {
      console.warn('⚠️ Testing on localhost - Facebook may not track development domains');
    }
  }

  // Track e-commerce events
  static trackPurchase(orderData) {
    if (!this.isPixelLoaded()) {
      console.warn('Meta Pixel not loaded - cannot track purchase');
      return;
    }

    try {
      window.fbq('track', 'Purchase', {
        value: orderData.total,
        currency: 'PKR',
        content_ids: orderData.productIds,
        content_type: 'product',
        num_items: orderData.quantity
      });
      console.log('✅ Purchase event tracked:', orderData);
    } catch (error) {
      console.error('❌ Error tracking purchase:', error);
    }
  }

  // Track add to cart
  static trackAddToCart(productData) {
    if (!this.isPixelLoaded()) {
      console.warn('Meta Pixel not loaded - cannot track add to cart');
      return;
    }

    try {
      window.fbq('track', 'AddToCart', {
        value: productData.price,
        currency: 'PKR',
        content_ids: [productData.id],
        content_name: productData.name,
        content_type: 'product'
      });
      console.log('✅ AddToCart event tracked:', productData);
    } catch (error) {
      console.error('❌ Error tracking add to cart:', error);
    }
  }

  // Track view content
  static trackViewContent(productData) {
    if (!this.isPixelLoaded()) {
      console.warn('Meta Pixel not loaded - cannot track view content');
      return;
    }

    try {
      window.fbq('track', 'ViewContent', {
        value: productData.price,
        currency: 'PKR',
        content_ids: [productData.id],
        content_name: productData.name,
        content_type: 'product'
      });
      console.log('✅ ViewContent event tracked:', productData);
    } catch (error) {
      console.error('❌ Error tracking view content:', error);
    }
  }

  // Initialize pixel testing on page load
  static initPixelTesting() {
    if (typeof window !== 'undefined') {
      // Test pixel after a short delay to ensure it's loaded
      setTimeout(() => {
        this.testPixelConnection();
      }, 2000);

      // Make testing functions available globally for debugging
      window.pixelHelper = this;
      console.log('🧪 Pixel Helper loaded. Use window.pixelHelper to test pixel functions.');
    }
  }
}

// Auto-initialize in development
if (process.env.NODE_ENV === 'development') {
  PixelHelper.initPixelTesting();
} 