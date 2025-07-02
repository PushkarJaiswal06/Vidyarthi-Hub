import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams, useNavigate } from "react-router-dom"

import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice"

export default function ViewCourse() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const course = useSelector((state) => state.viewCourse.entireCourseData)
  const completedLectures = useSelector((state) => state.viewCourse.completedLectures)
  const totalLectures = useSelector((state) => state.viewCourse.totalNoOfLectures)
  const dispatch = useDispatch()
  const [reviewModal, setReviewModal] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token)
      if (!courseData || courseData.error || courseData.message) {
        setError(courseData?.message || courseData?.error || "Course not found or you do not have access.")
        return
      }
      dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
      dispatch(setEntireCourseData(courseData.courseDetails))
      dispatch(setCompletedLectures(courseData.completedVideos))
      let lectures = 0
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length
      })
      dispatch(setTotalNoOfLectures(lectures))
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <div className="bg-richblack-900/90 border border-cyan-900/40 rounded-2xl shadow-2xl p-10 text-center max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-red-400 mb-4">Course Not Found</h2>
          <p className="text-cyan-100 text-lg mb-2">{error}</p>
          <p className="text-cyan-400/80">Please check the course link or contact support if you believe this is a mistake.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-richblack-900 via-cyan-900 to-richblack-800">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/10 backdrop-blur-xl border-b border-cyan-900/30 flex items-center justify-between px-6 py-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 rounded-lg bg-cyan-700/80 hover:bg-cyan-600 text-white font-semibold shadow"
            onClick={() => navigate(-1)}
          >
            &larr; Back
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{course?.courseName || "Course"}</h2>
            <div className="text-cyan-200 text-sm">{course?.instructor?.firstName} {course?.instructor?.lastName}</div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-cyan-100 text-xs mb-1">Progress</div>
          <div className="w-40 h-2 bg-cyan-900/40 rounded-full overflow-hidden">
            <div
              className="h-2 bg-cyan-400 rounded-full transition-all"
              style={{ width: totalLectures ? `${(completedLectures.length / totalLectures) * 100}%` : "0%" }}
            ></div>
          </div>
          <div className="text-cyan-200 text-xs mt-1">
            {completedLectures.length} / {totalLectures} Lectures Completed
          </div>
        </div>
      </div>
      {/* Main Layout */}
      <div className="flex min-h-[calc(100vh-3.5rem-4.5rem)]">
        {/* Sidebar */}
        <div className="hidden md:block w-72 bg-white/10 backdrop-blur-xl border-r border-cyan-900/30 shadow-xl">
          <VideoDetailsSidebar setReviewModal={setReviewModal} />
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-auto">
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </div>
      </div>
      {/* Mobile Sidebar Drawer (optional, for real app use a drawer lib) */}
      {/* Review Modal */}
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </div>
  )
}