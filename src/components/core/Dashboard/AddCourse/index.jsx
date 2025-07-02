import { useDispatch, useSelector } from "react-redux"
import { setStep } from "../../../../slices/courseSlice"
import RenderSteps from "./RenderSteps"

export default function AddCourse() {
  const dispatch = useDispatch()
  const { step } = useSelector((state) => state.course)

  const handleNext = () => {
    if (step < 3) {
      dispatch(setStep(step + 1))
    }
  }

  const handleBack = () => {
    if (step > 1) {
      dispatch(setStep(step - 1))
    }
  }

  const handleSaveDraft = () => {
    // TODO: Implement save draft functionality
    console.log("Save draft clicked")
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-richblack-900 via-cyan-900 to-richblack-800 flex flex-col items-center py-10 px-2">
      {/* Stepper/Progress Bar */}
      <div className="w-full max-w-4xl flex items-center justify-center py-8">
        <div className="w-full max-w-2xl h-3 bg-white/10 rounded-full overflow-hidden shadow-lg border border-cyan-900/30 backdrop-blur-xl">
          <div className="h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-10 w-full max-w-6xl">
        <div className="flex-1 flex flex-col gap-10 bg-white/10 backdrop-blur-xl rounded-2xl p-10 shadow-2xl border border-cyan-900/30">
          <h1 className="text-4xl font-extrabold text-white mb-8 tracking-tight">Add Course</h1>
          <RenderSteps />
        </div>
        {/* Course Upload Tips */}
        <aside className="sticky top-10 hidden xl:block max-w-xs w-full rounded-2xl border border-cyan-900/30 bg-white/10 backdrop-blur-xl p-8 shadow-2xl ml-2">
          <p className="mb-8 text-lg text-cyan-200 font-bold">⚡ Course Upload Tips</p>
          <ul className="ml-5 list-disc space-y-4 text-base text-cyan-100">
            <li>Set the Course Price option or make it free.</li>
            <li>Standard size for the course thumbnail is 1024x576.</li>
            <li>Video section controls the course overview video.</li>
            <li>Course Builder is where you create & organize a course.</li>
            <li>Add Topics in the Course Builder section to create lessons, quizzes, and assignments.</li>
            <li>Information from the Additional Data section shows up on the course single page.</li>
            <li>Make Announcements to notify any important</li>
            <li>Notes to all enrolled students at once.</li>
          </ul>
        </aside>
      </div>
      {/* Floating Action Bar (for mobile) */}
      <div className="fixed bottom-0 left-0 w-full bg-cyan-900/80 py-4 flex justify-center gap-4 z-40 lg:hidden">
        <button 
          className="bg-cyan-700 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-xl shadow-lg transition-all"
          onClick={handleSaveDraft}
        >
          Save Draft
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
      </div>
    </div>
  )
}