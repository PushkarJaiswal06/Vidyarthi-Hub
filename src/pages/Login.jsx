import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Globe,
  BookOpen,
  Users,
  Star,
  Target,
  Heart
} from "lucide-react"
import { toast } from "react-hot-toast"
import { FaGoogle, FaGithub } from "react-icons/fa"

import { login } from "../services/operations/authAPI"
import { useDispatch } from "react-redux"
import AnimatedHeading from "../components/common/AnimatedHeading"
import { 
  AnimatedLines, 
  FloatingShapes, 
  AnimatedGrid, 
  AnimatedDots
} from "../components/common/SVGDecorations"
import Navbar from '../components/common/Navbar'

// Animated floating elements for login
const FloatingBook = ({ position, delay = 0 }) => (
  <motion.div
    className="absolute text-purple-400/30"
    style={{
      left: position.x,
      top: position.y,
    }}
    animate={{
      y: [0, -30, 0],
      x: [0, 20, 0],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  >
    <BookOpen className="w-8 h-8" />
  </motion.div>
)

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
)

const FloatingShape = ({ position, delay = 0, color = "purple" }) => (
  <motion.div
    className={`absolute w-4 h-4 bg-${color}-400/20 rounded-full`}
    style={{
      left: position.x,
      top: position.y,
    }}
    animate={{
      y: [0, -40, 0],
      x: [0, Math.random() * 30 - 15, 0],
      scale: [1, 1.3, 1],
    }}
    transition={{
      duration: 6 + Math.random() * 2,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  />
)

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { email, password } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await dispatch(login(email, password, navigate))
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-richblack-900 via-purple-900 to-richblack-800 relative overflow-hidden">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ y: [0, -30, 0], x: [0, 20, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ y: [0, 40, 0], x: [0, -25, 0], rotate: [0, -180, -360] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-20 right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ y: [0, -20, 0], x: [0, 15, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"
          />
          {/* Floating Books */}
          {[...Array(6)].map((_, i) => (
            <FloatingBook
              key={i}
              position={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
              }}
              delay={Math.random() * 3}
            />
          ))}
          {/* Floating Stars */}
          {[...Array(15)].map((_, i) => (
            <FloatingStar
              key={i}
              position={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
              }}
              delay={Math.random() * 3}
            />
          ))}
          {/* Floating Shapes */}
          {[...Array(8)].map((_, i) => (
            <FloatingShape
              key={i}
              position={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
              }}
              delay={Math.random() * 2}
              color={i % 2 === 0 ? "purple" : "blue"}
            />
          ))}
        </div>
        {/* Centered Login Form */}
        <div className="w-full max-w-lg mx-auto relative z-10">
          <div className="text-center lg:text-left mb-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center lg:justify-start space-x-3 mb-4"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-neon">
                <BookOpen className="text-white w-5 h-5" />
              </div>
              
            
            <AnimatedHeading 
              size="lg" 
              strokeColor="#4facfe"
              className="m-6"
            >
              Welcome Back
            </AnimatedHeading>
            </motion.div>
            <p className="text-sm text-white/80 leading-relaxed">
              Sign in to continue your learning journey and access your personalized dashboard.
            </p>
          </div>
          <div className="glass rounded-2xl p-6 shadow-neon">
            <form onSubmit={handleOnSubmit} className="flex flex-col gap-4">
              {/* Email Field */}
              <div >
                <label htmlFor="email" className="block mb-1 text-sm font-medium text-white/80">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                    <Mail size={14} />
                  </span>
                  <input
                    required
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={handleOnChange}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 focus:border-purple-400 focus:outline-none transition text-sm"
                    autoComplete="username"
                  />
                </div>
              </div>
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block mb-1 text-sm font-medium text-white/80">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                    <Lock size={14} />
                  </span>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={password}
                    onChange={handleOnChange}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 focus:border-purple-400 focus:outline-none transition text-sm"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/60"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-white/60">
                  <input type="checkbox" name="remember" className="accent-purple-500 w-3 h-3 rounded" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-purple-400 hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-md hover:from-purple-600 hover:to-blue-600 transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <span>Sign in</span>
                )}
              </button>
              {/* Divider */}
              <div className="flex items-center my-2">
                <div className="flex-grow border-t border-white/20"></div>
                <span className="mx-3 text-white/40 text-xs px-2">Or continue with</span>
                <div className="flex-grow border-t border-white/20"></div>
              </div>
              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2 rounded-lg border border-white/20 text-white bg-white/10 hover:bg-white/20 transition font-medium text-xs"
                >
                  <FaGoogle className="text-red-400" size={12} />
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2 rounded-lg border border-white/20 text-white bg-white/10 hover:bg-white/20 transition font-medium text-xs"
                >
                  <FaGithub size={12} />
                  GitHub
                </button>
              </div>
              {/* Sign Up Link */}
              <div className="text-center mt-3 text-white/60 text-xs">
                Don't have an account?{' '}
                <Link to="/signup" className="text-purple-400 hover:underline font-semibold">
                  Sign up for free
                </Link>
              </div>
            </form>
          </div>
          {/* Compact Features Preview */}
          <div className="mt-4 grid grid-cols-2 gap-3">
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login