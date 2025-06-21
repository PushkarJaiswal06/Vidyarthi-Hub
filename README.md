# VidyarthiHub Online Education Platform (MERN App) [Website Link](https://vidyarthihub-frontend.vercel.app/)

## Overview

VidyarthiHub is a fully functional ed-tech platform that enables users to create, consume,
and rate educational content. It is built to help instructors easily create and sell courses
and help students discover and buy courses from their preferred domain.

VidyarthiHub aims to provide:
- A platform for instructors to create and sell courses
- A platform for students to discover and buy courses
- A platform for users to rate and review courses
- A platform for users to track their learning progress

## Features

### For Students
- Browse and search for courses
- Purchase courses
- Watch course videos
- Track learning progress
- Rate and review courses
- Access course materials

### For Instructors
- Create and publish courses
- Upload course videos
- Manage course content
- Track student progress
- Receive payments
- View analytics

### For Administrators
- Manage users and courses
- Monitor platform activity
- Handle payments and refunds
- Generate reports

## Technology Stack

### Frontend
- React.js
- Redux Toolkit
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Razorpay Integration
- Cloudinary Integration

## Architecture

In summary, VidyarthiHub is a versatile and intuitive ed-tech platform that is designed to
provide a seamless learning experience for both instructors and students. With its modern
technology stack, comprehensive feature set, and user-friendly interface, it offers a
complete solution for online education.

### System Architecture

The VidyarthiHub ed-tech platform consists of three main components: the front end, the
back end, and the database. Each component plays a crucial role in ensuring the platform
functions smoothly and efficiently.

#### Frontend Architecture

Here is a high-level diagram that illustrates the architecture of the VidyarthiHub ed-tech
platform:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React.js)    │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

The front end of VidyarthiHub has all the necessary pages that an ed-tech platform should
have. Here are the key pages and their functionalities:

1. **Home Page**: Landing page with course highlights and features
2. **Catalog Page**: Browse and search for courses
3. **Course Details Page**: View detailed information about a course
4. **Sign Up/Login Pages**: User authentication
5. **Dashboard**: User-specific dashboard for students and instructors
6. **Course Creation**: Interface for instructors to create courses
7. **Video Player**: Watch course videos
8. **Payment Integration**: Secure payment processing

The frontend is built using React.js with the following key features:
- Responsive design using Tailwind CSS
- State management with Redux Toolkit
- Client-side routing with React Router
- HTTP requests with Axios
- Form handling with React Hook Form
- Toast notifications with React Hot Toast

#### Backend Architecture

VidyarthiHub uses a monolithic architecture, with the backend built using Node.js and
Express.js. The backend provides a RESTful API that the frontend consumes.

The back end of VidyarthiHub provides a range of features and functionalities, including:

1. **User Authentication**: JWT-based authentication system
2. **Course Management**: CRUD operations for courses
3. **Payment Processing**: Integration with Razorpay
4. **File Upload**: Cloud-based media management using Cloudinary
5. **Email Notifications**: Automated email sending
6. **Data Validation**: Input validation and sanitization
7. **Error Handling**: Comprehensive error handling and logging

1. Cloud-based media management: VidyarthiHub uses Cloudinary, a cloud-based media
   management service, to handle file uploads and storage. This ensures that media files
   are stored securely and can be accessed quickly.

2. Payment gateway integration: The platform integrates with Razorpay, a popular payment
   gateway in India, to handle secure payments and transactions.

The back end of VidyarthiHub uses a range of frameworks, libraries, and tools to ensure its
functionality and performance. Here are the key technologies used:

- **Node.js**: Runtime environment for JavaScript
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling tool
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **nodemailer**: Email sending
- **multer**: File upload handling
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

#### Database Design

The back end of VidyarthiHub uses a range of data models and database schemas to
store and manage data efficiently. Here are the key models:

- **User Model**: Stores user information and authentication data
- **Course Model**: Stores course information and metadata
- **Section Model**: Stores course section information
- **SubSection Model**: Stores course subsection information
- **Rating and Review Model**: Stores course ratings and reviews
- **Payment Model**: Stores payment information
- **Profile Model**: Stores user profile information

Overall, the back-end of VidyarthiHub is designed to provide a robust and scalable solution
for online education, with a focus on security, performance, and user experience.

## API Design

The VidyarthiHub platform's API is designed following the REST architectural style. The
API provides a set of endpoints that allow the frontend to interact with the backend
and perform various operations.

### API Endpoints

#### Authentication Endpoints
- `POST /api/v1/auth/sendotp` - Send OTP for email verification
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/reset-password-token` - Send password reset token
- `POST /api/v1/auth/reset-password` - Reset password

#### Course Endpoints
- `GET /api/v1/course/getAllCourses` - Get all courses
- `GET /api/v1/course/getCourseDetails` - Get course details
- `POST /api/v1/course/createCourse` - Create a new course
- `PUT /api/v1/course/editCourse` - Edit course
- `DELETE /api/v1/course/deleteCourse` - Delete course

#### Payment Endpoints
- `POST /api/v1/payment/capturePayment` - Capture payment
- `POST /api/v1/payment/verifyPayment` - Verify payment
- `POST /api/v1/payment/sendPaymentSuccessEmail` - Send payment success email

#### Profile Endpoints
- `GET /api/v1/profile/getUserDetails` - Get user details
- `PUT /api/v1/profile/updateProfile` - Update user profile
- `PUT /api/v1/profile/updateDisplayPicture` - Update profile picture

### API Response Format

All API responses follow a consistent format:

```json
{
  "success": true/false,
  "message": "Response message",
  "data": {
    // Response data
  }
}
```

In conclusion, the REST API design for the VidyarthiHub ed-tech platform is a crucial part
of the overall architecture. It provides a standardized way for the frontend and backend to
communicate, ensuring that data is transferred efficiently and securely. The API design
follows REST principles, making it easy to understand and use, while also providing clear
documentation about what kind of data it will accept or return. With this API design, VidyarthiHub will be able to
provide a seamless and efficient user experience for both instructors and students.

