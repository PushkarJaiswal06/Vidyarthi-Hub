import React, { useState } from "react"
import { NavLink, matchPath, useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import { sidebarLinks as dashboardLinks } from "../../../data/dashboard-links"
import { 
  FaHome, 
  FaUser, 
  FaCog, 
  FaShoppingCart, 
  FaGraduationCap, 
  FaBook, 
  FaPlus, 
  FaChartBar,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa"
import ConfirmationModal from "../../common/ConfirmationModal"
import { logout } from "../../../services/operations/authAPI"

function Sidebar() {
  const { user } = useSelector((state) => state.profile)
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [confirmationModal, setConfirmationModal] = useState(null)

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  const getIcon = (name) => {
    switch (name) {
      case "Dashboard":
        return <FaHome className="w-5 h-5" />
      case "My Profile":
        return <FaUser className="w-5 h-5" />
      case "Settings":
        return <FaCog className="w-5 h-5" />
      case "Cart":
        return <FaShoppingCart className="w-5 h-5" />
      case "Enrolled Courses":
        return <FaGraduationCap className="w-5 h-5" />
      case "My Courses":
        return <FaBook className="w-5 h-5" />
      case "Add Course":
        return <FaPlus className="w-5 h-5" />
      case "Instructor":
        return <FaChartBar className="w-5 h-5" />
      default:
        return <FaHome className="w-5 h-5" />
    }
  }

  const filteredLinks = dashboardLinks.filter((link) => {
    if (user?.accountType === ACCOUNT_TYPE.STUDENT) {
      return link.type === "Student" || link.type === "Common"
    } else if (user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      return link.type === "Instructor" || link.type === "Common"
    }
    return false
  })

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-16 left-4 z-50 p-2 bg-white shadow-soft border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <FaTimes className="w-6 h-6 text-neutral-700" />
        ) : (
          <FaBars className="w-6 h-6 text-neutral-700" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-richblack-800 to-richblack-900 shadow-2xl shadow-cyan-900/40 border-r border-cyan-900/40 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Close button for mobile */}
        {isMobileMenuOpen && (
          <button
            className="absolute top-4 right-4 z-50 lg:hidden text-white bg-cyan-900/80 rounded-full p-2 hover:bg-cyan-700 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        )}
        {/* User Info */}
        <div className="pt-16 pb-2 border-b border-cyan-900/40 flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            {user?.firstName?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-bold text-white truncate">{user?.firstName} {user?.lastName}</div>
            <div className="text-xs text-cyan-200 truncate">{user?.email}</div>
            <div className="text-xs text-cyan-400 font-semibold capitalize mt-1">{user?.accountType} <span className="text-cyan-200">Dashboard</span></div>
            
          </div>
          
        </div>
        {/* Navigation Links */}
        <nav className="flex-1 py-6 space-y-2 overflow-y-auto">
          {filteredLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-5 py-3 rounded-lg font-semibold text-base transition-all duration-200 group border border-transparent ${
                  isActive
                    ? "bg-cyan-700/80 text-white border-cyan-400 shadow-lg"
                    : "text-cyan-100 hover:bg-cyan-800/60 hover:text-white"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className={`transition-colors duration-200 ${
                matchRoute(link.path) ? "text-white" : "text-cyan-300 group-hover:text-white"
              }`}>
                {getIcon(link.name)}
              </div>
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
        {/* Footer */}
        <div className="p-4 border-t border-cyan-900/40 flex flex-col gap-2">
          <NavLink to="/dashboard/my-profile" className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold text-cyan-100 hover:bg-cyan-800/60 hover:text-white transition-all duration-200 group">
            <FaUser className="w-5 h-5 text-cyan-300 group-hover:text-white" />
            <span>My Profile</span>
          </NavLink>
          <button
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold text-cyan-100 hover:bg-red-700/60 hover:text-white transition-all duration-200 group"
            onClick={() => setConfirmationModal({
              text1: "Are you sure you want to sign out?",
              text2: "You will be logged out of your account.",
              btn1Text: "Yes",
              btn2Text: "Cancel",
              btn1Handler: () => { dispatch(logout(navigate)); setConfirmationModal(null); },
              btn2Handler: () => setConfirmationModal(null),
            })}
          >
            <FaSignOutAlt className="w-5 h-5 text-cyan-300 group-hover:text-white" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default Sidebar