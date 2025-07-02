import { useState } from "react"
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from "react-icons/fa"
import { Link } from "react-router-dom"
import { toast } from "react-hot-toast"

import { getPasswordResetToken } from "../services/operations/authAPI"
import { useDispatch } from "react-redux"
import Navbar from '../components/common/Navbar'

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await dispatch(getPasswordResetToken(email, setEmailSent))
    } catch (error) {
      console.error("Forgot password error:", error)
      toast.error("Failed to send reset link. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <Navbar />
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">VH</span>
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                VIDYARTHI HUB
              </div>
              <div className="text-sm text-neutral-500">Password Recovery</div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            {!emailSent ? "Reset your password" : "Check your email"}
          </h1>
          <p className="text-neutral-600">
            {!emailSent 
              ? "Enter your email address and we'll send you a link to reset your password."
              : "We've sent a password reset link to your email address."
            }
          </p>
        </div>

        {/* Form */}
        <div className="bg-grey/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl form-animate text-black-200">
          {!emailSent ? (
            <form onSubmit={handleOnSubmit} className="form-modern text-black-200">
              <div className="form-group-modern text-black-200">
                <label htmlFor="email" className="form-label-modern required text-black ">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black-200">
                    <FaEnvelope className="h-5 w-5 text-green-900" />
                  </div>
                  <input
                    required
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="input-modern pl-12 w-full text-black-200 placeholder-gray-50"
                    class="placeholder-gray-500 pl-12 input-modern pl-12 w-full text-black-200 placeholder-gray-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-modern w-full flex items-center justify-center space-x-2 text-black"
              >
                {isLoading ? (
                  <>
                    <div className="spinner w-5 h-5"></div>
                    <span>Sending reset link...</span>
                  </>
                ) : (
                  <>
                    <FaEnvelope className="h-4 w-4" />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Email Sent Successfully!
              </h3>
              <p className="text-neutral-600 mb-6">
                Please check your email inbox and follow the instructions to reset your password.
              </p>
              
            </div>
          )}

          {/* Back to Login */}
          <div className="text-center mt-6">
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-500 font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <FaArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword