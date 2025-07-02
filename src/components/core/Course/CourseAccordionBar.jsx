import { useEffect, useRef, useState } from "react"
import { AiOutlineDown } from "react-icons/ai"

import CourseSubSectionAccordion from "./CourseSubSectionAccordion"

export default function CourseAccordionBar({ course, isActive, handleActive }) {
  const contentEl = useRef(null)

  // Accordian state
  const [active, setActive] = useState(false)
  useEffect(() => {
    setActive(isActive?.includes(course._id))
  }, [isActive])
  const [sectionHeight, setSectionHeight] = useState(0)
  useEffect(() => {
    setSectionHeight(active ? contentEl.current.scrollHeight : 0)
  }, [active])

  return (
    <div className="overflow-hidden last:mb-0 rounded-2xl border border-cyan-900/30 bg-white/10 backdrop-blur-xl shadow-xl transition-all">
      <div>
        <div
          className={`flex cursor-pointer items-center justify-between px-7 py-6 transition-all rounded-2xl ${active ? "bg-cyan-900/30" : "bg-white/10 hover:bg-cyan-900/10"}`}
          onClick={() => {
            handleActive(course._id)
          }}
        >
          <div className="flex items-center gap-3 text-lg font-semibold text-white">
            <i
              className={`transition-transform duration-300 ${active ? "rotate-180" : "rotate-0"}`}
            >
              <AiOutlineDown />
            </i>
            <span>{course?.sectionName}</span>
          </div>
          <div className="space-x-4 text-cyan-200 font-medium">
            <span>
              {`${course.subSection.length || 0} lecture(s)`}
            </span>
          </div>
        </div>
      </div>
      <div
        ref={contentEl}
        className={`relative overflow-hidden transition-all duration-500 ease-in-out ${active ? "h-auto" : "h-0"}`}
        style={{
          height: active ? sectionHeight : 0,
        }}
      >
        <div className="flex flex-col gap-2 px-7 py-6 font-semibold bg-cyan-900/40 backdrop-blur-xl rounded-b-2xl text-cyan-100 border-t border-cyan-900/20">
          {course?.subSection?.map((subSec, i) => {
            return <CourseSubSectionAccordion subSec={subSec} key={i} />
          })}
        </div>
      </div>
    </div>
  )
}