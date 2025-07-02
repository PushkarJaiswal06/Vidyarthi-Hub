import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { FaEnvelope, FaLock, FaGoogle, FaGithub } from "react-icons/fa"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { login } from "../../../services/operations/authAPI"

function LoginForm() {
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

  return (
    <div className="w-full">
      <form onSubmit={handleOnSubmit} className="flex flex-col gap-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium text-white/80">
            Email Address <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
              <FaEnvelope size={14} />
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
              <FaLock size={14} />
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
              {showPassword ? <AiOutlineEyeInvisible size={16} /> : <AiOutlineEye size={16} />}
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
  )
}

export default LoginForm