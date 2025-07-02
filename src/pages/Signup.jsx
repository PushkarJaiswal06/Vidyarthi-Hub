import React, { useState } from "react";
import { motion } from "framer-motion";

import { 
  Rocket, 
  Sparkles, 
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Users,
  Star,
  Target,
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  GraduationCap,
} from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../services/operations/authAPI";
import { setSignupData } from "../slices/authSlice";
import { ACCOUNT_TYPE } from "../utils/constants";
import Tab from "../components/common/Tab";
import AnimatedHeading from "../components/common/AnimatedHeading";
import Navbar from '../components/common/Navbar';
// Space-themed animated elements for signup
const FloatingPlanet = ({ position, size, color, delay = 0 }) => (
  <motion.div
    className={`absolute w-${size} h-${size} rounded-full ${color} opacity-20 blur-sm`}
    style={{
      left: position.x,
      top: position.y,
    }}
    animate={{
      y: [0, -30, 0],
      x: [0, 20, 0],
      rotate: [0, 180, 360],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 8 + Math.random() * 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  />
);

const FloatingStar = ({ position, delay = 0 }) => (
  <motion.div
    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
    style={{
      left: position.x,
      top: position.y,
    }}
    animate={{
      y: [0, -20, 0],
      opacity: [0.3, 1, 0.3],
      scale: [0.5, 1.5, 0.5],
    }}
    transition={{
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  />
);

const CometTrail = ({ startX, startY, endX, endY, delay = 0 }) => (
  <motion.div
    className="absolute"
    style={{
      left: startX,
      top: startY,
    }}
    animate={{
      x: [0, endX - startX],
      y: [0, endY - startY],
      opacity: [1, 0],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "linear",
      delay,
    }}
  >
    <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-transparent rounded-full" />
  </motion.div>
);

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // student or instructor
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { firstName, lastName, email, password, confirmPassword } = formData;

  // Handle input fields, when some value changes
  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle Form Submission
  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords Do Not Match");
      return;
    }

    setIsLoading(true);
    
    try {
      const signupData = {
        ...formData,
        accountType,
      };

      // Setting signup data to state
      // To be used after otp verification
      dispatch(setSignupData(signupData));
      // Send OTP to user for verification
      await dispatch(sendOtp(formData.email, navigate));

      // Reset
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setAccountType(ACCOUNT_TYPE.STUDENT);
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // data to pass to Tab component
  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT,
      icon: <GraduationCap className="h-3 w-3" />,
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
      icon: <User className="h-3 w-3" />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto pt-24">
          {/* Space-themed background elements */}
          {/* Floating Planets */}
          <FloatingPlanet position={{ x: "10%", y: "20%" }} size="16" color="bg-purple-500" delay={0} />
          <FloatingPlanet position={{ x: "80%", y: "10%" }} size="12" color="bg-blue-500" delay={2} />
          <FloatingPlanet position={{ x: "15%", y: "70%" }} size="20" color="bg-pink-500" delay={4} />
          <FloatingPlanet position={{ x: "85%", y: "80%" }} size="14" color="bg-indigo-500" delay={1} />
          
          {/* Floating Stars */}
          {[...Array(15)].map((_, i) => (
            <FloatingStar 
              key={i}
              position={{ 
                x: `${Math.random() * 100}%`, 
                y: `${Math.random() * 100}%` 
              }} 
              delay={Math.random() * 3}
            />
          ))}
          
          {/* Comet Trails */}
          <CometTrail startX={0} startY={100} endX={400} endY={320} delay={0} />
          <CometTrail startX={400} startY={50} endX={0} endY={360} delay={3} />

          {isLoading ? (
            <div className="relative z-10">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="relative z-10 w-full mx-auto">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-1 gap-8 h-full"
              >
                {/* Form Section */}
                <motion.div variants={itemVariants} className="w-full mx-auto lg:mx-0">
                  <div >
                    
                    
                    <AnimatedHeading 
                      size="lg" 
                      strokeColor="#8c5cf6"
                      className="mb-3"
                    >
                      Start Your Journey
                    </AnimatedHeading>
                    <p className="text-sm text-white/80 leading-relaxed">
                      Join thousands of learners and instructors in the most innovative learning platform.
                    </p>
                  </div>
                  
                  <div className="glass rounded-2xl p-6 shadow-neon">
                    {/* Tab */}
                    <div className="mb-4">
                      <Tab tabData={tabData} field={accountType} setField={setAccountType} />
                    </div>
                    
                    {/* Form */}
                    <form onSubmit={handleOnSubmit} className="flex flex-col gap-4">
                      {/* Name Fields */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="firstName" className="block mb-1 text-sm font-medium text-white/80">
                            First Name <span className="text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                              <User size={12} />
                            </span>
                            <input
                              required
                              type="text"
                              name="firstName"
                              id="firstName"
                              value={firstName}
                              onChange={handleOnChange}
                              placeholder="First name"
                              className="w-full pl-8 pr-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 focus:border-purple-400 focus:outline-none transition text-sm"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="lastName" className="block mb-1 text-sm font-medium text-white/80">
                            Last Name <span className="text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                              <User size={12} />
                            </span>
                            <input
                              required
                              type="text"
                              name="lastName"
                              id="lastName"
                              value={lastName}
                              onChange={handleOnChange}
                              placeholder="Last name"
                              className="w-full pl-8 pr-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 focus:border-purple-400 focus:outline-none transition text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Email Field */}
                      <div>
                        <label htmlFor="email" className="block mb-1 text-sm font-medium text-white/80">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                            <Mail size={12} />
                          </span>
                          <input
                            required
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={handleOnChange}
                            placeholder="Enter email address"
                            className="w-full pl-8 pr-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 focus:border-purple-400 focus:outline-none transition text-sm"
                          />
                        </div>
                      </div>

                      {/* Password Fields */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="password" className="block mb-1 text-sm font-medium text-white/80">
                            Password <span className="text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                              <Lock size={12} />
                            </span>
                            <input
                              required
                              type={showPassword ? "text" : "password"}
                              name="password"
                              id="password"
                              value={password}
                              onChange={handleOnChange}
                              placeholder="Create password"
                              className="w-full pl-8 pr-8 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 focus:border-purple-400 focus:outline-none transition text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/60"
                            >
                              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-white/80">
                            Confirm Password <span className="text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                              <Lock size={12} />
                            </span>
                            <input
                              required
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              id="confirmPassword"
                              value={confirmPassword}
                              onChange={handleOnChange}
                              placeholder="Confirm password"
                              className="w-full pl-8 pr-8 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 focus:border-purple-400 focus:outline-none transition text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/60"
                            >
                              {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow-md hover:from-purple-600 hover:to-indigo-600 transition disabled:opacity-60 disabled:cursor-not-allowed text-sm mt-2"
                      >
                        {isLoading ? (
                          <span>Creating Account...</span>
                        ) : (
                          <span>Create Account</span>
                        )}
                      </button>

                      {/* Terms and Login Link */}
                      <div className="text-center text-white/60 text-xs">
                        By signing up, you agree to our{' '}
                        <span className="text-purple-400 hover:underline cursor-pointer">Terms of Service</span>
                        {' '}and{' '}
                        <span className="text-purple-400 hover:underline cursor-pointer">Privacy Policy</span>
                      </div>
                      
                      <div className="text-center text-white/60 text-xs">
                        Already have an account?{' '}
                        <span className="text-purple-400 hover:underline cursor-pointer">
                          Sign in
                        </span>
                      </div>
                    </form>
                  </div>

                  {/* Compact Features Preview */}
                  <motion.div variants={itemVariants} className="mt-4 grid grid-cols-2 gap-3">
                    <div className="glass rounded-lg p-3 text-center">
                      <Shield className="w-4 h-4 text-green-400 mx-auto mb-1" />
                      <p className="text-xs text-white/70">Secure</p>
                    </div>
                    <div className="glass rounded-lg p-3 text-center">
                      <Zap className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                      <p className="text-xs text-white/70">Fast</p>
                    </div>
                    <div className="glass rounded-lg p-3 text-center">
                      <Globe className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                      <p className="text-xs text-white/70">Global</p>
                    </div>
                    <div className="glass rounded-lg p-3 text-center">
                      <Users className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                      <p className="text-xs text-white/70">Community</p>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Animated Space Illustration Section */}
                <motion.div variants={itemVariants} className="relative hidden lg:block">
                  <div className="relative h-96 flex items-center justify-center">
                    {/* Central Rocket Illustration */}
                    <motion.div
                      animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="relative z-10"
                    >
                      <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                        <Rocket className="w-16 h-16 text-purple-400" />
                      </div>
                    </motion.div>

                    {/* Orbiting Planets */}
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        style={{
                          left: "50%",
                          top: "50%",
                        }}
                        animate={{
                          x: [0, Math.cos((i * 72) * Math.PI / 180) * 140],
                          y: [0, Math.sin((i * 72) * Math.PI / 180) * 140],
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 25,
                          repeat: Infinity,
                          ease: "linear",
                          delay: i * 3,
                        }}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 ${
                          i % 3 === 0 ? "bg-purple-400/30" : i % 3 === 1 ? "bg-blue-400/30" : "bg-pink-400/30"
                        }`}>
                          <div className={`w-3 h-3 rounded-full ${
                            i % 3 === 0 ? "bg-purple-400" : i % 3 === 1 ? "bg-blue-400" : "bg-pink-400"
                          }`} />
                        </div>
                      </motion.div>
                    ))}

                    {/* Floating Stats */}
                    <div className="absolute -top-4 -left-4 glass rounded-xl p-3 shadow-neon">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="text-sm font-bold text-white">10K+</div>
                          <div className="text-xs text-white/60">Students</div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute -bottom-4 -right-4 glass rounded-xl p-3 shadow-neon">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <div>
                          <div className="text-sm font-bold text-white">4.9</div>
                          <div className="text-xs text-white/60">Rating</div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-1/2 -right-4 glass rounded-xl p-3 shadow-neon">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-green-400" />
                        <div>
                          <div className="text-sm font-bold text-white">95%</div>
                          <div className="text-xs text-white/60">Success</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;