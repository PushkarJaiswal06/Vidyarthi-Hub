import { useState } from "react"

export default function InstructorChart({ courses }) {
  const [currChart, setCurrChart] = useState("students")

  if (!courses || courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Data Available</h3>
        <p className="text-neutral-600">Create your first course to see analytics</p>
      </div>
    )
  }

  const maxValue = Math.max(...courses.map(course => 
    currChart === "students" ? (course.totalStudentsEnrolled || 0) : (course.totalAmountGenerated || 0)
  ))

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#EC4899']

  return (
    <div className="flex flex-1 flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-neutral-900">Course Analytics</h3>
          <p className="text-sm text-neutral-600">
            {currChart === "students" ? "Student enrollment by course" : "Revenue by course"}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrChart("students")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
              currChart === "students"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setCurrChart("income")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
              currChart === "income"
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Revenue
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {courses.map((course, index) => {
          const value = currChart === "students" ? (course.totalStudentsEnrolled || 0) : (course.totalAmountGenerated || 0)
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0
          const color = colors[index % colors.length]
          
          return (
            <div key={course._id || index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-neutral-900 truncate">
                  {course.courseName || 'Unnamed Course'}
                </span>
                <span className="text-sm font-semibold text-neutral-600">
                  {currChart === "students" 
                    ? value 
                    : `₹${value.toLocaleString()}`
                  }
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${percentage}%`, 
                    backgroundColor: color 
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-blue-800">Total {currChart === "students" ? "Students" : "Revenue"}</p>
          <p className="text-xl font-bold text-blue-900">
            {currChart === "students" 
              ? courses.reduce((sum, course) => sum + (course.totalStudentsEnrolled || 0), 0)
              : `₹${courses.reduce((sum, course) => sum + (course.totalAmountGenerated || 0), 0).toLocaleString()}`
            }
          </p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-green-800">Average per Course</p>
          <p className="text-xl font-bold text-green-900">
            {currChart === "students" 
              ? Math.round(courses.reduce((sum, course) => sum + (course.totalStudentsEnrolled || 0), 0) / courses.length)
              : `₹${Math.round(courses.reduce((sum, course) => sum + (course.totalAmountGenerated || 0), 0) / courses.length).toLocaleString()}`
            }
          </p>
        </div>
      </div>
    </div>
  )
}