import crypto from 'crypto';

const PIXEL_ID = '1675994553051015';
const ACCESS_TOKEN = 'EAARLuyywfgcBO2YGEMwbwyjNq7LwSAMrSpAQ6tTMwr4rje0f0QPtlbEiOACPGdHC7hyvabnZBiR6c1cUFiBtYH5In4TE9t1x5GJDnIiNRV4uAlfCrhMelIf5z2tFEZCnCmBb5XPez70q6bvtWPO8JxXt5pNJsu14x0jnOo3AvgN0OGjP2iw3eWsrZCSKM3W7wZDZD';

export default async function handler(req, res) {
  console.log('📥 Received purchase tracking request:', req.body);

  if (req.method !== 'POST') {
    console.error('❌ Invalid request method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, value, currency, product_id, product_name } = req.body;

  // Validate required fields
  if (!email || !value || !currency || !product_id || !product_name) {
    console.error('❌ Missing required fields:', { email, value, currency, product_id, product_name });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Hash email for privacy
    const hashedEmail = crypto.createHash('sha256').update(email).digest('hex');
    console.log('🔒 Hashed email:', hashedEmail);

    const payload = {
      data: [
        {
          event_name: 'Purchase',
          event_time: Math.floor(Date.now() / 1000),
          user_data: {
            em: [hashedEmail],
            client_ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            client_user_agent: req.headers['user-agent']
          },
          custom_data: {
            value: value,
            currency: currency,
            content_ids: [product_id],
            content_name: product_name,
            content_type: 'product'
          },
          event_source_url: req.headers.referer || '',
          action_source: 'website',
          event_id: `purchase-${product_id}-${Date.now()}`
        }
      ]
    };

    console.log('📤 Sending payload to Meta:', payload);

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();
    console.log('✅ Meta CAPI response:', data);

    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error in purchase tracking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 