# 🚀 Railway Deployment Guide for Vidyarthi Hub

## 📋 Prerequisites
- Railway account
- Custom domain: `vidyarthi-hub.xyz`
- MongoDB Atlas database
- Cloudinary account
- Razorpay account

## 🔧 Backend Deployment (Railway)

### 1. Prepare Backend for Railway
```bash
cd server
```

### 2. Environment Variables for Railway
Set these environment variables in Railway dashboard:

```env
# MongoDB Configuration
MONGODB_URL=mongodb+srv://pushkarbst90:ouOqapfDL98KujZ6@vidyarthi-hub.ynwbpze.mongodb.net/VIDYARTHI-HUB

# JWT Configuration
JWT_SECRET=VidyarthiHub2025!

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_USER=pushkarbst90@gmail.com
MAIL_PASS=esoadnmriivilxhf

# Cloudinary Configuration
CLOUD_NAME=dsg5tzzdg
API_KEY=156187488943462
API_SECRET=WgP7iab9LzSYPrHusamNb04ZUZs
FOLDER_NAME=Vidyarthi-Hub

# Razorpay Configuration
RAZORPAY_KEY=rzp_live_XYLUXVOyMrzB0K
RAZORPAY_SECRET=OK94AKMHSt6j23ziGw

# Server Configuration
PORT=5000
NODE_ENV=production
```

### 3. Deploy to Railway
1. Connect your GitHub repository to Railway
2. Select the `server` directory as the source
3. Railway will automatically detect Node.js and use `npm start`
4. Set all environment variables in Railway dashboard

## 🌐 Frontend Deployment (Vercel/Netlify)

### 1. Update Frontend Configuration
Before deploying, update the API base URL:

```javascript
// In src/services/apiconnector.js
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://vidyarthi-hub.xyz' 
  : 'http://localhost:5000';
```

### 2. Deploy Frontend
- Deploy to Vercel or Netlify
- Set build command: `npm run build`
- Set output directory: `build`

## 🔗 Custom Domain Setup

### 1. Railway Domain Configuration
1. In Railway dashboard, go to your backend service
2. Add custom domain: `api.vidyarthi-hub.xyz`
3. Update DNS records as instructed by Railway

### 2. Frontend Domain Configuration
1. In your frontend hosting platform (Vercel/Netlify)
2. Add custom domain: `vidyarthi-hub.xyz`
3. Update DNS records

### 3. DNS Records
Add these DNS records to your domain provider:

```
Type: CNAME
Name: api
Value: [Railway provided URL]

Type: CNAME  
Name: @
Value: [Frontend hosting URL]
```

## 🔄 Update Application URLs

### 1. Backend CORS Update
Update CORS origins in `server/index.js`:

```javascript
cors({
  origin: [
    "http://localhost:3000",
    "https://vidyarthi-hub.xyz",
    "https://www.vidyarthi-hub.xyz"
  ],
  credentials: true,
})
```

### 2. Frontend API Configuration
Update API base URL in frontend:

```javascript
// src/services/apiconnector.js
const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://api.vidyarthi-hub.xyz';
```

## 🧪 Testing After Deployment

### 1. Backend Health Check
```bash
curl https://api.vidyarthi-hub.xyz/
# Should return: {"success":true,"message":"Your server is up and running...."}
```

### 2. Frontend Test
- Visit `https://vidyarthi-hub.xyz`
- Test user registration/login
- Test live classroom functionality

### 3. Live Classroom Test
- Create a live class as instructor
- Join as student from different browser
- Verify WebSocket connection works

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env` files to Git
- Use Railway's environment variable system
- Rotate JWT secrets regularly

### 2. CORS Configuration
- Only allow necessary origins
- Use HTTPS in production
- Validate all inputs

### 3. Database Security
- Use MongoDB Atlas with proper authentication
- Enable IP whitelist if needed
- Regular backups

## 📊 Monitoring

### 1. Railway Monitoring
- Monitor application logs
- Set up alerts for errors
- Track resource usage

### 2. Application Monitoring
- Add error tracking (Sentry)
- Monitor API response times
- Track user analytics

## 🚨 Troubleshooting

### Common Issues:
1. **CORS Errors**: Check CORS configuration
2. **WebSocket Connection**: Verify signaling server URL
3. **Database Connection**: Check MongoDB Atlas settings
4. **File Uploads**: Verify Cloudinary configuration

### Debug Commands:
```bash
# Check Railway logs
railway logs

# Test API endpoints
curl -X GET https://api.vidyarthi-hub.xyz/api/v1/auth/test

# Test WebSocket connection
wscat -c wss://api.vidyarthi-hub.xyz
```

## 📞 Support
- Railway Documentation: https://docs.railway.app/
- MongoDB Atlas: https://docs.atlas.mongodb.com/
- Cloudinary: https://cloudinary.com/documentation 