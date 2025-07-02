import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { getInstructorData } from '../../../../services/operations/profileAPI';
import { Link } from 'react-router-dom';
import { FaUsers, FaBook, FaStar, FaGraduationCap, FaChartLine, FaEye, FaClock, FaCheckCircle } from "react-icons/fa"

export default function Instructor() {
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)
    const [loading, setLoading] = useState(false)
    const [instructorData, setInstructorData] = useState(null)
    const [courses, setCourses] = useState([])

    useEffect(() => {
      ;(async () => {
        setLoading(true)
        try {
          const instructorApiData = await getInstructorData(token)
          const result = await fetchInstructorCourses(token)
          
          if (instructorApiData?.length) setInstructorData(instructorApiData)
          if (result) {
            setCourses(result)
          }
        } catch (error) {
          console.log("Could not fetch instructor data:", error)
        }
        setLoading(false)
      })()
    }, [token])
  
    const totalAmount = instructorData?.reduce(
      (acc, curr) => acc + (curr.totalAmountGenerated || 0),
      0
    ) || 0
  
    const totalStudents = instructorData?.reduce(
      (acc, curr) => acc + (curr.totalStudentsEnrolled || 0),
      0
    ) || 0
  
    const averageRating = instructorData?.reduce(
      (acc, curr) => acc + (curr.averageRating || 0),
      0
    ) / (instructorData?.length || 1) || 0

    const publishedCourses = courses?.filter(course => course.status === "Published")?.length || 0
    const draftCourses = courses?.filter(course => course.status === "Draft")?.length || 0

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="spinner"></div>
        </div>
      )
    }

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.firstName || "Instructor"}! 👋
          </h1>
          <p className="text-lg text-white">
            Here's your course performance overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-white">
          <div className="card-modern p-6 text-center hover:shadow-lg transition-all duration-300 ">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FaBook className="w-6 h-6 text-white" />
            </div>
            <p className="text-lg font-bold text-white">Total Courses</p>
            <p className="mt-2 text-2xl font-bold text-blue-600">
              {instructorData?.length || 0}
            </p>
            <div className="flex justify-center gap-4 mt-3 text-sm">
              <span className="text-green-600 flex items-center gap-1">
                <FaCheckCircle className="w-3 h-3" />
                {publishedCourses} Published
              </span>
              <span className="text-yellow-600 flex items-center gap-1">
                <FaClock className="w-3 h-3" />
                {draftCourses} Draft
              </span>
            </div>
          </div>

          <div className="card-modern p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FaUsers className="w-6 h-6 text-white" />
            </div>
            <p className="text-lg font-bold text-white">Total Students</p>
            <p className="mt-2 text-2xl font-bold text-green-600">
              {totalStudents}
            </p>
            <p className="text-sm text-cyan-200 mt-1">
              Enrolled across all courses
            </p>
          </div>

          <div className="card-modern p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FaStar className="w-6 h-6 text-white" />
            </div>
            <p className="text-lg font-bold text-white">Average Rating</p>
            <p className="mt-2 text-2xl font-bold text-yellow-600">
              {averageRating.toFixed(1)}
            </p>
            <div className="flex justify-center mt-2">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
          </div>

          <div className="card-modern p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FaGraduationCap className="w-6 h-6 text-white" />
            </div>
            <p className="text-lg font-bold text-white">Total Revenue</p>
            <p className="mt-2 text-2xl font-bold text-purple-600">
              ₹{totalAmount.toLocaleString()}
            </p>
            <p className="text-sm text-cyan-200 mt-1">
              Lifetime earnings
            </p>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card-modern p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Course Analytics</h3>
                <p className="text-cyan-200">Student enrollment distribution</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <FaChartLine className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              {instructorData && instructorData.length > 0 ? (
                instructorData.map((course, index) => {
                  const maxStudents = Math.max(...instructorData.map(c => c.totalStudentsEnrolled || 0))
                  const percentage = maxStudents > 0 ? ((course.totalStudentsEnrolled || 0) / maxStudents) * 100 : 0
                  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#EC4899']
                  const color = colors[index % colors.length]
                  
                  return (
                    <div key={course._id || index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-white truncate">
                          {course.courseName || 'Unnamed Course'}
                        </span>
                        <span className="text-sm font-semibold text-cyan-200">
                          {course.totalStudentsEnrolled || 0} students
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
                })
              ) : (
                <div className="text-center py-8 text-cyan-200">
                  No course data available
                </div>
              )}
            </div>
          </div>

          <div className="card-modern p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Performance Metrics</h3>
                <p className="text-cyan-200">Key statistics overview</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <FaEye className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-800">Total Courses</p>
                  <p className="text-xs text-blue-600">Published & Draft</p>
                </div>
                <p className="text-2xl font-bold text-blue-800">
                  {instructorData?.length || 0}
                </p>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-800">Total Students</p>
                  <p className="text-xs text-green-600">Across all courses</p>
                </div>
                <p className="text-2xl font-bold text-green-800">
                  {totalStudents}
                </p>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-purple-800">Total Revenue</p>
                  <p className="text-xs text-purple-600">Lifetime earnings</p>
                </div>
                <p className="text-2xl font-bold text-purple-800">
                  ₹{totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-modern p-6">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 hover:text-black">
            <Link
              to="/dashboard/add-course"
              className="p-4 border-2 border-dashed border-blue-300 rounded-lg text-center hover:border-blue-500 hover:scale-105 hover:bg-cyan-900 transition-all duration-300"
            >
              <FaBook className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="font-semibold text-white">Create New Course</p>
              <p className="text-sm text-cyan-200">Start building your next course</p>
            </Link>
            
            <Link
              to="/dashboard/my-courses"
              className="p-4 border-2 border-dashed border-green-300 rounded-lg text-center hover:border-green-500 hover:bg-green-900 hover:scale-105 transition-all duration-300"
            >
              <FaEye className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="font-semibold text-white">Manage Courses</p>
              <p className="text-sm text-cyan-200">Edit and update existing courses</p>
            </Link>
            
            <div className="p-4 border-2 border-dashed border-purple-300 rounded-lg text-center">
              <FaChartLine className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="font-semibold text-white">View Analytics</p>
              <p className="text-sm text-cyan-200">Detailed performance insights</p>
            </div>
          </div>
        </div>
      </div>
    )
  }