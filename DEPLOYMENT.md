# Deployment Guide - PrinceVibe E-commerce Store

## Vercel Deployment

### ✅ Build Configuration
- **Framework**: React (Vite)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node.js Version**: 18.x or higher

### 🎬 Asset Management

#### Videos
- **Location**: `public/videos/`
- **Formats**: MP4, WebM
- **Usage**: Referenced as `/videos/filename.ext`
- **Benefits**: Not bundled, served as static assets

#### Images
- **Logo**: `public/logo.png`
- **Usage**: Referenced as `/logo.png`
- **Benefits**: Reliable Vercel deployment, no import issues

### 🐛 Common Build Issues & Solutions

#### Issue 1: "Could not resolve logo.png"
**Solution**: Move logo to public directory
```javascript
// Before (problematic)
import Logo from '../../assets/logo.png';
<img src={Logo} alt="Logo" />

// After (works on Vercel)
<img src="/logo.png" alt="Logo" />
```

#### Issue 2: Large file push errors
**Solution**: Use public directory for large assets
- Move videos/images to `public/` folder
- Update .gitignore to exclude large files from `src/assets/`
- Reference public assets with absolute paths

#### Issue 3: Video loading issues
**Solution**: Proper video configuration
```javascript
<video autoPlay loop muted playsInline preload="metadata">
  <source src="/videos/video.mp4" type="video/mp4" />
</video>
```

### 📁 Recommended File Structure
```
public/
├── logo.png          # Navbar logo
├── videos/           # Hero section videos
│   ├── banner.MP4
│   ├── bannervid.mp4
│   └── banner3.webm
└── favicon.ico

src/
├── assets/           # Small bundled assets only
│   └── icons/        # Small SVG icons
├── components/
└── ...
```

### 🚀 Performance Tips
1. **Optimize videos**: Keep under 10MB each
2. **Use WebP/WebM**: Better compression
3. **Lazy loading**: Load videos only when needed
4. **CDN**: Consider moving large assets to CDN

### 🔧 Deployment Checklist
- [ ] All assets in public/ directory
- [ ] No large files in src/assets/
- [ ] Build runs successfully locally
- [ ] All imports use absolute paths for public assets
- [ ] Videos optimized for web
- [ ] .gitignore excludes large files

### 📊 Bundle Analysis
Run `npm run build` to check bundle size:
- Keep main bundle under 200KB gzipped
- Videos/images should NOT appear in bundle
- Use public/ directory for static assets

---

**Last Updated**: December 2024
**Vercel Status**: ✅ Deployment Ready 