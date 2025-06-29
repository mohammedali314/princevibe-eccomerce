// Meta Pixel Service
const PIXEL_ID = '1047507600841338';

// Enhanced debug logging function with more visible output
const debugLog = (message, data = null) => {
  // Always log in development, regardless of NODE_ENV
  const timestamp = new Date().toLocaleTimeString();
  console.log(`%c[MetaPixel ${timestamp}]`, 'background: #1877F2; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;', message, data || '');
};

// Check if Meta Pixel is loaded
const checkPixelLoaded = () => {
  if (typeof window === 'undefined') {
    debugLog('❌ Window is undefined');
    return false;
  }

  if (!window.fbq) {
    debugLog('❌ Meta Pixel not loaded (fbq is undefined)');
    return false;
  }

  debugLog('✅ Meta Pixel is loaded and ready');
  return true;
};

export const trackEvent = (eventName, data = {}) => {
  debugLog(`🚀 Attempting to track event: ${eventName}`, data);

  if (!checkPixelLoaded()) {
    debugLog('❌ Cannot track event - Meta Pixel not loaded');
    return;
  }

  try {
    // Validate event data before sending
    if (data.value && typeof data.value !== 'number') {
      debugLog('⚠️ Warning: value should be a number, converting...', data.value);
      data.value = Number(data.value);
    }
    
    if (data.currency && typeof data.currency !== 'string') {
      debugLog('⚠️ Warning: currency should be a string, converting...', data.currency);
      data.currency = String(data.currency);
    }

    window.fbq('track', eventName, data);
    debugLog(`✅ Successfully tracked event: ${eventName}`, data);
  } catch (error) {
    debugLog(`❌ Error tracking event: ${eventName}`, error);
  }
};

// Helper function to check if pixel is ready
export const isPixelReady = () => {
  const ready = checkPixelLoaded();
  debugLog(`Pixel ready status: ${ready ? '✅ Ready' : '❌ Not Ready'}`);
  return ready;
};

// Log initialization status on load
if (typeof window !== 'undefined') {
  debugLog('🔍 Checking Meta Pixel status...');
  setTimeout(() => {
    checkPixelLoaded();
  }, 1000); // Check after 1 second to ensure script has time to load
} 