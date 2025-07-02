import { useEffect, useState } from "react"
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack, IoMdMenu } from "react-icons/io"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"

import IconBtn from "../../common/IconBtn"

export default function VideoDetailsSidebar({ setReviewModal }) {
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
    ;(() => {
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
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionData, courseEntireData, location.pathname])

  // Sidebar content as a function for reuse
  const sidebarContent = (
    <div className="flex h-full w-full flex-col">
      <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-cyan-900/30 py-5 text-lg font-bold text-white">
        <div className="flex w-full items-center justify-between ">
          <div
            onClick={() => {
              navigate(`/dashboard/enrolled-courses`)
            }}
            className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-cyan-100 p-1 text-cyan-700 hover:scale-90"
            title="back"
          >
            <IoIosArrowBack size={30} />
          </div>
          <IconBtn
            text="Add Review"
            customClasses="ml-auto"
            onclick={() => setReviewModal(true)}
          />
        </div>
        <div className="flex flex-col">
          <p>{courseEntireData?.courseName}</p>
          <p className="text-sm font-semibold text-cyan-300">
            {completedLectures?.length} / {totalNoOfLectures}
          </p>
        </div>
      </div>
      <div className="h-full overflow-y-auto">
        {courseSectionData.map((course, index) => (
          <div
            className="mt-2 cursor-pointer text-sm text-white"
            onClick={() => setActiveStatus(course?._id)}
            key={index}
          >
            {/* Section */}
            <div className="flex flex-row justify-between bg-cyan-900/40 px-5 py-4 rounded-t-xl">
              <div className="w-[70%] font-semibold">
                {course?.sectionName}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`${activeStatus === course?._id ? "rotate-0" : "rotate-180"} transition-all duration-500`}
                >
                  <BsChevronDown />
                </span>
              </div>
            </div>
            {/* Sub Sections */}
            {activeStatus === course?._id && (
              <div className="transition-[height] duration-500 ease-in-out">
                {course.subSection.map((topic, i) => (
                  <div
                    className={`flex gap-3 px-5 py-2 ${
                      videoBarActive === topic._id
                        ? "bg-cyan-200 font-semibold text-cyan-900"
                        : "hover:bg-cyan-900/60"
                    } `}
                    key={i}
                    onClick={() => {
                      navigate(
                        `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                      )
                      setVideoBarActive(topic._id)
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={completedLectures.includes(topic?._id)}
                      onChange={() => {}}
                    />
                    {topic.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="md:hidden fixed top-20 left-2 z-40">
        <button
          className="p-2 bg-cyan-700 rounded-full shadow-lg"
          onClick={() => setDrawerOpen(true)}
        >
          <IoMdMenu className="text-white text-2xl" />
        </button>
      </div>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-[calc(100vh-3.5rem)] w-72 flex-col bg-white/10 backdrop-blur-xl border-r border-cyan-900/30 shadow-xl">
        {sidebarContent}
      </div>
      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex">
          <div className="w-72 bg-white/10 backdrop-blur-xl border-r border-cyan-900/30 shadow-xl h-full">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={() => setDrawerOpen(false)} />
        </div>
      )}
    </>
  )
}