# ✅ Railway Deployment Checklist

## 🔧 Backend (Railway)

### Environment Variables
- [ ] MONGODB_URL
- [ ] JWT_SECRET
- [ ] MAIL_HOST, MAIL_USER, MAIL_PASS
- [ ] CLOUD_NAME, API_KEY, API_SECRET, FOLDER_NAME
- [ ] RAZORPAY_KEY, RAZORPAY_SECRET
- [ ] PORT=5000
- [ ] NODE_ENV=production

### Railway Setup
- [ ] Connect GitHub repository
- [ ] Select `server` directory
- [ ] Set environment variables
- [ ] Deploy backend service
- [ ] Add custom domain: `api.vidyarthi-hub.xyz`

### Test Backend
- [ ] Health check: `https://api.vidyarthi-hub.xyz/`
- [ ] API endpoints working
- [ ] Database connection
- [ ] File uploads (Cloudinary)
- [ ] Email sending

## 🌐 Frontend (Vercel/Netlify)

### Configuration
- [ ] Update API base URL to `https://api.vidyarthi-hub.xyz`
- [ ] Update WebSocket URL to `https://api.vidyarthi-hub.xyz`
- [ ] Build frontend: `npm run build`
- [ ] Deploy to hosting platform
- [ ] Add custom domain: `vidyarthi-hub.xyz`

### Test Frontend
- [ ] Homepage loads
- [ ] User registration/login
- [ ] Course browsing
- [ ] Live classroom functionality
- [ ] Payment integration

## 🔗 Domain Configuration

### DNS Records
- [ ] CNAME: `api` → Railway URL
- [ ] CNAME: `@` → Frontend hosting URL
- [ ] SSL certificates active
- [ ] Domain propagation complete

### CORS Configuration
- [ ] Backend allows `https://vidyarthi-hub.xyz`
- [ ] Backend allows `https://www.vidyarthi-hub.xyz`
- [ ] WebSocket connections work

## 🧪 Live Classroom Testing

### Instructor Flow
- [ ] Create live class
- [ ] Join live class room
- [ ] Share video/audio
- [ ] Use whiteboard
- [ ] Launch polls
- [ ] Mute/unmute participants

### Student Flow
- [ ] View live classes
- [ ] Join live class room
- [ ] Receive video/audio
- [ ] Participate in polls
- [ ] Raise hand
- [ ] Send reactions

### WebSocket Testing
- [ ] Real-time video streaming
- [ ] Chat functionality
- [ ] Screen sharing
- [ ] Whiteboard collaboration
- [ ] Poll voting
- [ ] Hand raising

## 🔒 Security & Performance

### Security
- [ ] HTTPS enabled everywhere
- [ ] Environment variables secure
- [ ] CORS properly configured
- [ ] Input validation working
- [ ] JWT tokens secure

### Performance
- [ ] Page load times acceptable
- [ ] Video streaming smooth
- [ ] Database queries optimized
- [ ] File uploads working
- [ ] Error handling in place

## 📊 Monitoring Setup

### Logs & Monitoring
- [ ] Railway logs accessible
- [ ] Error tracking configured
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Backup strategy

## 🎉 Final Steps

### Documentation
- [ ] Update README with production URLs
- [ ] Document deployment process
- [ ] Create user guides
- [ ] Set up support channels

### Launch
- [ ] Test all features thoroughly
- [ ] Prepare launch announcement
- [ ] Monitor for issues
- [ ] Gather user feedback

---

**Status**: ⏳ Ready for Deployment
**Target Domain**: vidyarthi-hub.xyz
**Backend**: Railway (api.vidyarthi-hub.xyz)
**Frontend**: Vercel/Netlify (vidyarthi-hub.xyz) 