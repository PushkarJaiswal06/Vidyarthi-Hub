import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"

import {
  fetchCourseDetails,
  getFullDetailsOfCourse,
} from "../../../../services/operations/courseDetailsAPI"
import { setCourse, setEditCourse, setStep } from "../../../../slices/courseSlice"
import RenderSteps from "../AddCourse/RenderSteps"

export default function EditCourse() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courseId } = useParams()
  const { course, step } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)
  const [unsaved, setUnsaved] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const result = await getFullDetailsOfCourse(courseId, token)
      if (result?.courseDetails) {
        dispatch(setEditCourse(true))
        dispatch(setCourse(result?.courseDetails))
      }
      setLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSaveChanges = () => {
    // TODO: Implement save changes functionality
    console.log("Save changes clicked")
    setUnsaved(false)
  }

  const handlePreview = () => {
    // TODO: Implement preview functionality
    console.log("Preview clicked")
  }

  const handleNext = () => {
    if (step < 3) {
      dispatch(setStep(step + 1))
      setUnsaved(true)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      dispatch(setStep(step - 1))
      setUnsaved(true)
    }
  }

  if (loading) {
    return (
      <div className="grid flex-1 place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Course</h1>
        <span className="px-4 py-1 rounded-full bg-yellow-400/20 text-yellow-400 font-semibold text-sm">Edit Mode</span>
        {unsaved && <span className="px-4 py-1 rounded-full bg-pink-700/20 text-pink-300 font-semibold text-sm animate-pulse">Unsaved Changes</span>}
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-6 bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-cyan-900/30">
          {course ? (
            <RenderSteps setUnsaved={setUnsaved} />
          ) : (
            <p className="mt-14 text-center text-3xl font-semibold text-cyan-100">
              Course not found
            </p>
          )}
        </div>
        {/* Edit Tips */}
        <div className="sticky top-10 hidden max-w-[400px] flex-1 rounded-2xl border border-cyan-900/30 bg-white/10 backdrop-blur-xl p-6 xl:block shadow-2xl">
          <p className="mb-8 text-lg text-cyan-200 font-bold">Edit Tips</p>
          <ul className="ml-5 list-disc space-y-4 text-base text-cyan-100">
            <li>Remember to save your changes frequently.</li>
            <li>Unsaved changes will be highlighted above.</li>
            <li>You can preview your course before publishing.</li>
            <li>Update course content, pricing, and details as needed.</li>
            <li>Contact support if you need help editing your course.</li>
          </ul>
        </div>
      </div>
      {/* Floating Action Bar (for mobile) */}
      <div className="fixed bottom-0 left-0 w-full bg-cyan-900/80 py-4 flex justify-center gap-4 z-40 lg:hidden">
        <button 
          className="bg-cyan-700 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-xl shadow-lg transition-all"
          onClick={handleSaveChanges}
        >
          Save Changes
        </button>
        {step > 1 && (
          <button 
            className="bg-white/20 hover:bg-cyan-900 text-cyan-100 font-bold py-2 px-6 rounded-xl shadow-lg transition-all"
            onClick={handleBack}
          >
            Back
          </button>
        )}
        {step < 3 && (
          <button 
            className="bg-cyan-700 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-xl shadow-lg transition-all"
            onClick={handleNext}
          >
            Next
          </button>
        )}
        <button 
          className="bg-cyan-700 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-xl shadow-lg transition-all"
          onClick={handlePreview}
        >
          Preview
        </button>
      </div>
    </div>
  )
}