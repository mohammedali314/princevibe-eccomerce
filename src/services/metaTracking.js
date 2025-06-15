// Meta Pixel and CAPI tracking service
// Meta Pixel code removed

// Track purchase event
export const trackPurchase = async (purchaseData) => {
  console.log('🛍️ Tracking purchase:', purchaseData);
  
  // Browser-side tracking (Pixel)
  // Meta Pixel code removed

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
  
  // Meta Pixel code removed
};

// Track add to cart
export const trackAddToCart = (productData) => {
  console.log('🛒 Tracking add to cart:', productData);
  
  // Meta Pixel code removed
}; 