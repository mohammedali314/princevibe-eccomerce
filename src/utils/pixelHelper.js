import { trackEvent, isPixelReady } from '../services/metaPixel';

// Meta Pixel Helper
export class PixelHelper {
  static pixelId = '4037339863171134';
  static eventDebounce = new Map();

  // Test if Facebook Pixel is loaded
  static isPixelLoaded() {
    return isPixelReady();
  }

  // Debounce helper to prevent duplicate events
  static debounceEvent(eventName, data, delay = 1000) {
    const key = `${eventName}-${JSON.stringify(data)}`;
    const now = Date.now();
    
    if (this.eventDebounce.has(key)) {
      const lastTime = this.eventDebounce.get(key);
      if (now - lastTime < delay) return false;
    }
    
    this.eventDebounce.set(key, now);
    return true;
  }

  // Track e-commerce events
  static trackPurchase(orderData) {
    if (!this.isPixelLoaded()) {
      console.warn('Meta Pixel not loaded - cannot track purchase');
      return;
    }

    const eventData = {
      value: orderData.total,
      currency: 'PKR',
      content_ids: orderData.productIds,
      content_type: 'product',
      num_items: orderData.quantity
    };

    if (this.debounceEvent('Purchase', eventData)) {
      trackEvent('Purchase', eventData);
    }
  }

  // Track add to cart
  static trackAddToCart(productData) {
    if (!this.isPixelLoaded()) {
      console.warn('Meta Pixel not loaded - cannot track add to cart');
      return;
    }

    const eventData = {
      value: productData.price,
      currency: 'PKR',
      content_ids: [productData.id],
      content_name: productData.name,
      content_type: 'product'
    };

    if (this.debounceEvent('AddToCart', eventData)) {
      trackEvent('AddToCart', eventData);
    }
  }

  // Track view content
  static trackViewContent(productData) {
    if (!this.isPixelLoaded()) {
      console.warn('Meta Pixel not loaded - cannot track view content');
      return;
    }

    const eventData = {
      value: productData.price,
      currency: 'PKR',
      content_ids: [productData.id],
      content_name: productData.name,
      content_type: 'product'
    };

    if (this.debounceEvent('ViewContent', eventData)) {
      trackEvent('ViewContent', eventData);
    }
  }
}