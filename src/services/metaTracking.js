// Meta Pixel and CAPI tracking service
const PIXEL_ID = '1675994553051015';
const ACCESS_TOKEN = 'EAARLuyywfgcBO2YGEMwbwyjNq7LwSAMrSpAQ6tTMwr4rje0f0QPtlbEiOACPGdHC7hyvabnZBiR6c1cUFiBtYH5In4TE9t1x5GJDnIiNRV4uAlfCrhMelIf5z2tFEZCnCmBb5XPez70q6bvtWPO8JxXt5pNJsu14x0jnOo3AvgN0OGjP2iw3eWsrZCSKM3W7wZDZD';

// Initialize Meta Pixel
export const initMetaPixel = () => {
  console.log('🔍 Initializing Meta Pixel...');
  
  if (typeof window !== 'undefined' && !window.fbq) {
    // Create fbq function
    window.fbq = function() {
      console.log('📊 Meta Pixel Event:', arguments);
      window.fbq.queue.push(arguments);
    };
    window.fbq.queue = [];
    window.fbq.version = '2.0';
    
    // Load the Facebook Pixel script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
    
    // Initialize the pixel
    window.fbq('init', PIXEL_ID, {
      debug: true, // Enable debug mode for testing
      autoConfig: true,
      useExistingPixel: false
    });

    // Track page view
    window.fbq('track', 'PageView', {
      content_type: 'product',
      content_name: document.title,
      content_category: 'Luxury Watches'
    });

    console.log('✅ Meta Pixel initialized successfully');
    
    // Test pixel connection
    setTimeout(() => {
      if (window.fbq) {
        console.log('🔍 Testing pixel connection...');
        window.fbq('track', 'TestEvent', {
          content_name: 'Test Event',
          content_category: 'Test'
        });
      }
    }, 2000);
  }
};

// Track purchase event
export const trackPurchase = async (purchaseData) => {
  console.log('🛍️ Tracking purchase:', purchaseData);
  
  // Browser-side tracking (Pixel)
  if (window.fbq) {
    window.fbq('track', 'Purchase', {
      value: purchaseData.value,
      currency: purchaseData.currency,
      content_ids: [purchaseData.product_id],
      content_name: purchaseData.product_name,
      content_type: 'product',
      content_category: 'Luxury Watches'
    });
    console.log('✅ Browser-side purchase event tracked');
  }

  // Server-side tracking (CAPI)
  try {
    const response = await fetch('/api/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(purchaseData)
    });
    
    const data = await response.json();
    console.log('✅ Server-side purchase event tracked:', data);
    return data;
  } catch (error) {
    console.error('❌ Error tracking server-side purchase:', error);
    throw error;
  }
};

// Track view content
export const trackViewContent = (productData) => {
  console.log('👁️ Tracking view content:', productData);
  
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_ids: [productData.product_id],
      content_name: productData.product_name,
      content_type: 'product',
      value: productData.value,
      currency: productData.currency,
      content_category: 'Luxury Watches'
    });
    console.log('✅ View content event tracked');
  }
};

// Track add to cart
export const trackAddToCart = (productData) => {
  console.log('🛒 Tracking add to cart:', productData);
  
  if (window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_ids: [productData.product_id],
      content_name: productData.product_name,
      content_type: 'product',
      value: productData.value,
      currency: productData.currency,
      content_category: 'Luxury Watches'
    });
    console.log('✅ Add to cart event tracked');
  }
}; 