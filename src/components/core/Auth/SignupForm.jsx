import { useState } from "react"
import { toast } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { FaUser, FaEnvelope, FaLock, FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sendOtp } from "../../../services/operations/authAPI"
import { setSignupData } from "../../../slices/authSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import Tab from "../../common/Tab"

function SignupForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // student or instructor
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { firstName, lastName, email, password, confirmPassword } = formData

  // Handle input fields, when some value changes
  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  // Handle Form Submission
  const handleOnSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords Do Not Match")
      return
    }

    setIsLoading(true)
    
    try {
      const signupData = {
        ...formData,
        accountType,
      }

      // Setting signup data to state
      // To be used after otp verification
      dispatch(setSignupData(signupData))
      // Send OTP to user for verification
      await dispatch(sendOtp(formData.email, navigate))

      // Reset
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      })
      setAccountType(ACCOUNT_TYPE.STUDENT)
    } catch (error) {
      console.error("Signup error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // data to pass to Tab component
  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT,
      icon: <FaUserGraduate className="h-3 w-3" />,
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
      icon: <FaChalkboardTeacher className="h-3 w-3" />,
    },
  ]

  return (
    <div className="w-full">
      {/* Tab */}
      <div className="mb-4">
        <Tab tabData={tabData} field={accountType} setField={setAccountType} />
      </div>
      
      {/* Form */}
      <form onSubmit={handleOnSubmit} className="flex flex-col gap-3">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstName" className="block mb-1 text-sm font-medium text-white/80">
              First Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                <FaUser size={12} />
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
                <FaUser size={12} />
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
              <FaEnvelope size={12} />
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
                <FaLock size={12} />
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
                {showPassword ? <AiOutlineEyeInvisible size={14} /> : <AiOutlineEye size={14} />}
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-white/80">
              Confirm Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                <FaLock size={12} />
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
                {showConfirmPassword ? <AiOutlineEyeInvisible size={14} /> : <AiOutlineEye size={14} />}
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
  )
}

export default SignupForm