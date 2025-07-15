import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-hot-toast"

import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice"
import LiveClassRoom from "../components/core/LiveClassRoom/LiveClassRoom";
import Tab from "../components/common/Tab";

export default function ViewCourse() {
  const { courseId } = useParams()
  const { token, user } = useSelector((state) => state.auth)
  const course = useSelector((state) => state.viewCourse.entireCourseData)
  const completedLectures = useSelector((state) => state.viewCourse.completedLectures)
  const totalLectures = useSelector((state) => state.viewCourse.totalNoOfLectures)
  const dispatch = useDispatch()
  const [reviewModal, setReviewModal] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [liveClasses, setLiveClasses] = useState([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [activeLiveClass, setActiveLiveClass] = useState(null);
  const location = useLocation();
  const courseSectionData = useSelector((state) => state.viewCourse.courseSectionData);
  const [activeTab, setActiveTab] = useState("content");

  // Tab data
  const tabData = [
    { id: 1, type: "content", tabName: "Course Content" },
    { id: 2, type: "live", tabName: "Live Classes" },
    { id: 3, type: "resources", tabName: "Resources" },
    { id: 4, type: "discussions", tabName: "Discussions" },
  ];

  // Fetch course details
  useEffect(() => {
    if (!courseId || !token) return;
    (async () => {
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
  }, [courseId, token])

  // Redirect to first video if on /view-course/:courseId
  useEffect(() => {
    if (
      location.pathname === `/view-course/${courseId}` &&
      courseSectionData &&
      courseSectionData.length > 0 &&
      courseSectionData[0].subSection &&
      courseSectionData[0].subSection.length > 0
    ) {
      navigate(
        `/view-course/${courseId}/section/${courseSectionData[0]._id}/sub-section/${courseSectionData[0].subSection[0]._id}`,
        { replace: true }
      );
    }
  }, [location.pathname, courseId, courseSectionData, navigate]);

  // Fetch live classes for this course
  useEffect(() => {
    const fetchLiveClasses = async () => {
      setLiveLoading(true);
      try {
        const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000/api/v1";
        const res = await fetch(`${BASE_URL}/liveclass/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setLiveClasses(data.liveClasses);
          // In-app notification for classes starting soon
          const now = new Date();
          data.liveClasses.forEach(lc => {
            const start = new Date(lc.scheduledAt);
            const diff = (start - now) / 60000;
            if (diff > 0 && diff <= 10 && lc.status === 'upcoming') {
              toast((t) => (
                <div>
                  <b>Live Class Starting Soon!</b><br/>
                  <span>{lc.title}</span><br/>
                  <span>{start.toLocaleString()}</span>
                  <button onClick={() => toast.dismiss(t.id)} className="mt-2 block text-cyan-400 underline">Dismiss</button>
                </div>
              ), { duration: 10000 });
            }
          });
        }
      } catch (e) {}
      setLiveLoading(false);
    };
    if (courseId && token) fetchLiveClasses();
  }, [courseId, token]);

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <div className="bg-slate-900/90 border border-slate-700/40 rounded-2xl shadow-2xl p-10 text-center max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-red-400 mb-4">Course Not Found</h2>
          <p className="text-slate-100 text-lg mb-2">{error}</p>
          <p className="text-slate-400/80">Please check the course link or contact support if you believe this is a mistake.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar */}
      <VideoDetailsSidebar setReviewModal={setReviewModal} onLiveTab={() => setActiveTab("live")} />
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/30 flex items-center justify-between px-6 py-4 shadow-lg">
          <div className="flex items-center gap-4">
            <button
              className="px-4 py-2 rounded-lg bg-indigo-700/80 hover:bg-indigo-600 text-white font-semibold shadow"
              onClick={() => navigate(-1)}
            >
              &larr; Back
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{course?.courseName || "Course"}</h2>
              <div className="text-slate-300 text-sm">{course?.instructor?.firstName} {course?.instructor?.lastName}</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-slate-100 text-xs mb-1">Progress</div>
            <div className="w-40 h-2 bg-slate-700/40 rounded-full overflow-hidden">
              <div
                className="h-2 bg-indigo-400 rounded-full transition-all"
                style={{ width: totalLectures ? `${(completedLectures.length / totalLectures) * 100}%` : "0%" }}
              ></div>
            </div>
            <div className="text-slate-200 text-xs mt-1">
              {completedLectures.length} / {totalLectures} Lectures Completed
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="px-6 pt-4">
          <Tab tabData={tabData} field={activeTab} setField={setActiveTab} />
        </div>
        {/* Main routed content */}
        <div className="flex-1 flex flex-col px-6 pb-8">
          {activeTab === "content" && <Outlet />}
          {activeTab === "live" && (
            <div>
              <h2 className="text-2xl font-bold text-cyan-300 mb-4">Live Classes</h2>
              {liveLoading ? (
                <div className="text-cyan-200">Loading...</div>
              ) : (
                <ul className="space-y-4">
                  {liveClasses.length === 0 ? (
                    <div className="text-cyan-200">No live classes scheduled for this course.</div>
                  ) : (
                    liveClasses.map(lc => (
                      <li key={lc._id} className="bg-white/10 border border-cyan-900/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <div className="font-semibold text-white text-lg">{lc.title}</div>
                          <div className="text-cyan-100 text-sm mb-1">{lc.description}</div>
                          <div className="text-cyan-300 text-xs mb-1">Scheduled: {new Date(lc.scheduledAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} | Duration: {lc.duration} min</div>
                        </div>
                        <div>
                          <button
                            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-full font-semibold shadow transition-all"
                            onClick={() => setActiveLiveClass(lc)}
                          >
                            Join Class
                          </button>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          )}
          {activeTab === "resources" && (
            <div className="text-cyan-200">Resources tab coming soon.</div>
          )}
          {activeTab === "discussions" && (
            <div className="text-cyan-200">Discussions tab coming soon.</div>
          )}
        </div>
      </main>
      {/* Live Class Room Modal */}
      {activeLiveClass && user && (
        <LiveClassRoom classId={activeLiveClass._id} />
      )}
      {/* Review Modal */}
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </div>
  )
}