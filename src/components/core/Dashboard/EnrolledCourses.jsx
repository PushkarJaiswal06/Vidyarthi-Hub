import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"
import { FaClock, FaEye } from "react-icons/fa"
import { Link } from "react-router-dom"
import ProgressBar from "@ramonak/react-progress-bar"


function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const [enrolledCourses, setEnrolledCourses] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await getUserEnrolledCourses(token)
        console.log("Enrolled courses data:", response)
        setEnrolledCourses(response)
      } catch (error) {
        console.log("Could not fetch enrolled courses.")
      }
    })()
  }, [token])

  return (
    <>
      <div className="text-3xl text-cyan-200 font-medium px-6">Enrolled Courses</div>
      {!enrolledCourses ? (
        <div className="spinner"></div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-neutral-600">
          You have not enrolled in any course yet.
          {/* TODO: Add CTA Button */}
        </p>
      ) : (
        <div className="my-8 p-4 min-h-[60vh] flex flex-col md:flex-row gap-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-cyan-900/30 transition-shadow duration-300">
          <div className="flex flex-col gap-8">
            {enrolledCourses.map((course, index) => {
              const firstSectionId = course.courseContent?.[0]?._id;
              const firstSubSectionId = course.courseContent?.[0]?.subSection?.[0]?._id;
              const continueLink = (firstSectionId && firstSubSectionId)
                ? `/view-course/${course._id}/section/${firstSectionId}/sub-section/${firstSubSectionId}`
                : `/view-course/${course._id}`;
              return (
                <div
                  key={course._id}
                  className="flex flex-col sm:flex-row gap-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-cyan-300/30 hover:shadow-cyan-400/30 transition-shadow duration-300"
                >
                  {/* Thumbnail */}
                  <div className="w-full sm:w-1/4 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={course.thumbnail || 'https://via.placeholder.com/150x100?text=No+Image'}
                      alt={`course-card-${index}`}
                      className="w-full h-40 sm:h-full object-cover rounded-lg"
                    />
                  </div>
                  {/* Info */}
                  <div className="flex flex-col gap-4 w-full sm:w-3/4 p-2">
                    <div>
                      <h1 className="text-lg sm:text-2xl font-semibold text-cyan-200 p-2">
                        {course.courseName}
                      </h1>
                      <p className="text-cyan-100 mt-2 text-sm sm:text-base p-2">
                        {course.courseDescription}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-cyan-100 text-sm sm:text-base">
                        <FaClock className="w-4 h-4" />
                        <span>Progress: {course.progressPercentage || 0}%</span>
                      </div>
                      <ProgressBar
                        completed={course.progressPercentage || 0}
                        height="8px"
                        bgColor="#22d3ee"
                        baseBgColor="#155e75"
                        labelColor="#164e63"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Link
                        to={continueLink}
                        className="inline-flex items-center justify-center gap-2 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-md transition-colors duration-200"
                      >
                        <FaEye className="w-4 h-4" />
                        Continue Learning
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  )
}

export default EnrolledCourses