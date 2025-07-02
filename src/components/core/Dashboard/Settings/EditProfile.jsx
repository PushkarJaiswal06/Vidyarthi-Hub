import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { updateProfile } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitProfileForm = async (data) => {
    // console.log("Form Data - ", data)
    try {
      dispatch(updateProfile(token, data))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(submitProfileForm)}>
      <div className="glass rounded-2xl p-8 md:p-12 shadow-xl border border-cyan-900/30 backdrop-blur-xl flex flex-col gap-y-8">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          Edit Profile Information
        </h2>
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex flex-col gap-4 md:w-1/2">
            <label htmlFor="firstName" className="text-white/80 font-semibold mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter first name"
              className="glass-input"
              {...register("firstName", { required: true })}
              defaultValue={user?.firstName}
            />
            {errors.firstName && (
              <span className="text-xs text-yellow-200">Please enter your first name.</span>
            )}
          </div>
          <div className="flex flex-col gap-4 md:w-1/2">
            <label htmlFor="lastName" className="text-white/80 font-semibold mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter last name"
              className="glass-input"
              {...register("lastName", { required: true })}
              defaultValue={user?.lastName}
            />
            {errors.lastName && (
              <span className="text-xs text-yellow-200">Please enter your last name.</span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex flex-col gap-4 md:w-1/2">
            <label htmlFor="dateOfBirth" className="text-white/80 font-semibold mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              className="glass-input"
              {...register("dateOfBirth", {
                required: {
                  value: true,
                  message: "Please enter your Date of Birth.",
                },
                max: {
                  value: new Date().toISOString().split("T")[0],
                  message: "Date of Birth cannot be in the future.",
                },
              })}
              defaultValue={user?.additionalDetails?.dateOfBirth}
            />
            {errors.dateOfBirth && (
              <span className="text-xs text-yellow-200">{errors.dateOfBirth.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-4 md:w-1/2">
            <label htmlFor="gender" className="text-white/80 font-semibold mb-1">Gender</label>
            <select
              name="gender"
              id="gender"
              className="glass-input"
              {...register("gender", { required: true })}
              defaultValue={user?.additionalDetails?.gender}
            >
              {genders.map((ele, i) => (
                <option key={i} value={ele}>{ele}</option>
              ))}
            </select>
            {errors.gender && (
              <span className="text-xs text-yellow-200">Please select your gender.</span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex flex-col gap-4 md:w-1/2">
            <label htmlFor="contactNumber" className="text-white/80 font-semibold mb-1">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              id="contactNumber"
              placeholder="Enter Contact Number"
              className="glass-input"
              {...register("contactNumber", {
                required: {
                  value: true,
                  message: "Please enter your Contact Number.",
                },
                maxLength: { value: 12, message: "Invalid Contact Number" },
                minLength: { value: 10, message: "Invalid Contact Number" },
              })}
              defaultValue={user?.additionalDetails?.contactNumber}
            />
            {errors.contactNumber && (
              <span className="text-xs text-yellow-200">{errors.contactNumber.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-4 md:w-1/2">
            <label htmlFor="about" className="text-white/80 font-semibold mb-1">About</label>
            <input
              type="text"
              name="about"
              id="about"
              placeholder="Enter Bio Details"
              className="glass-input"
              {...register("about", { required: true })}
              defaultValue={user?.additionalDetails?.about}
            />
            {errors.about && (
              <span className="text-xs text-yellow-200">Please enter your About.</span>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard/my-profile")}
            className="px-6 py-2 rounded-full font-semibold bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all backdrop-blur-md shadow"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Save" className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-2 rounded-full font-semibold shadow-neon hover:from-blue-500 hover:to-cyan-400 transition-all" />
        </div>
      </div>
    </form>
  )
}

// Add this to your global CSS or tailwind config:
// .glass-input {
//   @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all;
// }