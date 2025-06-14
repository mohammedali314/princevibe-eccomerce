// Meta Pixel Service
const PIXEL_ID = '4037339863171134';
const TEST_EVENT_CODE = 'TEST20508';

let isInitialized = false;
let initializationAttempted = false;

export const initMetaPixel = () => {
  if (typeof window === 'undefined') return;
  if (isInitialized) return;
  if (initializationAttempted) return;
  
  initializationAttempted = true;
  
  if (window.fbq) {
    isInitialized = true;
    console.log('[MetaPixel] fbq already exists.');
    return;
  }

  // Initialize fbq
  window.fbq = function() {
    window.fbq.queue.push(arguments);
  };
  window.fbq.queue = [];
  window.fbq.version = '2.0';

  // Add Meta Pixel script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  script.onload = () => {
    // Initialize pixel after script loads
    // window.fbq('init', PIXEL_ID); // Pixel initialization moved to index.html
    // Set test event code
    window.fbq('set', 'autoConfig', false, PIXEL_ID);
    window.fbq('trackSingleCustom', PIXEL_ID, 'test_event_code', { test_event_code: TEST_EVENT_CODE });
    window.fbq('track', 'PageView');
    isInitialized = true;
    console.log('[MetaPixel] Initialized and PageView tracked.');
  };
  document.head.appendChild(script);
};

export const trackEvent = (eventName, data = {}) => {
  if (typeof window === 'undefined' || !window.fbq) return;

  // Ensure all required fields are present
  const eventData = {
    ...data,
    currency: data.currency || 'PKR',
    content_type: data.content_type || 'product',
    test_event_code: TEST_EVENT_CODE // Include test event code in all events
  };

  // Track the event
  window.fbq('track', eventName, eventData);
  console.log(`[MetaPixel] Event tracked: ${eventName}`, eventData);
};

// Helper function to check if pixel is ready
export const isPixelReady = () => {
  return typeof window !== 'undefined' && window.fbq && isInitialized;
};

// Initialize on load
if (typeof window !== 'undefined') {
  initMetaPixel();
} 