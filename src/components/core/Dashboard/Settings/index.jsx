import { useState } from "react"
import { FaUserEdit, FaImage, FaKey, FaTrash } from "react-icons/fa"
import ChangeProfilePicture from "./ChangeProfilePicture"
import DeleteAccount from "./DeleteAccount"
import EditProfile from "./EditProfile"
import UpdatePassword from "./UpdatePassword"

export default function Settings() {
  const [showPassword, setShowPassword] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 py-8">
      <h1 className="mb-8 text-3xl font-extrabold text-white flex items-center gap-3">
        <FaUserEdit className="text-cyan-400" /> Edit Profile & Settings
      </h1>
      {/* Change Profile Picture */}
      <div className="rounded-2xl bg-white/10 backdrop-blur-xl p-6 shadow border border-cyan-900/30">
        <div className="flex items-center gap-3 mb-4">
          <FaImage className="text-cyan-400 text-xl" />
          <span className="text-lg font-semibold text-white">Profile Picture</span>
        </div>
        <ChangeProfilePicture />
      </div>
      {/* Profile */}
      <div className="rounded-2xl bg-white/10 backdrop-blur-xl p-6 shadow border border-cyan-900/30">
        <div className="flex items-center gap-3 mb-4">
          <FaUserEdit className="text-cyan-400 text-xl" />
          <span className="text-lg font-semibold text-white">Profile Information</span>
        </div>
        <EditProfile />
      </div>
      {/* Password - Collapsible */}
      <div className="rounded-2xl bg-white/10 backdrop-blur-xl p-6 shadow border border-cyan-900/30">
        <button
          className="flex items-center gap-3 mb-4 text-lg font-semibold text-white focus:outline-none"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          <FaKey className="text-cyan-400 text-xl" />
          Change Password
          <span className="ml-2 text-cyan-300">{showPassword ? "▲" : "▼"}</span>
        </button>
        {showPassword && <UpdatePassword />}
      </div>
      {/* Delete Account - Collapsible */}
      <div className="rounded-2xl bg-white/10 backdrop-blur-xl p-6 shadow border border-pink-700/40">
        <button
          className="flex items-center gap-3 mb-4 text-lg font-semibold text-pink-200 focus:outline-none"
          onClick={() => setShowDelete((prev) => !prev)}
        >
          <FaTrash className="text-pink-400 text-xl" />
          Delete Account
          <span className="ml-2 text-pink-300">{showDelete ? "▲" : "▼"}</span>
        </button>
        {showDelete && <DeleteAccount />}
      </div>
    </div>
  )
}