# 🌐 Vercel Frontend Deployment Guide

## 📋 Prerequisites
- Vercel account
- GitHub repository connected
- Backend deployed on Railway (api.vidyarthi-hub.xyz)

## 🚀 Deploy to Vercel

### Method 1: Vercel CLI (Recommended)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Deploy
```bash
vercel --prod
```

### Method 2: Vercel Dashboard

#### 1. Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository

#### 2. Configure Project
- **Framework Preset**: Create React App
- **Root Directory**: `./` (root of project)
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

#### 3. Environment Variables
Add these environment variables in Vercel dashboard:

```env
REACT_APP_BASE_URL=https://api.vidyarthi-hub.xyz
GENERATE_SOURCEMAP=false
```

## 🔧 Configuration Files

### vercel.json (Already Created)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/favicon.ico",
      "dest": "/favicon.ico"
    },
    {
      "src": "/manifest.json",
      "dest": "/manifest.json"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_BASE_URL": "https://api.vidyarthi-hub.xyz"
  }
}
```

## 🌐 Custom Domain Setup

### 1. Add Custom Domain
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add domain: `vidyarthi-hub.xyz`
4. Add www subdomain: `www.vidyarthi-hub.xyz`

### 2. DNS Configuration
Add these DNS records to your domain provider:

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. SSL Certificate
- Vercel automatically provides SSL certificates
- Wait for DNS propagation (can take up to 24 hours)

## 🧪 Testing After Deployment

### 1. Frontend Tests
- [ ] Homepage loads: `https://vidyarthi-hub.xyz`
- [ ] User registration works
- [ ] User login works
- [ ] Course browsing works
- [ ] Live classroom access works

### 2. API Integration Tests
- [ ] API calls reach backend
- [ ] Authentication works
- [ ] File uploads work
- [ ] Payment integration works

### 3. Live Classroom Tests
- [ ] WebSocket connection works
- [ ] Video streaming works
- [ ] Chat functionality works
- [ ] Screen sharing works

## 🔒 Security & Performance

### Security
- [ ] HTTPS enabled
- [ ] Environment variables secure
- [ ] No sensitive data in client code
- [ ] CORS properly configured

### Performance
- [ ] Page load times < 3 seconds
- [ ] Images optimized
- [ ] Code splitting working
- [ ] Caching configured

## 📊 Monitoring

### Vercel Analytics
- Enable Vercel Analytics in dashboard
- Monitor page views and performance
- Set up error tracking

### Custom Monitoring
- Add Google Analytics
- Monitor API response times
- Track user interactions

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check build logs
vercel logs

# Build locally first
npm run build
```

#### 2. API Connection Issues
- Verify `REACT_APP_BASE_URL` is set correctly
- Check CORS configuration on backend
- Test API endpoints directly

#### 3. Environment Variables
- Ensure all variables start with `REACT_APP_`
- Redeploy after changing environment variables
- Check variable names are correct

#### 4. Routing Issues
- Verify `vercel.json` routes configuration
- Check for client-side routing conflicts
- Test direct URL access

### Debug Commands
```bash
# Deploy with debug info
vercel --debug

# Check deployment status
vercel ls

# View logs
vercel logs

# Test locally
vercel dev
```

## 🔄 Continuous Deployment

### Automatic Deployments
- Vercel automatically deploys on Git push
- Preview deployments for pull requests
- Branch deployments for testing

### Manual Deployments
```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

## 📞 Support
- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Community: https://github.com/vercel/vercel/discussions

---

**Status**: ⏳ Ready for Vercel Deployment
**Target Domain**: vidyarthi-hub.xyz
**Backend API**: https://api.vidyarthi-hub.xyz
**Frontend**: https://vidyarthi-hub.xyz 