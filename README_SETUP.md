# VidyarthiHub LMS Setup Guide

## Backend Setup

### 1. Environment Variables
Create a `.env` file in the `server` directory with the following variables:

```env
# Database Configuration
MONGODB_URL=mongodb://localhost:27017/vidyarthiHub

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password

# Cloudinary Configuration (for image uploads)
CLOUD_NAME=your-cloud-name
API_KEY=your-api-key
API_SECRET=your-api-secret
FOLDER_NAME=vidyarthi-hub

# Razorpay Configuration (for payments)
RAZORPAY_KEY=your-razorpay-key
RAZORPAY_SECRET=your-razorpay-secret

# Server Configuration
PORT=4000
```

### 2. Email Setup (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `MAIL_PASS`

### 3. MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URL` with your connection string

### 4. Start Backend Server
```bash
cd server
npm install
npm start
```

## Frontend Setup

### 1. Environment Variables (Optional)
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:4000/api/v1
```

### 2. Start Frontend
```bash
npm install
npm start
```

## Features Fixed

### ✅ Authentication
- **Login/Signup**: Now properly integrated with backend
- **OTP Verification**: Fixed OTP sending and verification
- **Password Reset**: Email-based password reset functionality

### ✅ UI/UX Improvements
- **Modern Design**: Glassmorphism effects and modern styling
- **Color Contrast**: Fixed all text color issues for better accessibility
- **Responsive Design**: Mobile-friendly layouts
- **Form Validation**: Proper error handling and user feedback

### ✅ Pages Updated
- **Login Page**: Modern design with proper backend integration
- **Signup Page**: Updated with modern styling and OTP verification
- **About Page**: Fixed color contrast and modern layout
- **Contact Page**: Modern design with working contact form
- **Dashboard**: Responsive design with proper navigation

### ✅ Components Fixed
- **Navbar**: Modern design with proper navigation
- **Footer**: Updated styling and links
- **Forms**: Modern input styling with proper validation
- **Cards**: Glassmorphism effects and hover animations

## Troubleshooting

### OTP Not Sending
1. Check email configuration in server `.env`
2. Ensure Gmail app password is correctly set
3. Check server logs for email errors

### Backend Connection Issues
1. Ensure MongoDB is running
2. Check if server is running on port 4000
3. Verify CORS configuration

### Frontend Issues
1. Clear browser cache
2. Check browser console for errors
3. Ensure all dependencies are installed

## Development Notes

- The application now uses modern Tailwind CSS classes
- All old `richblack-*` colors have been replaced with proper neutral colors
- Backend integration is fully functional
- Email functionality requires proper Gmail configuration
- Payment integration requires Razorpay credentials 