import { useEffect, useState } from "react"
import { getUserEnrolledCourses, getInstructorData } from "../../../services/operations/profileAPI"
import { useSelector, useDispatch } from "react-redux"
import { FaUser, FaBook, FaGraduationCap, FaTrophy, FaChartLine, FaCog, FaSignOutAlt, FaCalendarAlt, FaUsers, FaBullseye, FaEdit } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import ConfirmationModal from "../../common/ConfirmationModal"
import { logout } from "../../../services/operations/authAPI"

function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const token = useSelector((state) => state.auth.token)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [instructorCourses, setInstructorCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [activeLiveClass, setActiveLiveClass] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      if (user?.accountType === "Student") {
        const courses = await getUserEnrolledCourses(token)
        setEnrolledCourses(courses || [])
      } else if (user?.accountType === "Instructor") {
        const courses = await getInstructorData(token)
        setInstructorCourses(courses || [])
      }
      setLoading(false)
    }
    if (user && token) fetchData()
  }, [user, token])

  // For students: get unique instructors from enrolled courses
  let latestInstructors = []
  if (user?.accountType === "Student" && enrolledCourses.length > 0) {
    const instructorMap = {}
    enrolledCourses.forEach((c) => {
      if (c.instructor && !instructorMap[c.instructor._id]) {
        instructorMap[c.instructor._id] = c.instructor
      }
    })
    latestInstructors = Object.values(instructorMap).slice(0, 3)
  }

  // For instructors: get latest students from their courses
  let latestStudents = []
  if (user?.accountType === "Instructor" && instructorCourses.length > 0) {
    let allStudents = []
    instructorCourses.forEach((c) => {
      if (c.studentsEnrolled && Array.isArray(c.studentsEnrolled)) {
        allStudents = allStudents.concat(c.studentsEnrolled)
      }
    })
    const studentMap = {}
    allStudents.forEach((s) => {
      if (s._id && !studentMap[s._id]) {
        studentMap[s._id] = s
      }
    })
    latestStudents = Object.values(studentMap).slice(-5).reverse()
  }

  const totalCourses = user?.accountType === "Student"
    ? enrolledCourses.length
    : instructorCourses.length
  const completedCount = 0 // TODO: Replace with backend data
  const awardsCount = 0 // TODO: Replace with backend data
  const totalHours = "--" // TODO: Replace with backend data

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-cyan-400 text-xl animate-pulse">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen flex flex-col gap-8 px-2 md:px-8 py-8 bg-gradient-to-br from-richblack-900 via-cyan-900 to-richblack-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">Hello, {user?.firstName}!</h1>
          <p className="text-cyan-100/80 text-lg">Here's your learning snapshot and quick actions.</p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-700/80 hover:bg-cyan-600 text-white font-semibold shadow-lg transition-all"
          onClick={() => navigate('/dashboard/settings')}
        >
          <FaEdit /> Edit Profile
        </button>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow border border-cyan-900/30">
          <FaBook className="text-cyan-400 text-2xl mb-2" />
          <div className="text-2xl font-bold text-white">{totalCourses}</div>
          <div className="text-cyan-200 text-sm">Total Courses</div>
        </div>
        <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow border border-cyan-900/30">
          <FaGraduationCap className="text-cyan-400 text-2xl mb-2" />
          <div className="text-2xl font-bold text-white">{completedCount}</div>
          <div className="text-cyan-200 text-sm">Completed</div>
        </div>
        <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow border border-cyan-900/30">
          <FaTrophy className="text-cyan-400 text-2xl mb-2" />
          <div className="text-2xl font-bold text-white">{awardsCount}</div>
          <div className="text-cyan-200 text-sm">Awards</div>
        </div>
        <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow border border-cyan-900/30">
          <FaChartLine className="text-cyan-400 text-2xl mb-2" />
          <div className="text-2xl font-bold text-white">{totalHours}</div>
          <div className="text-cyan-200 text-sm">Total Hours</div>
        </div>
      </div>

      {/* Main Grid: Profile Card, Latest Users, Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 flex flex-col items-center shadow-xl border border-cyan-900/30">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-white text-5xl font-extrabold mb-4 border-4 border-cyan-700/40 shadow-lg">
            {user?.firstName?.charAt(0)}
          </div>
          <div className="text-xl font-bold text-white mb-1">{user?.firstName} {user?.lastName}</div>
          <div className="text-cyan-200 text-base mb-2">{user?.email}</div>
          <div className="flex items-center gap-2 text-cyan-400 text-sm mb-4">
            <FaUser /> {user?.accountType} Dashboard
          </div>
          <div className="flex flex-col gap-2 w-full mt-2">
            <div className="flex items-center justify-between text-cyan-100/80 text-base">
              <span>Courses</span>
              <span className="font-bold">{totalCourses}</span>
            </div>
            <div className="flex items-center justify-between text-cyan-100/80 text-base">
              <span>Completed</span>
              <span className="font-bold">{completedCount}</span>
            </div>
            <div className="flex items-center justify-between text-cyan-100/80 text-base">
              <span>Awards</span>
              <span className="font-bold">{awardsCount}</span>
            </div>
          </div>
        </div>
        {/* Latest Users/Activity */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-cyan-900/30 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <FaUsers className="text-cyan-400 text-xl" />
            <span className="text-white font-semibold text-lg">Latest {user?.accountType === "Instructor" ? "Students" : "Instructors"}</span>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            {user?.accountType === "Instructor" && latestStudents.length > 0 ? (
              latestStudents.map((student, idx) => (
                <div className="flex items-center gap-3" key={student._id || idx}>
                  <div className="w-10 h-10 rounded-full bg-cyan-700 flex items-center justify-center text-white font-bold">
                    {student.firstName?.charAt(0) || "S"}
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-base font-semibold">{student.firstName} {student.lastName}</div>
                    <div className="text-cyan-200 text-xs">{student.email}</div>
                  </div>
                </div>
              ))
            ) : user?.accountType === "Student" && latestInstructors.length > 0 ? (
              latestInstructors.map((instructor, idx) => (
                <div className="flex items-center gap-3" key={instructor._id || idx}>
                  <div className="w-10 h-10 rounded-full bg-cyan-700 flex items-center justify-center text-white font-bold">
                    {instructor.firstName?.charAt(0) || "I"}
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-base font-semibold">{instructor.firstName} {instructor.lastName}</div>
                    <div className="text-cyan-200 text-xs">{instructor.email}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-cyan-200/60 text-base">No users to display.</div>
            )}
          </div>
        </div>
        {/* Progress Widget */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-cyan-900/30 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-4">
            <FaBullseye className="text-cyan-400 text-xl" />
            <span className="text-white font-semibold text-lg">Your Success Rate</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            {/* Placeholder for progress ring */}
            <div className="w-28 h-28 rounded-full border-8 border-cyan-700 flex items-center justify-center text-white text-3xl font-extrabold mb-2 bg-cyan-900/30">
              {/* TODO: Replace with dynamic value */}
              75%
            </div>
            <div className="text-cyan-200 text-base">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="mt-10 flex flex-wrap gap-4 items-center justify-center">
        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-700/80 hover:bg-cyan-600 text-white font-semibold shadow-lg transition-all">
          <FaBook /> My Courses
        </button>
        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-700/80 hover:bg-cyan-600 text-white font-semibold shadow-lg transition-all">
          <FaCalendarAlt /> Calendar
        </button>
        <button
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-700/80 hover:bg-cyan-600 text-white font-semibold shadow-lg transition-all"
          onClick={() => navigate('/dashboard/settings')}
        >
          <FaCog /> Settings
        </button>
        <button
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-700/80 hover:bg-red-600 text-white font-semibold shadow-lg transition-all"
          onClick={() => setConfirmationModal({
            text1: "Are you sure you want to sign out?",
            text2: "You will be logged out of your account.",
            btn1Text: "Yes",
            btn2Text: "Cancel",
            btn1Handler: () => { dispatch(logout(navigate)); setConfirmationModal(null); },
            btn2Handler: () => setConfirmationModal(null),
          })}
        >
          <FaSignOutAlt /> Sign Out
        </button>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}

      {/* Live Class Room Modal (placeholder) */}
      {activeLiveClass && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80">
          <div className="bg-white/10 border border-cyan-900/30 rounded-2xl shadow-2xl p-10 text-white max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">Live Class Room (Coming Soon)</h2>
            <div className="mb-4">Class: <span className="text-cyan-300">{activeLiveClass.title}</span></div>
            <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-semibold shadow transition-all" onClick={() => setActiveLiveClass(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyProfile 