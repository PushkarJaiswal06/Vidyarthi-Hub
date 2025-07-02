import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { FaUser, FaEnvelope, FaPhone, FaGlobe, FaComment, FaPaperPlane } from "react-icons/fa"

import CountryCode from "../../data/countrycode.json"
import { apiConnector } from "../../services/apiconnector"
import { contactusEndpoint } from "../../services/apis"

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm()

  const submitContactForm = async (data) => {
    // console.log("Form Data - ", data)
    try {
      setLoading(true)
      const res = await apiConnector(
        "POST",
        contactusEndpoint.CONTACT_US_API,
        data
      )
      // console.log("Email Res - ", res)
      
      if (res.data.success) {
        toast.success("Message sent successfully! We'll get back to you soon.")
      } else {
        toast.error("Failed to send message. Please try again.")
      }
      
      setLoading(false)
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
      toast.error("Failed to send message. Please try again.")
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
      })
    }
  }, [reset, isSubmitSuccessful])

  return (
    <div className="form-animate">
      <form
        className="form-modern"
        onSubmit={handleSubmit(submitContactForm)}
      >
        {/* Name Fields */}
        <div className="form-grid form-grid-2">
          <div className="form-group-modern">
            <label htmlFor="firstname" className="form-label-modern required">
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-cyan-400" />
              </div>
              <input
                type="text"
                name="firstname"
                id="firstname"
                placeholder="Enter first name"
                className={`input-modern pl-12 w-full ${errors.firstname ? 'error' : ''}`}
                {...register("firstname", { required: true })}
              />
            </div>
            {errors.firstname && (
              <div className="form-error">
                Please enter your first name.
              </div>
            )}
          </div>
          
          <div className="form-group-modern">
            <label htmlFor="lastname" className="form-label-modern">
              Last Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-cyan-400" />
              </div>
              <input
                type="text"
                name="lastname"
                id="lastname"
                placeholder="Enter last name"
                className="input-modern pl-12 w-full"
                {...register("lastname")}
              />
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div className="form-group-modern">
          <label htmlFor="email" className="form-label-modern required">
            Email Address
          </label>
                      <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-cyan-400" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter email address"
                className={`input-modern pl-12 w-full ${errors.email ? 'error' : ''}`}
                {...register("email", { required: true })}
              />
            </div>
          {errors.email && (
            <div className="form-error">
              Please enter your email address.
            </div>
          )}
        </div>

        {/* Phone Number Field */}
        <div className="form-group-modern">
          <label htmlFor="phonenumber" className="form-label-modern required">
            Phone Number
          </label>
          <div className="flex gap-4">
            <div className="w-32">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaGlobe className="h-4 w-4 text-cyan-400" />
                </div>
                <select
                  className="select-modern pl-10 text-black"
                  defaultValue="+91"
                  {...register("countrycode", { required: true })}
                >
                  {CountryCode.map((ele, i) => {
                    return (
                      <option key={i} value={ele.code}>
                        {ele.code} -{ele.country}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-cyan-400" />
                </div>
                <input
                  type="number"
                  name="phonenumber"
                  id="phonenumber"
                  placeholder="12345 67890"
                  className={`input-modern pl-12 w-full ${errors.phoneNo ? 'error' : ''}`}
                  {...register("phoneNo", {
                    required: {
                      value: true,
                      message: "Please enter your phone number.",
                    },
                    maxLength: { value: 12, message: "Invalid phone number" },
                    minLength: { value: 10, message: "Invalid phone number" },
                  })}
                />
              </div>
            </div>
          </div>
          {errors.phoneNo && (
            <div className="form-error">
              {errors.phoneNo.message}
            </div>
          )}
        </div>

        {/* Message Field */}
        <div className="form-group-modern">
          <label htmlFor="message" className="form-label-modern required">
            Message
          </label>
          <div className="relative">
            <div className="absolute top-4 left-4 flex items-start pointer-events-none">
              <FaComment className="h-5 w-5 text-cyan-400" />
            </div>
            <textarea
              name="message"
              id="message"
              cols="30"
              rows="7"
              placeholder="Enter your message here"
              className={`textarea-modern pl-12 ${errors.message ? 'error' : ''}`}
              {...register("message", { required: true })}
            />
          </div>
          {errors.message && (
            <div className="form-error">
              Please enter your message.
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          type="submit"
          className="btn-modern w-full flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="spinner w-5 h-5"></div>
              <span>Sending message...</span>
            </>
          ) : (
            <>
              <FaPaperPlane className="h-4 w-4" />
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default ContactUsForm