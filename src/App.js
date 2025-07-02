import "./App.css";
import {Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home"
import Navbar from "./components/common/Navbar"
import OpenRoute from "./components/core/Auth/OpenRoute"
import { Helmet } from "react-helmet";
import ScrollToTop from "./components/common/ScrollToTop";
import Footer from "./components/common/Footer";

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Error from "./pages/Error"
import Settings from "./components/core/Dashboard/Settings";
import { useDispatch, useSelector } from "react-redux";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import { ACCOUNT_TYPE } from "./utils/constants";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";

function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.profile)


  return (
   <div className="min-h-screen bg-gradient-to-br from-richblack-900 via-purple-900 to-richblack-800 font-sans">
    <Helmet>
      <title>VidyarthiHub - Next Generation Learning Platform</title>
      <meta name="description" content="VidyarthiHub is a modern, interactive learning platform with 3D environments, AI-driven content, and expert-led courses. Transform your future with cutting-edge education technology." />
      <meta name="keywords" content="Online Learning, 3D Education, AI Learning, Interactive Courses, Modern LMS, VidyarthiHub" />
      <meta name="author" content="VidyarthiHub Team" />
      <meta property="og:title" content="VidyarthiHub - Next Generation Learning Platform" />
      <meta property="og:description" content="Experience the future of education with interactive 3D environments, personalized AI-driven content, and expert-led courses from industry professionals." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://vidyarthihub.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    </Helmet>
    
    <Navbar/>
    <ScrollToTop />
    <main className="pt-16">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="catalog" element={<Catalog/>} />
        <Route path="catalog/:catalogName" element={<Catalog/>} />
        <Route path="courses/:courseId" element={<CourseDetails/>} />
        
        <Route
            path="signup"
            element={
              <OpenRoute>
                <Signup />
              </OpenRoute>
            }
          />
      <Route
            path="login"
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />

      <Route
            path="forgot-password"
            element={
              <OpenRoute>
                <ForgotPassword />
              </OpenRoute>
            }
          />  

        <Route
            path="verify-email"
            element={
              <OpenRoute>
                <VerifyEmail />
              </OpenRoute>
            }
          />  

      <Route
            path="update-password/:id"
            element={
              <OpenRoute>
                <UpdatePassword />
              </OpenRoute>
            }
          />  

        <Route
            path="/about"
            element={
              
                <About />
              
            }
          />
      <Route path="/contact" element={<Contact />} />

      <Route 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      >
        <Route path="dashboard/my-profile" element={<MyProfile />} />
        
        <Route path="dashboard/Settings" element={<Settings />} />
        

        {
          user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
            <Route path="dashboard/cart" element={<Cart />} />
            <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
            </>
          )
        }

        {
          user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
            <Route path="dashboard/instructor" element={<Instructor />} />
            <Route path="dashboard/add-course" element={<AddCourse />} />
            <Route path="dashboard/my-courses" element={<MyCourses />} />
            <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
            
            </>
          )
        }


      </Route>

      
        <Route element={
          <PrivateRoute>
            <ViewCourse />
          </PrivateRoute>
        }>

        {
          user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
            <Route 
              path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
              element={<VideoDetails />}
            />
            </>
          )
        }

        </Route>



      <Route path="*" element={<Error />} />


      </Routes>
    </main>
    <Footer />
   </div>
  );
}

export default App;
