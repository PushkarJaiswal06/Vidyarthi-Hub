import { useDispatch, useSelector } from "react-redux"
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"

import { setCourse, setEditCourse } from "../../../../slices/courseSlice"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import { useState } from "react"
import { FaCheck } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom"

import { formatDate } from "../../../../services/formatDate"
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI"
import { COURSE_STATUS } from "../../../../utils/constants"
import ConfirmationModal from "../../../common/ConfirmationModal"

export default function CoursesTable({ courses, setCourses }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const TRUNCATE_LENGTH = 30

  const handleCourseDelete = async (courseId) => {
    setLoading(true)
    await deleteCourse({ courseId: courseId }, token)
    const result = await fetchInstructorCourses(token)
    if (result) {
      setCourses(result)
    }
    setConfirmationModal(null)
    setLoading(false)
  }

  // Modern Card UI
  return (
    <>
      <div className="flex flex-col gap-8">
        {courses?.length === 0 ? (
          <div className="py-10 text-center text-2xl font-medium text-white">
            No courses found
          </div>
        ) : (
          courses?.map((course) => (
            <div
              key={course._id}
              className="flex flex-col md:flex-row gap-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-cyan-900/30 transition-shadow duration-300"
            >
              {/* Thumbnail */}
              <img
                src={course?.thumbnail}
                alt={course?.courseName}
                className="h-40 w-full md:w-56 rounded-xl object-cover mb-4 md:mb-0"
              />
              {/* Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {course.courseName}
                  </h3>
                  <p className="text-richblack-200 text-sm mb-3">
                    {course.courseDescription.split(" ").length > TRUNCATE_LENGTH
                      ? course.courseDescription.split(" ").slice(0, TRUNCATE_LENGTH).join(" ") + "..."
                      : course.courseDescription}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-richblack-300 mb-2">
                    <span>Created: {formatDate(course.createdAt)}</span>
                    {course.status === COURSE_STATUS.DRAFT ? (
                      <span className="flex items-center gap-1 bg-pink-900/80 text-pink-100 px-2 py-1 rounded-full font-semibold">
                        <HiClock size={14} /> Drafted
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 bg-yellow-900/80 text-yellow-100 px-2 py-1 rounded-full font-semibold">
                        <FaCheck size={12} /> Published
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-6 mt-4">
                  <span className="flex items-center gap-1 text-cyan-300 font-semibold">
                    <HiClock size={18} /> {course.totalDuration}
                  </span>
                  <span className="text-lg font-bold text-green-400">
                    ₹{course.price}
                  </span>
                  <button
                    disabled={loading}
                    onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                    title="Edit"
                    className="ml-auto md:ml-0 flex items-center gap-1 px-3 py-2 rounded-lg bg-cyan-700/80 hover:bg-cyan-600 text-white font-semibold transition-colors duration-200 shadow-md"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Do you want to delete this course?",
                        text2: "All the data related to this course will be deleted",
                        btn1Text: !loading ? "Delete" : "Loading...  ",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleCourseDelete(course._id)
                          : () => {},
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                      })
                    }}
                    title="Delete"
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-700/80 hover:bg-red-600 text-white font-semibold transition-colors duration-200 shadow-md"
                  >
                    <RiDeleteBin6Line size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}