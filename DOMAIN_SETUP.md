# 🌐 Domain Setup Guide: princevibe.store

## Step 1: Buy the Domain 💳

### Recommended Registrars:
1. **Namecheap** (Best for Pakistan)
   - Visit: namecheap.com
   - Search: "princevibe.store"
   - Cost: ~$12-20/year
   - Payment: Accept PKR cards

2. **GoDaddy** (Alternative)
   - Visit: godaddy.com
   - Similar pricing
   - Good customer support

3. **Cloudflare** (Advanced)
   - Visit: cloudflare.com
   - Cheaper domain + free CDN
   - Best performance

---

## Step 2: Configure DNS for Vercel (Frontend) 🚀

### In Your Domain Registrar:
1. Go to DNS Management
2. Add these records:

```dns
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A  
Name: @
Value: 76.76.19.19

Type: A
Name: @  
Value: 76.76.21.21
```

### In Vercel Dashboard:
1. Go to your project settings
2. Click "Domains" 
3. Add: `princevibe.store` and `www.princevibe.store`
4. Follow verification steps

---

## Step 3: Configure Subdomain for Backend (Railway) 🚂

### Option 1: Use Railway's Custom Domain
1. In Railway dashboard → Your project
2. Go to Settings → Networking  
3. Add custom domain: `api.princevibe.store`

### Option 2: Use DNS CNAME
```dns
Type: CNAME
Name: api
Value: your-project-name.up.railway.app
```

---

## Step 4: Update Environment Variables 🔧

### Update Frontend (.env):
```bash
VITE_API_BASE_URL=https://api.princevibe.store
VITE_SITE_URL=https://princevibe.store
```

### Update Backend (.env):
```bash
FRONTEND_URL=https://princevibe.store
CORS_ORIGIN=https://princevibe.store
```

---

## Step 5: SSL Certificate Setup 🔒

### Vercel (Automatic):
- SSL certificates are automatically generated
- No action needed

### Railway (Automatic):
- SSL certificates are automatically generated  
- No action needed

### Verify SSL:
- Visit: https://www.ssllabs.com/ssltest/
- Test both: princevibe.store and api.princevibe.store

---

## Step 6: Professional Email Setup 📧

### Option 1: Google Workspace (Recommended)
```bash
Cost: $6/month for hello@princevibe.store
Setup: workspace.google.com
Benefits: Professional, reliable, good for business
```

### Option 2: Zoho Mail (Budget-friendly)
```bash
Cost: Free for 1 user / $1 per month
Setup: zoho.com/mail
Benefits: Cheaper, still professional
```

### Email Addresses to Create:
- hello@princevibe.store (main contact)
- orders@princevibe.store (order notifications)
- support@princevibe.store (customer service)
- admin@princevibe.store (admin notifications)

---

## Step 7: Analytics Setup 📊

### Google Analytics:
1. Go to: analytics.google.com
2. Create property for "princevibe.store"
3. Get tracking ID: G-XXXXXXXXXX
4. Add to your app initialization

### Facebook Pixel:
1. Go to: business.facebook.com
2. Create Pixel for "Prince Vibe"
3. Get Pixel ID: XXXXXXXXXXXXXXX
4. Add to your app initialization

---

## Step 8: Update Your App Configuration ⚙️

### Update App.jsx:
```javascript
import businessAnalytics from './utils/businessAnalytics';

// In your App component
useEffect(() => {
  // Initialize analytics only in production
  if (window.location.hostname === 'princevibe.store') {
    businessAnalytics.initializeGoogleAnalytics('G-XXXXXXXXXX');
    businessAnalytics.initializeFacebookPixel('XXXXXXXXXXXXXXX');
  }
}, []);
```

### Update package.json scripts:
```json
{
  "scripts": {
    "build:production": "VITE_API_BASE_URL=https://api.princevibe.store npm run build",
    "deploy": "npm run build:production && vercel --prod"
  }
}
```

---

## Step 9: Test Everything 🧪

### Checklist:
- [ ] princevibe.store loads correctly
- [ ] www.princevibe.store redirects to princevibe.store
- [ ] api.princevibe.store returns API responses
- [ ] SSL certificates are valid (green lock icon)
- [ ] Analytics tracking works
- [ ] Order placement works end-to-end
- [ ] Email notifications work

### Testing Commands:
```bash
# Test API connectivity
curl https://api.princevibe.store/api/health

# Test SSL 
curl -I https://princevibe.store

# Test redirect
curl -I https://www.princevibe.store
```

---

## Step 10: Marketing Setup 🎯

### Social Media Accounts:
```bash
Instagram: @princevibe
Facebook: facebook.com/princevibe
TikTok: @princevibe
Twitter: @princevibe_pk
```

### Business Listings:
```bash
Google My Business: Register your business
Facebook Page: Create business page
Instagram Business: Convert to business account
```

---

## 🚨 Important Notes:

### DNS Propagation:
- Takes 24-48 hours for global propagation
- Use: whatsmydns.net to check propagation status

### Backup Plan:
- Keep old URLs working during transition
- Test thoroughly before switching ads traffic

### Cost Summary (Monthly):
```bash
Domain: $1-2/month (annual payment)
Email: $6/month (Google Workspace)
Analytics: Free
Total: ~$8/month for professional setup
```

---

## 🎉 Next Steps After Domain Setup:

1. **Update all marketing materials** with new domain
2. **Set up Facebook Business Manager** with new domain
3. **Create Google Ads account** with new domain  
4. **Update any existing ads** with new links
5. **Set up conversion tracking** for ads
6. **Create WhatsApp Business** with new domain link

---

**Pro Tip**: Once domain is live, immediately start Facebook Pixel data collection. You need 50+ conversions for effective ad optimization!

**Remember**: This professional domain makes you look like a real business, which increases customer trust and conversion rates! 🚀 