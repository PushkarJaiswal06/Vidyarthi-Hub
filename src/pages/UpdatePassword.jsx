import { useState, useEffect } from "react"
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaArrowLeft } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"

import { resetPassword } from "../services/operations/authAPI"
import { useDispatch } from "react-redux"
import Navbar from '../components/common/Navbar'

function UpdatePassword() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()

  const { password, confirmPassword } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords Do Not Match")
      return
    }

    setIsLoading(true)
    
    try {
      await dispatch(resetPassword(password, confirmPassword, id, navigate))
      setIsSuccess(true)
      toast.success("Password updated successfully!")
    } catch (error) {
      console.error("Update password error:", error)
      toast.error("Failed to update password. Please try again.")
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
              <div className="text-sm text-neutral-500">Password Update</div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Choose new password
          </h1>
          <p className="text-neutral-600">
            Enter your new password below to complete the reset process.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl form-animate">
          {!isSuccess ? (
            <form onSubmit={handleOnSubmit} className="form-modern">
              {/* New Password Field */}
              <div className="form-group-modern">
                <label htmlFor="password" className="form-label-modern required">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={password}
                    onChange={handleOnChange}
                    placeholder="Enter new password"
                    className="input-modern pl-12 pr-12 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-neutral-600 transition-colors"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-neutral-400" />
                    ) : (
                      <FaEye className="h-5 w-5 text-neutral-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="form-group-modern">
                <label htmlFor="confirmPassword" className="form-label-modern required">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={handleOnChange}
                    placeholder="Confirm new password"
                    className="input-modern pl-12 pr-12 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-neutral-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-neutral-400" />
                    ) : (
                      <FaEye className="h-5 w-5 text-neutral-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Password Requirements:</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                  <li>• Contains at least one special character</li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-modern w-full flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="spinner w-5 h-5"></div>
                    <span>Updating password...</span>
                  </>
                ) : (
                  <>
                    <FaLock className="h-4 w-4" />
                    <span>Update Password</span>
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
                Password Updated Successfully!
              </h3>
              <p className="text-neutral-600 mb-6">
                Your password has been updated. You can now sign in with your new password.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="btn-modern flex items-center justify-center space-x-2 mx-auto"
              >
                <FaArrowLeft className="h-4 w-4" />
                <span>Go to Login</span>
              </button>
            </div>
          )}

          {/* Back to Login */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate("/login")}
              className="text-primary-600 hover:text-primary-500 font-medium transition-colors duration-200 flex items-center justify-center space-x-2 mx-auto"
            >
              <FaArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdatePassword