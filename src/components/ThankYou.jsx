import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ThankYou() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  useEffect(() => {
    const sendToMeta = async () => {
      // Get order details from URL parameters or your order management system
      const orderData = {
        email: searchParams.get('email') || 'customer@example.com',
        value: parseFloat(searchParams.get('value')) || 29999,
        currency: searchParams.get('currency') || 'PKR',
        product_id: searchParams.get('product_id') || 'WATCH001',
        product_name: searchParams.get('product_name') || 'Luxury Watch'
      };

      console.log('🛍️ Processing purchase tracking:', orderData);

      try {
        // Server-side tracking (CAPI)
        const response = await fetch('/api/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });
        
        const data = await response.json();
        console.log('✅ Server-side purchase tracked:', data);

        // Browser-side tracking (Pixel)
        if (window.fbq) {
          window.fbq('track', 'Purchase', {
            value: orderData.value,
            currency: orderData.currency,
            content_ids: [orderData.product_id],
            content_name: orderData.product_name,
            content_type: 'product'
          });
          console.log('✅ Browser-side purchase tracked');
        }
      } catch (error) {
        console.error('❌ Error tracking purchase:', error);
      }
    };

    sendToMeta();
  }, [searchParams]);

  return (
    <div className="thank-you-page">
      <h1>Thank You for Your Purchase!</h1>
      <p>Your order has been confirmed.</p>
      <p>We'll send you an email with your order details shortly.</p>
    </div>
  );
} 