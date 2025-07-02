import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import { FaClock, FaEye, FaPlus } from "react-icons/fa"
import { Link } from "react-router-dom"
import ProgressBar from "@ramonak/react-progress-bar"
import CoursesTable from "./InstructorCourses/CoursesTable"

function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const [enrolledCourses, setEnrolledCourses] = useState(null)
  const [instructorCourses, setInstructorCourses] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return;
    
    setLoading(true)
    if (user.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      (async () => {
        try {
          const result = await fetchInstructorCourses(token)
          setInstructorCourses(result)
        } catch (error) {
          console.log("Could not fetch instructor courses:", error)
          setInstructorCourses([])
        } finally {
          setLoading(false)
        }
      })()
    } else {
      (async () => {
        try {
          const response = await getUserEnrolledCourses(token)
          setEnrolledCourses(response)
        } catch (error) {
          console.log("Could not fetch enrolled courses:", error)
          setEnrolledCourses([])
        } finally {
          setLoading(false)
        }
      })()
    }
  }, [token, user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="spinner"></div>
      </div>
    )
  }

  // Instructor View
  if (user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Courses</h1>
            <p className="text-white">Manage and track your course performance</p>
          </div>
          <Link
            to="/dashboard/add-course"
            className="btn-modern inline-flex items-center gap-2"
          >
            <FaPlus className="w-4 h-4" />
            Create New Course
          </Link>
        </div>

        {/* Courses Table */}
        <div className="card-modern p-6">
          <CoursesTable 
            courses={instructorCourses || []} 
            setCourses={setInstructorCourses} 
          />
        </div>
      </div>
    )
  }

  // Student View
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Courses</h1>
        <p className="text-white">Continue your learning journey</p>
      </div>

      {/* Enrolled Courses */}
      {!enrolledCourses || !enrolledCourses.length ? (
        <div className="card-modern p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEye className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No courses enrolled yet
            </h3>
            <p className="text-white mb-6">
              Start your learning journey by enrolling in courses from our catalog
            </p>
            <Link
              to="/catalog"
              className="btn-modern inline-flex items-center gap-2"
            >
              <FaPlus className="w-4 h-4" />
              Explore Courses
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {enrolledCourses.map((course, index) => (
            <div
              key={course._id}
              className="card-modern p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/4">
                  <img
                    src={course.thumbnail}
                    alt={`course-card-${index}`}
                    className="h-full w-full rounded-lg object-cover shadow-md"
                  />
                </div>
                <div className="flex flex-col gap-4 lg:w-3/4">
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-2">
                      {course.courseName}
                    </h2>
                    <p className="text-white">
                      {course.courseDescription}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-white">
                      <FaClock className="w-4 h-4" />
                      <span className="font-medium">Progress: {course.progressPercentage || 0}%</span>
                    </div>
                    <ProgressBar
                      completed={course.progressPercentage || 0}
                      height="10px"
                      bgColor="#667eea"
                      baseBgColor="#e5e7eb"
                      labelColor="#374151"
                      borderRadius="5px"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <Link
                      to={`/view-course/${course._id}`}
                      className="btn-modern inline-flex items-center justify-center gap-2"
                    >
                      <FaEye className="w-4 h-4" />
                      Continue Learning
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyCourses