import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, ArrowLeft, Menu, X, Play, CheckCircle, Clock, Star, Video, Users } from "lucide-react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import IconBtn from "../../common/IconBtn"

export default function VideoDetailsSidebar({ setReviewModal, onLiveTab }) {
  const [activeStatus, setActiveStatus] = useState("")
  const [videoBarActive, setVideoBarActive] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { sectionId, subSectionId } = useParams()
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse)

  useEffect(() => {
    if (!courseSectionData.length) return
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const currentSubSectionIndx = courseSectionData?.[
      currentSectionIndx
    ]?.subSection.findIndex((data) => data._id === subSectionId)
    const activeSubSectionId =
      courseSectionData[currentSectionIndx]?.subSection?.[
        currentSubSectionIndx
      ]?._id
    setActiveStatus(courseSectionData?.[currentSectionIndx]?._id)
    setVideoBarActive(activeSubSectionId)
  }, [courseSectionData, courseEntireData, location.pathname])

  const calculateProgress = () => {
    if (!totalNoOfLectures) return 0
    return Math.round((completedLectures?.length / totalNoOfLectures) * 100)
  }

  const getSectionProgress = (section) => {
    if (!section?.subSection) return 0
    const completedInSection = section.subSection.filter(sub => 
      completedLectures.includes(sub._id)
    ).length
    return Math.round((completedInSection / section.subSection.length) * 100)
  }

  const sidebarContent = (
    <div className="flex h-full w-full flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-r border-slate-700/50">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(`/dashboard/enrolled-courses`)}
            className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            title="Back to Courses"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <button
            onClick={() => setReviewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors"
          >
            <Star size={18} />
            <span className="hidden sm:inline">Review</span>
          </button>
        </div>
        
        {/* Course Info */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">
              {courseEntireData?.courseName}
            </h2>
            <p className="text-slate-300 text-sm">
              {courseEntireData?.instructor?.firstName} {courseEntireData?.instructor?.lastName}
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Progress</span>
              <span className="text-white font-semibold">{calculateProgress()}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
            <p className="text-slate-400 text-xs">
              {completedLectures?.length || 0} of {totalNoOfLectures} lectures completed
            </p>
          </div>
          
          {/* Live Classes Button */}
          {onLiveTab && (
            <button
              onClick={onLiveTab}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              <Video size={18} />
              Live Classes
            </button>
          )}
        </div>
      </div>

      {/* Course Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {courseSectionData.map((section, index) => (
          <div key={section._id} className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
            {/* Section Header */}
            <button
              onClick={() => setActiveStatus(activeStatus === section._id ? "" : section._id)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 text-left">
                <div className="flex-shrink-0">
                  <Play size={18} className="text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white mb-1 truncate">
                    {section.sectionName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{section.subSection?.length || 0} lectures</span>
                    <span>•</span>
                    <span>{getSectionProgress(section)}% complete</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Section Progress Indicator */}
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">
                    {getSectionProgress(section)}%
                  </span>
                </div>
                {activeStatus === section._id ? (
                  <ChevronUp size={20} className="text-slate-400" />
                ) : (
                  <ChevronDown size={20} className="text-slate-400" />
                )}
              </div>
            </button>

            {/* Section Content */}
            {activeStatus === section._id && (
              <div className="border-t border-slate-700/50 bg-slate-800/50">
                {section.subSection?.map((lecture, i) => {
                  const isCompleted = completedLectures.includes(lecture._id)
                  const isActive = videoBarActive === lecture._id
                  
                  return (
                    <button
                      key={lecture._id}
                      onClick={() => {
                        navigate(
                          `/view-course/${courseEntireData?._id}/section/${section._id}/sub-section/${lecture._id}`
                        )
                        setVideoBarActive(lecture._id)
                      }}
                      className={`w-full p-4 flex items-center gap-3 hover:bg-slate-700/30 transition-colors border-b border-slate-700/30 last:border-b-0 ${
                        isActive ? 'bg-indigo-600/20 border-l-4 border-indigo-500' : ''
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle size={18} className="text-green-500" />
                        ) : (
                          <Play size={18} className="text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className={`font-medium truncate ${
                          isActive ? 'text-white' : 'text-slate-300'
                        }`}>
                          {lecture.title}
                        </p>
                        {lecture.duration && (
                          <div className="flex items-center gap-1 mt-1">
                            <Clock size={12} className="text-slate-500" />
                            <span className="text-xs text-slate-500">
                              {lecture.duration}
                            </span>
                          </div>
                        )}
                      </div>
                      {isActive && (
                        <div className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full"></div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Hamburger Menu */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-3 bg-slate-800 border border-slate-700 rounded-xl shadow-lg hover:bg-slate-700 transition-colors"
        >
          <Menu size={24} className="text-white" />
        </button>
      </div>
  
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-96 h-full bg-slate-900/50 backdrop-blur-sm border-r border-slate-700/50 z-30">
        {sidebarContent}
      </div>
  
      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Drawer content */}
          <div className="w-96 max-w-full bg-slate-900/95 backdrop-blur-sm border-r border-slate-700/50">
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <h2 className="text-lg font-semibold text-white">Course Content</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            {sidebarContent}
          </div>
          {/* Overlay to close drawer */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
        </div>
      )}
    </>
  )}