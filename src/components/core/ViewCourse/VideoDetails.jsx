import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { Play, SkipBack, SkipForward, CheckCircle, RotateCcw, MessageCircle, FileText, Download, Share2 } from "lucide-react"

import "video-react/dist/video-react.css"
import { useLocation } from "react-router-dom"
import { BigPlayButton, Player } from "video-react"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../common/IconBtn"

const TABS = ["Overview", "Notes", "Discussions", "Resources"]

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState([])
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("Overview")
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")
  const [discussions, setDiscussions] = useState([])
  const [newDiscussion, setNewDiscussion] = useState("")

  useEffect(() => {
    ;(async () => {
      if (!courseSectionData.length) return
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`)
      } else {
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        )
        const filteredVideoData = filteredData?.[0]?.subSection.filter(
          (data) => data._id === subSectionId
        )
        setVideoData(filteredVideoData[0])
        setPreviewSource(courseEntireData.thumbnail)
        setVideoEnded(false)
      }
    })()
  }, [courseSectionData, courseEntireData, location.pathname])

  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    return currentSectionIndx === 0 && currentSubSectionIndx === 0
  }

  const goToNextVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const noOfSubsections = courseSectionData[currentSectionIndx].subSection.length
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx + 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      )
    } else {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id
      const nextSubSectionId =
        courseSectionData[currentSectionIndx + 1].subSection[0]._id
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      )
    }
  }

  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const noOfSubsections = courseSectionData[currentSectionIndx].subSection.length
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    return (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    )
  }

  const goToPrevVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id
      const prevSubSectionLength =
        courseSectionData[currentSectionIndx - 1].subSection.length
      const prevSubSectionId =
        courseSectionData[currentSectionIndx - 1].subSection[
          prevSubSectionLength - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      )
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, { id: Date.now(), text: newNote, timestamp: new Date() }])
      setNewNote("")
    }
  }

  const addDiscussion = () => {
    if (newDiscussion.trim()) {
      setDiscussions([...discussions, { id: Date.now(), text: newDiscussion, timestamp: new Date() }])
      setNewDiscussion("")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Video Player Section */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-slate-800/50 rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
            <div className="aspect-video bg-black rounded-t-2xl relative">
              {!videoData ? (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={previewSource}
                    alt="Course Preview"
                    className="max-w-full max-h-full object-contain rounded-t-2xl"
                  />
                </div>
              ) : (
                <Player
                  ref={playerRef}
                  aspectRatio="16:9"
                  playsInline
                  onEnded={() => setVideoEnded(true)}
                  src={videoData?.videoUrl}
                  fluid={false}
                  width="100%"
                  height="100%"
                >
                  <BigPlayButton position="center" />
                  {videoEnded && (
                    <div className="absolute inset-0 z-50 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                          <CheckCircle className="mx-auto mb-4 text-green-400" size={48} />
                          <h3 className="text-2xl font-bold text-white mb-6">Lecture Complete!</h3>
                          
                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {!completedLectures.includes(subSectionId) && (
                              <button
                                disabled={loading}
                                onClick={handleLectureCompletion}
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                              >
                                <CheckCircle size={20} />
                                {loading ? "Marking..." : "Mark as Complete"}
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (playerRef?.current) {
                                  playerRef.current.seek(0)
                                  setVideoEnded(false)
                                }
                              }}
                              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                            >
                              <RotateCcw size={20} />
                              Rewatch
                            </button>
                          </div>
                          
                          <div className="flex gap-4 justify-center mt-6">
                            {!isFirstVideo() && (
                              <button
                                disabled={loading}
                                onClick={goToPrevVideo}
                                className="flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
                              >
                                <SkipBack size={20} />
                                Previous
                              </button>
                            )}
                            {!isLastVideo() && (
                              <button
                                disabled={loading}
                                onClick={goToNextVideo}
                                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
                              >
                                Next
                                <SkipForward size={20} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Player>
              )}
            </div>
            
            {/* Video Info */}
            <div className="p-6 bg-slate-800/30">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-2">{videoData?.title}</h1>
                  <p className="text-slate-300 leading-relaxed">{videoData?.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                    <Share2 size={18} />
                    Share
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                    <Download size={18} />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="flex-1 max-w-6xl mx-auto w-full p-6">
        <div className="bg-slate-800/30 rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-slate-700/50 bg-slate-800/50">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 font-semibold transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white border-b-2 border-indigo-400"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                {tab === "Overview" && <FileText size={18} className="inline mr-2" />}
                {tab === "Notes" && <FileText size={18} className="inline mr-2" />}
                {tab === "Discussions" && <MessageCircle size={18} className="inline mr-2" />}
                {tab === "Resources" && <Download size={18} className="inline mr-2" />}
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 min-h-[400px]">
            {activeTab === "Overview" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">{videoData?.title}</h2>
                  <p className="text-slate-300 text-lg leading-relaxed">{videoData?.description}</p>
                </div>
                {videoData?.additionalInfo && (
                  <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                    <h3 className="text-lg font-semibold text-white mb-3">Additional Information</h3>
                    <p className="text-slate-300">{videoData.additionalInfo}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Notes" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">My Notes</h2>
                  <div className="flex gap-3 mb-6">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note about this lecture..."
                      className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && addNote()}
                    />
                    <button
                      onClick={addNote}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
                    >
                      Add Note
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  {notes.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <FileText size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No notes yet. Add your first note above!</p>
                    </div>
                  ) : (
                    notes.map((note) => (
                      <div key={note.id} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                        <p className="text-white mb-2">{note.text}</p>
                        <p className="text-slate-400 text-sm">
                          {note.timestamp.toLocaleDateString()} at {note.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "Discussions" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Discussion</h2>
                  <div className="flex gap-3 mb-6">
                    <input
                      type="text"
                      value={newDiscussion}
                      onChange={(e) => setNewDiscussion(e.target.value)}
                      placeholder="Ask a question or start a discussion..."
                      className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && addDiscussion()}
                    />
                    <button
                      onClick={addDiscussion}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
                    >
                      Post
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  {discussions.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No discussions yet. Start the conversation!</p>
                    </div>
                  ) : (
                    discussions.map((discussion) => (
                      <div key={discussion.id} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                        <p className="text-white mb-2">{discussion.text}</p>
                        <p className="text-slate-400 text-sm">
                          {discussion.timestamp.toLocaleDateString()} at {discussion.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "Resources" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-4">Resources</h2>
                <div className="text-center py-12 text-slate-400">
                  <Download size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No resources available for this lecture.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoDetails